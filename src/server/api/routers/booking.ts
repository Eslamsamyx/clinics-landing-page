import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { BookingStatus } from "@prisma/client";
import { addMinutes, isBefore, startOfDay, endOfDay } from "date-fns";

export const bookingRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        serviceId: z.string(),
        firstName: z.string().min(1),
        lastName: z.string().min(1),
        email: z.string().optional().nullable(),
        phone: z.string().min(10),
        date: z.date(),
        startTime: z.date(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Get service to calculate end time
      const service = await ctx.db.service.findUnique({
        where: { id: input.serviceId },
      });

      if (!service) {
        throw new Error("الخدمة غير موجودة");
      }

      const endTime = addMinutes(input.startTime, service.duration);

      // Check for conflicts using proper overlap detection
      // Two bookings overlap if: start1 < end2 AND end1 > start2
      const conflicts = await ctx.db.booking.findMany({
        where: {
          serviceId: input.serviceId,
          date: input.date,
          status: {
            in: [BookingStatus.PENDING, BookingStatus.CONFIRMED],
          },
          AND: [
            { startTime: { lt: endTime } },
            { endTime: { gt: input.startTime } },
          ],
        },
      });

      if (conflicts.length > 0) {
        throw new Error("هذا الموعد محجوز بالفعل. الرجاء اختيار موعد آخر.");
      }

      // Validate email if provided
      if (input.email && input.email.trim() !== "") {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(input.email)) {
          throw new Error("الرجاء التأكد من إدخال بريد إلكتروني صحيح أو تركه فارغاً.");
        }
      }

      // Create a new patient record for each booking
      const patient = await ctx.db.patient.create({
        data: {
          firstName: input.firstName,
          lastName: input.lastName,
          email: input.email && input.email.trim() !== "" ? input.email.trim() : null,
          phone: input.phone,
        },
      });

      return ctx.db.booking.create({
        data: {
          patientId: patient.id,
          serviceId: input.serviceId,
          date: input.date,
          startTime: input.startTime,
          endTime,
          notes: input.notes,
          status: BookingStatus.PENDING,
        },
        include: {
          service: true,
          patient: true,
        },
      });
    }),

  getAvailableSlots: publicProcedure
    .input(
      z.object({
        serviceId: z.string(),
        date: z.date(),
      })
    )
    .query(async ({ ctx, input }) => {
      const service = await ctx.db.service.findUnique({
        where: { id: input.serviceId },
      });

      if (!service) {
        throw new Error("الخدمة غير موجودة");
      }

      // Get all bookings for the day
      const bookings = await ctx.db.booking.findMany({
        where: {
          serviceId: input.serviceId,
          date: input.date,
          status: {
            in: [BookingStatus.PENDING, BookingStatus.CONFIRMED],
          },
        },
        orderBy: { startTime: "asc" },
      });

      // Generate all time slots (9 AM to 5 PM) with availability status
      const slots: { time: Date; isBooked: boolean }[] = [];
      const dayStart = startOfDay(input.date);
      dayStart.setHours(9, 0, 0, 0);
      const dayEnd = startOfDay(input.date);
      dayEnd.setHours(17, 0, 0, 0);

      let currentTime = dayStart;
      while (isBefore(currentTime, dayEnd)) {
        const slotEnd = addMinutes(currentTime, service.duration);

        // Check if slot conflicts with existing bookings
        // Two time periods overlap if: start1 < end2 AND end1 > start2
        const hasConflict = bookings.some((booking) => {
          return currentTime < booking.endTime && slotEnd > booking.startTime;
        });

        slots.push({
          time: new Date(currentTime),
          isBooked: hasConflict,
        });

        currentTime = addMinutes(currentTime, 30); // 30-minute intervals
      }

      return slots;
    }),

  getByEmail: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .query(async ({ ctx, input }) => {
      const patient = await ctx.db.patient.findFirst({
        where: { email: input.email },
        include: {
          bookings: {
            include: {
              service: true,
              sessionNotes: true,
            },
            orderBy: { date: "desc" },
          },
        },
      });

      return patient?.bookings ?? [];
    }),

  updateStatus: publicProcedure
    .input(
      z.object({
        id: z.string(),
        status: z.nativeEnum(BookingStatus),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.booking.update({
        where: { id: input.id },
        data: { status: input.status },
      });
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const booking = await ctx.db.booking.findUnique({
        where: { id: input.id },
        include: {
          service: true,
          patient: true,
        },
      });

      if (!booking) {
        throw new Error("الحجز غير موجود");
      }

      return booking;
    }),
});

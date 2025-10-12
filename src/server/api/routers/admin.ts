import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { BookingStatus, AdminRole } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { getServerAuthSession } from "~/server/auth";
import bcrypt from "bcryptjs";

// Admin-only procedure (for any authenticated admin)
const adminProcedure = publicProcedure.use(async ({ ctx, next }) => {
  const session = await getServerAuthSession({ req: ctx.req!, res: ctx.res! });

  if (!session?.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return next({
    ctx: {
      ...ctx,
      session,
    },
  });
});

// Super admin procedure (only for ADMIN role - can manage users)
const superAdminProcedure = adminProcedure.use(async ({ ctx, next }) => {
  const admin = await ctx.db.admin.findUnique({
    where: { email: ctx.session.user.email! },
  });

  if (!admin || admin.role !== AdminRole.ADMIN) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "فقط المسؤولون يمكنهم الوصول إلى هذه الصفحة"
    });
  }

  return next({
    ctx: {
      ...ctx,
      admin,
    },
  });
});

export const adminRouter = createTRPCRouter({
  // Get current admin user info
  getCurrentAdmin: adminProcedure.query(async ({ ctx }) => {
    const admin = await ctx.db.admin.findUnique({
      where: { email: ctx.session.user.email! },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    return admin;
  }),

  // Dashboard Statistics
  getStats: superAdminProcedure.query(async ({ ctx }) => {
    const [totalBookings, pendingBookings, confirmedBookings, totalServices] =
      await Promise.all([
        ctx.db.booking.count(),
        ctx.db.booking.count({ where: { status: BookingStatus.PENDING } }),
        ctx.db.booking.count({ where: { status: BookingStatus.CONFIRMED } }),
        ctx.db.service.count({ where: { active: true } }),
      ]);

    return {
      totalBookings,
      pendingBookings,
      confirmedBookings,
      totalServices,
    };
  }),

  // Get bookings over time for charts
  getBookingsOverTime: superAdminProcedure
    .input(z.object({ days: z.number().default(30) }).optional())
    .query(async ({ ctx, input }) => {
      const days = input?.days ?? 30;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      startDate.setHours(0, 0, 0, 0);

      const bookings = await ctx.db.booking.findMany({
        where: {
          createdAt: {
            gte: startDate,
          },
        },
        select: {
          createdAt: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      });

      // Group bookings by date
      const bookingsByDate = new Map<string, number>();

      // Initialize all dates with 0
      for (let i = 0; i < days; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        const dateStr = date.toISOString().split("T")[0];
        bookingsByDate.set(dateStr!, 0);
      }

      // Count bookings per date
      bookings.forEach((booking) => {
        const dateStr = booking.createdAt.toISOString().split("T")[0];
        if (dateStr) {
          bookingsByDate.set(dateStr, (bookingsByDate.get(dateStr) ?? 0) + 1);
        }
      });

      // Convert to array format for recharts
      return Array.from(bookingsByDate.entries()).map(([date, count]) => ({
        date,
        count,
      }));
    }),

  // Get service popularity stats
  getServiceStats: superAdminProcedure.query(async ({ ctx }) => {
    const services = await ctx.db.service.findMany({
      include: {
        _count: {
          select: { bookings: true },
        },
      },
      orderBy: {
        bookings: {
          _count: "desc",
        },
      },
    });

    return services.map((service) => ({
      name: service.name,
      bookings: service._count.bookings,
      revenue: service.price ? service._count.bookings * service.price.toNumber() : 0,
    }));
  }),

  // Get booking status distribution
  getBookingStatusDistribution: superAdminProcedure.query(async ({ ctx }) => {
    const [pending, confirmed, completed, cancelled] = await Promise.all([
      ctx.db.booking.count({ where: { status: BookingStatus.PENDING } }),
      ctx.db.booking.count({ where: { status: BookingStatus.CONFIRMED } }),
      ctx.db.booking.count({ where: { status: BookingStatus.COMPLETED } }),
      ctx.db.booking.count({ where: { status: BookingStatus.CANCELLED } }),
    ]);

    return [
      { name: "قيد الانتظار", value: pending, status: "PENDING" },
      { name: "مؤكد", value: confirmed, status: "CONFIRMED" },
      { name: "مكتمل", value: completed, status: "COMPLETED" },
      { name: "ملغي", value: cancelled, status: "CANCELLED" },
    ];
  }),

  // Get peak times analysis
  getPeakTimes: superAdminProcedure.query(async ({ ctx }) => {
    const bookings = await ctx.db.booking.findMany({
      select: {
        startTime: true,
      },
    });

    // Initialize data structure for days and hours
    const daysOfWeek = ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
    const peakData: { [key: string]: number } = {};

    // Initialize all day-hour combinations
    daysOfWeek.forEach((day) => {
      peakData[day] = 0;
    });

    // Count bookings by day of week
    bookings.forEach((booking) => {
      const day = booking.startTime.getDay();
      const dayName = daysOfWeek[day];
      if (dayName) {
        peakData[dayName] = (peakData[dayName] ?? 0) + 1;
      }
    });

    // Convert to array format
    return daysOfWeek.map((day) => ({
      day,
      bookings: peakData[day] ?? 0,
    }));
  }),

  // Booking Management
  getAllBookings: adminProcedure
    .input(
      z
        .object({
          status: z.nativeEnum(BookingStatus).optional(),
          serviceId: z.string().optional(),
          date: z.date().optional(),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.booking.findMany({
        where: {
          ...(input?.status && { status: input.status }),
          ...(input?.serviceId && { serviceId: input.serviceId }),
          ...(input?.date && {
            date: {
              gte: new Date(input.date.setHours(0, 0, 0, 0)),
              lt: new Date(input.date.setHours(23, 59, 59, 999)),
            },
          }),
        },
        include: {
          service: true,
          patient: true,
          sessionNotes: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }),

  // Get single booking with full patient history
  getBookingDetails: adminProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const booking = await ctx.db.booking.findUnique({
        where: { id: input.id },
        include: {
          service: true,
          patient: {
            include: {
              bookings: {
                include: {
                  service: true,
                  sessionNotes: true,
                },
                orderBy: { date: "desc" },
              },
            },
          },
          sessionNotes: true,
        },
      });

      return booking;
    }),

  // Add session note to booking
  addSessionNote: adminProcedure
    .input(
      z.object({
        bookingId: z.string(),
        doctorNote: z.string().min(1),
        diagnosis: z.string().optional(),
        prescription: z.string().optional(),
        followUpRequired: z.boolean().default(false),
        followUpDate: z.date().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.sessionNote.create({
        data: input,
      });
    }),

  // Update patient record
  updatePatient: adminProcedure
    .input(
      z.object({
        id: z.string(),
        dateOfBirth: z.date().optional(),
        bloodType: z.string().optional(),
        allergies: z.string().optional(),
        chronicConditions: z.string().optional(),
        emergencyContact: z.string().optional(),
        emergencyPhone: z.string().optional(),
        generalNotes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      return ctx.db.patient.update({
        where: { id },
        data,
      });
    }),

  // Get all patients
  getAllPatients: adminProcedure.query(async ({ ctx }) => {
    return ctx.db.patient.findMany({
      include: {
        _count: {
          select: { bookings: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }),

  // Search patients by name, phone, or email
  searchPatients: adminProcedure
    .input(z.object({ query: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      return ctx.db.patient.findMany({
        where: {
          OR: [
            { firstName: { contains: input.query, mode: "insensitive" as const } },
            { lastName: { contains: input.query, mode: "insensitive" as const } },
            { phone: { contains: input.query } },
            ...(input.query.includes("@")
              ? [{ email: { contains: input.query, mode: "insensitive" as const } }]
              : []),
          ],
        },
        include: {
          _count: {
            select: { bookings: true },
          },
        },
        take: 10,
      });
    }),

  // Get patient details with full history
  getPatientDetails: adminProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.patient.findUnique({
        where: { id: input.id },
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
    }),

  updateBookingStatus: adminProcedure
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

  deleteBooking: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.booking.delete({
        where: { id: input.id },
      });
    }),

  // Create booking for existing patient
  createBookingForPatient: adminProcedure
    .input(
      z.object({
        patientId: z.string(),
        serviceId: z.string(),
        city: z.string(),
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
        throw new TRPCError({ code: "NOT_FOUND", message: "Service not found" });
      }

      const endTime = new Date(input.startTime);
      endTime.setMinutes(endTime.getMinutes() + service.duration);

      // Check for conflicts
      const conflicts = await ctx.db.booking.findMany({
        where: {
          serviceId: input.serviceId,
          date: input.date,
          status: {
            in: [BookingStatus.PENDING, BookingStatus.CONFIRMED],
          },
          OR: [
            {
              AND: [
                { startTime: { lte: input.startTime } },
                { endTime: { gt: input.startTime } },
              ],
            },
            {
              AND: [
                { startTime: { lt: endTime } },
                { endTime: { gte: endTime } },
              ],
            },
          ],
        },
      });

      if (conflicts.length > 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "This time slot is already booked",
        });
      }

      return ctx.db.booking.create({
        data: {
          patientId: input.patientId,
          serviceId: input.serviceId,
          city: input.city,
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

  // Create new patient
  createPatient: adminProcedure
    .input(
      z.object({
        firstName: z.string().min(1),
        lastName: z.string().min(1),
        email: z.string().optional().nullable(),
        phone: z.string().min(10),
        dateOfBirth: z.date().optional(),
        bloodType: z.string().optional(),
        allergies: z.string().optional(),
        chronicConditions: z.string().optional(),
        emergencyContact: z.string().optional(),
        emergencyPhone: z.string().optional(),
        generalNotes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Validate email if provided
      if (input.email && input.email.trim() !== "") {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(input.email)) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid email address" });
        }
      }

      return ctx.db.patient.create({
        data: {
          ...input,
          email: input.email && input.email.trim() !== "" ? input.email.trim() : null,
        },
      });
    }),

  // Service Management
  createService: superAdminProcedure
    .input(
      z.object({
        name: z.string().min(1),
        description: z.string().optional(),
        duration: z.number().int().positive(),
        price: z.number().optional(),
        active: z.boolean().default(true),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.service.create({
        data: input,
      });
    }),

  updateService: superAdminProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1).optional(),
        description: z.string().optional(),
        duration: z.number().int().positive().optional(),
        price: z.number().optional(),
        active: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      return ctx.db.service.update({
        where: { id },
        data,
      });
    }),

  deleteService: superAdminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.service.delete({
        where: { id: input.id },
      });
    }),

  getAllServices: superAdminProcedure.query(async ({ ctx }) => {
    return ctx.db.service.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { bookings: true },
        },
      },
    });
  }),

  // User Management (ADMIN only)
  getAllUsers: superAdminProcedure.query(async ({ ctx }) => {
    return ctx.db.admin.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        active: true,
        createdAt: true,
      },
    });
  }),

  createUser: superAdminProcedure
    .input(
      z.object({
        email: z.string().email(),
        name: z.string().min(1),
        password: z.string().min(8),
        role: z.nativeEnum(AdminRole),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check if email already exists
      const existing = await ctx.db.admin.findUnique({
        where: { email: input.email },
      });

      if (existing) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "البريد الإلكتروني مستخدم بالفعل",
        });
      }

      const hashedPassword = await bcrypt.hash(input.password, 10);

      return ctx.db.admin.create({
        data: {
          email: input.email,
          name: input.name,
          password: hashedPassword,
          role: input.role,
        },
      });
    }),

  updateUser: superAdminProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1).optional(),
        role: z.nativeEnum(AdminRole).optional(),
        active: z.boolean().optional(),
        password: z.string().min(8).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, password, ...data } = input;

      const updateData: {
        name?: string;
        role?: AdminRole;
        active?: boolean;
        password?: string;
      } = { ...data };

      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        updateData.password = hashedPassword;
      }

      return ctx.db.admin.update({
        where: { id },
        data: updateData,
      });
    }),

  deleteUser: superAdminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Prevent deleting self
      if (ctx.admin.id === input.id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "لا يمكنك حذف حسابك الخاص",
        });
      }

      return ctx.db.admin.delete({
        where: { id: input.id },
      });
    }),
});

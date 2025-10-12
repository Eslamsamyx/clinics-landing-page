import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { getServerAuthSession } from "~/server/auth";

// Admin-only procedure
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

export const videoReviewRouter = createTRPCRouter({
  // Public: Get all active video reviews
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.videoReview.findMany({
      where: { isActive: true },
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
      include: {
        patient: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }),

  // Admin: Get all video reviews (including inactive)
  getAllAdmin: adminProcedure.query(async ({ ctx }) => {
    return ctx.db.videoReview.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phone: true,
          },
        },
      },
    });
  }),

  // Admin: Create video review
  create: adminProcedure
    .input(
      z.object({
        patientId: z.string(),
        patientName: z.string().min(1),
        videoUrl: z.string().url(),
        thumbnailUrl: z.string().url().optional(),
        title: z.string().optional(),
        treatment: z.string().optional(),
        order: z.number().int().default(0),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.videoReview.create({
        data: input,
      });
    }),

  // Admin: Update video review
  update: adminProcedure
    .input(
      z.object({
        id: z.string(),
        patientName: z.string().min(1).optional(),
        videoUrl: z.string().url().optional(),
        thumbnailUrl: z.string().url().optional().nullable(),
        title: z.string().optional().nullable(),
        treatment: z.string().optional().nullable(),
        isActive: z.boolean().optional(),
        order: z.number().int().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      return ctx.db.videoReview.update({
        where: { id },
        data,
      });
    }),

  // Admin: Delete video review
  delete: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.videoReview.delete({
        where: { id: input.id },
      });
    }),

  // Admin: Toggle active status
  toggleActive: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const review = await ctx.db.videoReview.findUnique({
        where: { id: input.id },
      });

      if (!review) {
        throw new Error("المراجعة غير موجودة");
      }

      return ctx.db.videoReview.update({
        where: { id: input.id },
        data: { isActive: !review.isActive },
      });
    }),
});

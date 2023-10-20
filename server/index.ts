import { privateProcedure, publicProcedure, router } from "./trpc";
import { db } from "@/lib/database";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import {
  submitSolutionFormSchema,
  teamEnum,
  userProfileSchema,
} from "@/lib/schemas";
import { currentUser } from "@clerk/nextjs";
import { rankMap } from "@/lib/utils";

export const appRouter = router({
  authCallback: publicProcedure
    .input(
      userProfileSchema.merge(z.object({ techStack: z.array(z.string()) }))
    )
    .mutation(async ({ input }) => {
      if (input.name === "" || input.username === "")
        return {
          success: false,
          message: "Can't insert user with empty values",
          code: "BAD_REQUEST",
        };

      const user = await currentUser();

      if (!user || !user.emailAddresses || !user.id)
        throw new TRPCError({ code: "UNAUTHORIZED" });

      const dbUser = await db.user.findFirst({
        where: { id: user.id },
      });

      if (!dbUser) {
        const userWithThatUsername = await db.user.findFirst({
          where: { username: input.username },
        });
        if (userWithThatUsername)
          return {
            success: false,
            message: "A user with this username already exists",
            code: "CONFLICT",
          };

        await db.user.create({
          data: {
            id: user.id,
            email: user.emailAddresses[0].emailAddress,
            profilePic: user.imageUrl,
            ...input,
          },
        });
      }

      return { success: true, code: "", message: "" };
    }),
  updateProfile: privateProcedure
    .input(
      userProfileSchema.merge(z.object({ techStack: z.array(z.string()) }))
    )
    .mutation(async ({ input, ctx: { userId } }) => {
      if (input.name === "" || input.username === "")
        return {
          success: false,
          message: "Can't insert user with empty values",
          code: "BAD_REQUEST",
          user: null,
        };

      const dbUser = await db.user.findFirst({
        where: { id: userId },
      });

      if (dbUser) {
        if (dbUser.username !== input.username) {
          const userWithThatUsername = await db.user.findFirst({
            where: { username: input.username },
          });
          if (userWithThatUsername)
            return {
              success: false,
              message: "A user with this username already exists",
              code: "CONFLICT",
              user: null,
            };
        }

        const updatedUser = await db.user.update({
          where: {
            id: userId,
          },
          data: {
            ...input,
          },
        });

        return { success: true, code: "", message: "", user: updatedUser };
      }

      return { success: false, code: "", message: "", user: null };
    }),
  followUser: privateProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ ctx: { userId: currentUserId }, input: { userId } }) => {
      const dbUser = await db.user.findFirst({ where: { id: userId } });
      if (!dbUser) throw new TRPCError({ code: "UNAUTHORIZED" });
      const currentUser = await db.user.findFirst({
        where: { id: currentUserId },
      });
      if (!currentUser) throw new TRPCError({ code: "UNAUTHORIZED" });

      await db.user.update({
        where: { id: userId },
        data: {
          followers: [...dbUser.followers, currentUserId],
        },
      });

      await db.user.update({
        where: { id: currentUserId },
        data: {
          following: [...currentUser.following, dbUser.id],
        },
      });
    }),
  unfollowUser: privateProcedure
    .input(z.object({ userId: z.string() }))
    .mutation(async ({ ctx: { userId: currentUserId }, input: { userId } }) => {
      const dbUser = await db.user.findFirst({ where: { id: userId } });
      if (!dbUser) throw new TRPCError({ code: "UNAUTHORIZED" });
      const currentUser = await db.user.findFirst({
        where: { id: currentUserId },
      });
      if (!currentUser) throw new TRPCError({ code: "UNAUTHORIZED" });

      await db.user.update({
        where: { id: userId },
        data: {
          followers: dbUser.followers.filter((val) => val !== currentUserId),
        },
      });
      await db.user.update({
        where: { id: currentUserId },
        data: {
          following: currentUser.following.filter((val) => val !== dbUser.id),
        },
      });
    }),
  submitSolution: privateProcedure
    .input(
      submitSolutionFormSchema.merge(z.object({ challengeId: z.string() }))
    )
    .mutation(async ({ ctx: { userId }, input }) => {
      const challenge = await db.challenge.findFirst({
        where: { id: input.challengeId },
      });

      const dbUser = await db.user.findFirst({ where: { id: userId } });

      if (!challenge)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "The Challenge requested is not found!",
        });

      if (!dbUser)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "We couldn't find your account in the database!",
        });

      await db.solution.create({
        data: {
          liveAppUrl: input.liveAppUrl,
          sourceCodeUrl: input.sourceCodeUrl,
          framework: input.framework,
          solvedBy: userId,
          challengeId: input.challengeId,
        },
      });

      await db.user.update({
        where: { id: userId },
        data: {
          rankPoints: dbUser.rankPoints + 100,
          rank: rankMap(dbUser.rankPoints + 100),
        },
      });
    }),
  getLandingPageData: publicProcedure.query(async () => {
    const challenge = await db.challenge.findFirst({
      where: { current: true },
      orderBy: { createdAt: "desc" },
    });

    if (!challenge) throw new TRPCError({ code: "NOT_FOUND" });

    return { challenge };
  }),
});

export type AppRouter = typeof appRouter;

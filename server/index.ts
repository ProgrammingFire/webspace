import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { publicProcedure, router } from "./trpc";
import { db } from "@/lib/database";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { teamEnum, userProfileSchema } from "@/lib/types";

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

      const { getUser } = getKindeServerSession();
      const user = getUser();

      if (!user.email || !user.id)
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
            email: user.email,
            profilePic: user.picture,
            ...input,
          },
        });
      }

      return { success: true, code: "", message: "" };
    }),
  updateProfile: publicProcedure
    .input(
      userProfileSchema.merge(z.object({ techStack: z.array(z.string()) }))
    )
    .mutation(async ({ input }) => {
      if (input.name === "" || input.username === "")
        return {
          success: false,
          message: "Can't insert user with empty values",
          code: "BAD_REQUEST",
          user: null,
        };

      const { getUser } = getKindeServerSession();
      const user = getUser();

      if (!user.email || !user.id)
        throw new TRPCError({ code: "UNAUTHORIZED" });

      const dbUser = await db.user.findFirst({
        where: { id: user.id },
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
            id: user.id,
          },
          data: {
            ...input,
          },
        });

        return { success: true, code: "", message: "", user: updatedUser };
      }

      return { success: false, code: "", message: "", user: null };
    }),
});

export type AppRouter = typeof appRouter;

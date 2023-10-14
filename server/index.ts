import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { publicProcedure, router } from "./trpc";
import { db } from "@/lib/database";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const appRouter = router({
  authCallback: publicProcedure
    .input(
      z.object({
        name: z.string(),
        username: z.string(),
        team: z.enum(["Earth", "Saturn", "Jupiter", "Mars"]),
      })
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
            username: input.username,
            name: input.name,
            team: input.team,
          },
        });
      }

      return { success: true, code: "", message: "" };
    }),
});

export type AppRouter = typeof appRouter;

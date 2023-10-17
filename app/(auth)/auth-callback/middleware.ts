import { db } from "@/lib/database";
import { currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(_request: NextRequest) {
  const user = await currentUser();

  if (!user || !user.id) {
    return NextResponse.redirect(new URL("/?errMessage=sign-in"));
  }

  const dbUser = await db.user.findFirst({ where: { id: user.id } });

  if (dbUser) return NextResponse.redirect(new URL("/"));
}

export const config = {
  matcher: "/auth-callback",
};

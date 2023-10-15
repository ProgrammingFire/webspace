import { db } from "@/lib/database";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(_request: NextRequest) {
  const { getUser } = getKindeServerSession();
  const user = getUser();

  if (!user || !user.id) {
    return NextResponse.redirect(new URL("/?err-message=sign-in"));
  }

  const dbUser = await db.user.findFirst({ where: { id: user.id } });

  if (dbUser) return NextResponse.redirect(new URL("/"));
}

export const config = {
  matcher: "/auth-callback",
};

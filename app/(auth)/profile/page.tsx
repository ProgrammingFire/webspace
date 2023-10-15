import { db } from "@/lib/database";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

export default async function ProfileRedirect() {
  const { getUser } = getKindeServerSession();
  const user = getUser();
  if (!user || !user.id) redirect("/?errMessage=sign-in");
  const dbUser = await db.user.findFirst({ where: { id: user.id } });
  if (!dbUser) redirect("/auth-callback?origin=profile");

  return redirect(`/${dbUser.username}`);
}

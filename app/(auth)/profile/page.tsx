import { db } from "@/lib/database";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React from "react";

export default async function ProfileRedirect() {
  const user = await currentUser();
  if (!user || !user.id) redirect("/?errMessage=sign-in");
  const dbUser = await db.user.findFirst({ where: { id: user.id } });
  if (!dbUser) redirect("/auth-callback?origin=profile");

  return redirect(`/${dbUser.username}`);
}

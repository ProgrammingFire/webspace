import { db } from "@/lib/database";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

async function Page() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  if (!user || !user.id || !user.email) redirect("/");

  const dbUser = await db.user.findFirst({
    where: { id: user.id, email: user.email },
  });

  if (!dbUser) redirect("/auth-callback?origin=solve");

  return <div>Solve Page</div>;
}

export default Page;

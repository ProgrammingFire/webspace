import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/database";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import Image from "next/image";
import { redirect } from "next/navigation";
import React from "react";

async function Page() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  if (!user || !user.id || !user.email) redirect("/?errMessage=sign-in");

  const dbUser = await db.user.findFirst({
    where: { id: user.id, email: user.email },
  });

  if (!dbUser) redirect("/auth-callback?origin=solve");

  const challenge = await db.challenge.findFirst({
    orderBy: { createdAt: "desc" },
  });

  if (!challenge) return;

  return (
    <div className="flex flex-col space-y-3 items-center py-12 mx-auto">
      <div className="w-2/4">
        <AspectRatio ratio={16 / 9}>
          <Image
            src="https://i.pinimg.com/originals/47/af/9f/47af9f213d7b28827810bb0e91b53cf6.png"
            fill
            alt={challenge.name}
            className="rounded-md object-cover border-4 border-indigo-600"
          />
        </AspectRatio>
      </div>
      <h1 className="text-2xl font-semibold">{challenge.name}</h1>
      <p className="text-slate-300 text-lg">{challenge.description}</p>
      <Button variant="secondary">Submit solution</Button>
    </div>
  );
}

export default Page;

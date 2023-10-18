import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Avatar } from "@/components/ui/avatar";
import { db } from "@/lib/database";
import { currentUser } from "@clerk/nextjs";
import { AvatarImage } from "@radix-ui/react-avatar";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import React from "react";

interface SolutionPageParams {
  params: {
    challengeId: string;
  };
}

export default async function SolutionsPage({
  params: { challengeId },
}: SolutionPageParams) {
  const user = await currentUser();
  if (!user || !user.id || !user.emailAddresses)
    redirect("/?errMessage=sign-in");

  const dbUser = await db.user.findFirst({
    where: { id: user.id },
  });

  if (!dbUser) redirect("/auth-callback?origin=solve");

  const challenge = await db.challenge.findFirst({
    where: { id: challengeId },
  });

  if (!challenge) notFound();

  const solutions = await db.solution.findMany({
    where: { challengeId: challenge.id },
    include: { user: {} },
  });

  const userSolution = solutions.filter((val) => val.solvedBy === user.id);

  const userSolved = userSolution.length !== 0;

  if (!userSolved) redirect("/solve");

  return (
    <div className="px-10 py-10">
      <div className="flex justify-center space-x-3">
        <div className="w-2/3 ">
          <AspectRatio ratio={16 / 9}>
            <Image
              src={challenge.images[0]}
              alt={challenge.name}
              fill
              className="rounded-xl border-4 border-purple-500 object-cover"
            />
          </AspectRatio>
        </div>
        <div className="flex flex-col items-center space-y-3 w-full mt-5">
          <h1 className="font-semibold mx-auto text-center text-2xl">
            Solutions for &quot;{challenge.name}&quot;
          </h1>
          <p className="text-slate-400">{challenge.description}</p>
        </div>
      </div>
      <div className="mt-10">
        {solutions.map((solution) => (
          <div className="flex justify-between border border-border">
            <div className="flex">
              {solution.user.profilePic ? (
                <Image
                  src={solution.user.profilePic}
                  alt={solution.user.name}
                  width={200}
                  height={200}
                />
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

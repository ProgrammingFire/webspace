import SolutionRating from "@/components/SolutionRating";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Avatar } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import { db } from "@/lib/database";
import { cn, getEndDate, isEnded } from "@/lib/utils";
import { currentUser } from "@clerk/nextjs";
import { AvatarImage } from "@radix-ui/react-avatar";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import React from "react";
import { Rating } from "react-simple-star-rating";

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

  const challengeEndDate = getEndDate(challenge.updatedAt);
  const [_, challengeEnded] = isEnded(challengeEndDate);

  const solutions = await db.solution.findMany({
    where: { challengeId: challenge.id },
    include: { user: {} },
  });

  const userSolution = solutions.filter((val) => val.solvedBy === user.id);

  const userSolved = userSolution.length !== 0;

  if (!userSolved || !challengeEnded) redirect("/solve");

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
          <p className="text-slate-400 max-w-lg text-center">
            {challenge.description}
          </p>
        </div>
      </div>
      <div className="mt-10 flex flex-col space-y-2">
        {solutions.map((solution) => (
          <div
            key={solution.id}
            className="flex justify-between border border-border rounded-lg shadow-lg px-5 py-3"
          >
            <div className="flex items-center space-x-3">
              {solution.user.profilePic ? (
                <div className="w-16">
                  <AspectRatio ratio={1 / 1}>
                    <Image
                      src={solution.user.profilePic}
                      alt={solution.user.name}
                      fill
                      className="rounded-lg border-4 border-indigo-500 object-cover"
                    />
                  </AspectRatio>
                </div>
              ) : null}
              <div className="flex flex-col space-y-1 justify-center">
                <h3 className="text-lg font-medium">
                  Solved by{" "}
                  <Link
                    href={`/${solution.user.username}`}
                    className="hover:border-b-2 hover:border-indigo-400"
                  >
                    {solution.user.name}
                  </Link>
                </h3>
                {solution.rating ? (
                  <div className="flex space-x-2 items-center">
                    <SolutionRating initialValue={solution.rating.toNumber()} />
                    <div
                      className={cn(
                        "border border-border px-3 py-1 rounded-md",
                        solution.framework === "Angular" && "text-red-400",
                        solution.framework === "React" && "text-blue-400",
                        solution.framework === "Vue" && "text-green-400",
                        solution.framework === "Svelte" && "text-orange-400"
                      )}
                    >
                      {solution.framework}
                    </div>
                  </div>
                ) : (
                  <p className="text-red-400">Still to be Approved</p>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Link
                href={solution.liveAppUrl}
                className={buttonVariants({ variant: "default" })}
              >
                View App
              </Link>
              <Link
                href={solution.sourceCodeUrl}
                className={buttonVariants({ variant: "outline" })}
              >
                View Repository
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

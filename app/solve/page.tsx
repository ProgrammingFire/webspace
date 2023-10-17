import { getEndDate, isEnded } from "@/lib/utils";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button, buttonVariants } from "@/components/ui/button";
import { db } from "@/lib/database";
import Image from "next/image";
import { redirect } from "next/navigation";
import React from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import SubmitSolutionForm from "@/components/SubmitSolutionForm";
import Link from "next/link";
import { currentUser } from "@clerk/nextjs";

async function Page() {
  const user = await currentUser();
  if (!user || !user.id || !user.emailAddresses)
    redirect("/?errMessage=sign-in");

  const dbUser = await db.user.findFirst({
    where: { id: user.id },
  });

  if (!dbUser) redirect("/auth-callback?origin=solve");

  const challenge = await db.challenge.findFirst({
    where: { current: true },
    orderBy: { createdAt: "desc" },
  });

  if (!challenge) return;

  const userSolution = await db.solution.findFirst({
    where: { solvedBy: dbUser.id },
  });

  const userSolved = !!userSolution;

  const endDate = getEndDate(challenge.updatedAt);
  const [_, ended] = isEnded(endDate);

  return (
    <div className="flex flex-col space-y-3 items-center py-12 mx-auto">
      <div className="w-2/4">
        <AspectRatio ratio={16 / 9}>
          <Image
            src={challenge.images[0]}
            fill
            alt={challenge.name}
            className="rounded-md object-cover border-4 border-indigo-600"
          />
        </AspectRatio>
      </div>
      <h1 className="text-2xl font-semibold">{challenge.name}</h1>
      <p className="text-slate-300 text-lg max-w-lg text-center">
        {challenge.description}
      </p>
      {userSolved ? (
        <Link
          href={`/solutions/${challenge.id}`}
          className={buttonVariants({ variant: "default" })}
        >
          Look at the solutions
        </Link>
      ) : (
        <Dialog>
          <DialogTrigger asChild>
            <Button disabled={ended} variant="outline" className="font-medium">
              Submit solution
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Submit Solution</DialogTitle>
              <DialogDescription>
                Submit an amazing solution for the challenge "{challenge.name}".
              </DialogDescription>
            </DialogHeader>
            <SubmitSolutionForm challengeId={challenge.id} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

export default Page;

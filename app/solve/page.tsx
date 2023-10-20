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
import { ArrowLeft, ArrowRight } from "lucide-react";
import ChallengeView from "@/components/ChallengeView";

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
    <ChallengeView
      challenge={challenge}
      userSolved={userSolved}
      ended={ended}
      landingPage={false}
    />
  );
}

export default Page;

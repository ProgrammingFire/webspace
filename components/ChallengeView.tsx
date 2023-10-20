import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button, buttonVariants } from "@/components/ui/button";
import Image from "next/image";
import React from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import SubmitSolutionForm from "@/components/SubmitSolutionForm";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Challenge } from "@prisma/client";
import { cn } from "@/lib/utils";

interface ChallengeViewProps {
  challenge: Challenge;
  userSolved?: boolean;
  ended?: boolean;
  landingPage: boolean;
}

function ChallengeView({
  challenge,
  ended,
  userSolved,
  landingPage,
}: ChallengeViewProps) {
  return (
    <div
      className={cn(
        "flex flex-col space-y-3 items-center mx-auto",
        !landingPage && "py-12"
      )}
    >
      <div className={cn("w-2/4", landingPage && "w-full")}>
        <AspectRatio ratio={16 / 9}>
          <Image
            src={challenge.images[0]}
            fill
            alt={challenge.name}
            className="rounded-md object-cover border-4 border-indigo-600"
          />
        </AspectRatio>
      </div>
      <div className="flex flex-col items-center space-y-1 mb-3">
        <h1 className="text-2xl font-semibold">{challenge.name}</h1>
        <p className="text-slate-300 text-base max-w-lg text-center">
          {challenge.description}
        </p>
      </div>
      {!landingPage &&
        (userSolved || ended ? (
          <Link
            href={`/solutions/${challenge.id}`}
            className={buttonVariants({ variant: "default" })}
          >
            Look at the solutions <ArrowRight className="w-4 h-4 ml-3" />
          </Link>
        ) : (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="font-medium">
                Submit solution
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Submit Solution</DialogTitle>
                <DialogDescription>
                  Submit an amazing solution for the challenge &quot;
                  {challenge.name}&quot;.
                </DialogDescription>
              </DialogHeader>
              <SubmitSolutionForm challengeId={challenge.id} />
            </DialogContent>
          </Dialog>
        ))}
    </div>
  );
}

export default ChallengeView;

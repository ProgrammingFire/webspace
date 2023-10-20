"use client";

import { buttonVariants } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { ArrowRight, ArrowRightCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { trpc } from "./_trpc/client";
import ChallengeView from "@/components/ChallengeView";
import { Challenge } from "@prisma/client";
import { useState } from "react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Skeleton } from "@/components/ui/skeleton";
import Loading from "@/components/Loading";

export default function Home() {
  const searchParams = useSearchParams();
  const errMessage = searchParams.get("errMessage");

  if (errMessage === "sign-in") {
    toast({
      title: "Not Signed In",
      description:
        "You are not authorized to view/do this action because you are not signed in",
      variant: "destructive",
    });
  }

  const { data, isLoading } = trpc.getLandingPageData.useQuery();

  return (
    <main className="py-12 flex flex-col items-center">
      <div className="flex flex-col items-center space-y-5">
        <div className="flex flex-col items-center space-y-3">
          <h1 className="font-bold text-4xl bg-gradient-to-l primary-foreground">
            Enter the{" "}
            <span className="bg-secondary-bg rounded-md shadow-md ml-2 py-2 px-4">
              <span className="bg-gradient-to-l primary-foreground font-bold">
                Space!
              </span>
            </span>
          </h1>
          <h2 className="text-xl font-semibold text-slate-300">
            learn{" "}
            <span className="bg-gradient-to-l primary-foreground">
              everyday
            </span>{" "}
            by building{" "}
            <span className="bg-gradient-to-l primary-foreground">
              everyday
            </span>
          </h2>
        </div>
        <Link href="/sign-in" className={cn(buttonVariants({}))}>
          Become an Astronaut <ArrowRightCircle className="w-5 h-5 ml-3" />{" "}
          <span className="bg-secondary-bg py-1 px-4 text-white rounded-md ml-3">
            It&apos;s Free!
          </span>
        </Link>
      </div>
      <div className="flex flex-col items-center space-y-5 mt-12">
        <h3 className="text-3xl font-bold bg-gradient-to-l primary-foreground">
          Today&apos;s Challenge
        </h3>
        {isLoading ? (
          <Loading
            title="Loading..."
            description="Getting today's challenge for ya!"
          />
        ) : (
          data && (
            <ChallengeView
              challenge={{
                ...data.challenge,
                createdAt: new Date(data.challenge.createdAt),
                updatedAt: new Date(data.challenge.updatedAt),
              }}
              landingPage
              userSolved
              ended
            />
          )
        )}
      </div>
    </main>
  );
}

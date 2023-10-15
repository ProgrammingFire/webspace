"use client";

import { toast } from "@/components/ui/use-toast";
import { useSearchParams } from "next/navigation";

export default function Home() {
  const searchParams = useSearchParams();
  const errMessage = searchParams.get("errMessage");

  if (errMessage === "sign-in") {
    toast({
      title: "Not Signed In",
      description:
        "You are not authorized to view your profile because you are not signed in",
      variant: "destructive",
    });
  }

  return <main className=""></main>;
}

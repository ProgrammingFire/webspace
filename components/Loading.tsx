import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import React from "react";

interface LoadingProps {
  title: string;
  description: string;
  fullScreen?: boolean;
}

function Loading({ title, description, fullScreen = false }: LoadingProps) {
  return (
    <div
      className={cn(
        "w-full flex justify-center",
        fullScreen ? "min-h-screen items-center" : "mt-28"
      )}
    >
      <div className="flex flex-col items-center justify-center gap-2">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-300" />
        <h1 className="font-semibold text-xl mt-4">{title}</h1>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default Loading;

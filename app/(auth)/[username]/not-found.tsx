import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Home } from "lucide-react";
import Link from "next/link";
import React from "react";

function NotFoundUser() {
  return (
    <main className="grid min-h-[calc(100vh-3.5rem)] place-items-center bg-background px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center">
        <p className="text-lg font-semibold text-indigo-400">404</p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-100 sm:text-5xl">
          User not found
        </h1>
        <p className="mt-6 text-base leading-7 text-slate-300">
          Sorry, we couldn't find the user you're looking for.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            href="/"
            className={cn(
              buttonVariants({ variant: "default" }),
              "flex items-center"
            )}
          >
            <Home className="w-5 h-5 mr-4" /> Go back home
          </Link>
          {/* <a href="#" className="text-sm font-semibold text-gray-900">
            Contact support <span aria-hidden="true">&rarr;</span>
          </a> */}
        </div>
      </div>
    </main>
  );
}

export default NotFoundUser;

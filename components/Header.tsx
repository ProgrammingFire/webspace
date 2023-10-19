import React from "react";
import Link from "next/link";
import Image from "next/image";
import { cn, getEndDate } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button, buttonVariants } from "./ui/button";
import {
  ArrowRightCircleIcon,
  EditIcon,
  Loader2,
  LogOutIcon,
  UserCircle,
  UserIcon,
} from "lucide-react";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import { db } from "@/lib/database";
import { Challenge, User } from "@prisma/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import Timer from "./Timer";
import { auth, currentUser } from "@clerk/nextjs";
import LogoutButton from "./LogoutButton";

async function Header() {
  const user = await currentUser();

  let dbUser: User | null = null;

  if (user && user.id)
    dbUser = await db.user.findFirst({ where: { id: user.id } });

  const challenge = await db.challenge.findFirst({
    where: { current: true },
    orderBy: { createdAt: "desc" },
  });

  if (!challenge) return;

  const endDate = getEndDate(challenge.updatedAt);

  return (
    <header className="fixed top-0 z-10 w-full  h-14 flex justify-between items-center py-2 px-8 border-b border-border bg-background/90 backdrop-blur">
      <div className="h-full flex space-x-4 items-center">
        <Link href="/" className="logo flex items-center space-x-3">
          <Image src="/logo.png" alt="" width={30} height={30} />
          <a className="bg-gradient-to-r font-bold primary-foreground text-lg">
            WebSpace
          </a>
        </Link>
        <Navbar />
      </div>

      <div className="flex space-x-3 h-full items-center">
        <Timer endDate={endDate} />
        {user ? (
          !dbUser ? (
            <Link
              href="/auth-callback?origin=solve"
              className={buttonVariants({ variant: "default" })}
            >
              Setup your account
            </Link>
          ) : (
            <div className="flex items-center space-x-2 h-full">
              <DropdownMenu>
                <DropdownMenuTrigger className="focus:ring-2 focus:ring-offset-2 focus:ring-offset-background focus:ring-indigo-500 rounded-xl">
                  {dbUser.profilePic ? (
                    <Avatar className="rounded-xl h-9 w-9">
                      <AvatarImage
                        src={dbUser.profilePic}
                        alt={`@${user.id}`}
                      />
                      <AvatarFallback className="rounded-xl bg-secondary-bg border border-border">
                        <UserIcon className="text-indigo-300" />
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <Button
                      // size="icon"
                      variant="outline"
                      className="text-purple-300 h-full"
                    >
                      <UserCircle />
                    </Button>
                  )}
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel className="">
                    <span>
                      {dbUser.name} - @{dbUser.username}
                    </span>
                    <div className="border border-border mt-1 rounded-md text-center bg-secondary-bg px-4 py-2">
                      {dbUser.rank} - {dbUser.rankPoints}
                    </div>
                  </DropdownMenuLabel>
                  <Link href="/profile">
                    <DropdownMenuItem className="flex items-center cursor-pointer px-4">
                      <UserIcon className="w-4 h-4 mr-2" /> My Profile
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/edit-profile">
                    <DropdownMenuItem className="flex items-center cursor-pointer px-4">
                      <EditIcon className="w-4 h-4 mr-2" /> Edit Profile
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="px-4">
                    <LogoutButton />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )
        ) : (
          <div className="h-full">
            <Link
              href="/sign-in"
              className={cn(
                "text-sm flex items-center space-x-2",
                buttonVariants({ variant: "default", size: "fit" })
              )}
            >
              <span>Become an Astronaut</span>{" "}
              <ArrowRightCircleIcon className="text-primary-foreground w-5 h-5" />
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;

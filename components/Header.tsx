import React from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button, buttonVariants } from "./ui/button";
import {
  ArrowRightCircleIcon,
  DoorClosedIcon,
  DoorOpenIcon,
  Loader2,
  LogOutIcon,
  UserCircle,
  UserIcon,
} from "lucide-react";
import { usePathname } from "next/navigation";
import {
  LoginLink,
  LogoutLink,
  getKindeServerSession,
} from "@kinde-oss/kinde-auth-nextjs/server";
import Navbar from "./Navbar";

async function Header() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  return (
    <header className="fixed top-0 z-10 w-full  h-14 flex justify-between items-center py-2 px-8 border-b border-border bg-background/90 backdrop-blur">
      <div className="h-full flex space-x-4 items-center">
        <Link href="/" className="logo flex items-center space-x-3">
          <Image src="/logo.png" alt="" width={30} height={30} />
          <a className="text-purple-300 text-lg font-semibold">WebSpace</a>
        </Link>
        <Navbar />
      </div>

      <div className="flex space-x-3 h-full items-center">
        <Link
          href="/solve"
          className={cn(
            buttonVariants({ variant: "outline" }),
            "focus:ring-2 focus:ring-offset-2 focus:ring-offset-background focus:ring-purple-300 bg-secondary-bg flex h-full items-center justify-center text-base font-bold px-8 rounded-xl shadow-lg space-x-3"
          )}
        >
          <span className="bg-gradient-to-t primary-foreground">12</span>
          <span>:</span>
          <span className="bg-gradient-to-b primary-foreground">56</span>
          <span>:</span>
          <span className="bg-gradient-to-t primary-foreground">24</span>
        </Link>
        {user ? (
          <div className="flex items-center space-x-2 text-red-300">
            {user.picture ? (
              <button className="focus:ring-2 focus:ring-offset-2 focus:ring-offset-background focus:ring-purple-300 rounded-xl">
                <Avatar className="rounded-xl w-[2.15rem] h-[2.15rem] ">
                  <AvatarImage src={user.picture} alt={`@${user.id}`} />
                  <AvatarFallback>
                    <Loader2 className="animate-spin text-purple-300" />
                  </AvatarFallback>
                </Avatar>
              </button>
            ) : (
              <Button
                variant="outline"
                className="px-5 space-x-3 text-purple-300"
              >
                <UserCircle className="" /> <span>Profile</span>
              </Button>
            )}
            <LogoutLink
              className={buttonVariants({
                variant: "outline",
                size: "icon",
              })}
            >
              <LogOutIcon className="w-4 h-4" />
            </LogoutLink>
          </div>
        ) : (
          <div className="h-full">
            <LoginLink
              className={cn(
                "text-sm flex items-center space-x-2",
                buttonVariants({ variant: "default", size: "fit" })
              )}
            >
              <span>Become an Astronaut</span>{" "}
              <ArrowRightCircleIcon className="text-primary-foreground w-5 h-5" />
            </LoginLink>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;

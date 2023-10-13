"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { ArrowRightCircleIcon } from "lucide-react";
import { usePathname } from "next/navigation";

function Header() {
  const user = true;
  const pathname = usePathname();

  return (
    <header className="fixed top-0 z-10 w-full  h-14 flex justify-between items-center py-2 px-8 border-b border-border bg-background/90 backdrop-blur">
      <div className="h-full flex space-x-4 items-center">
        <Link href="/" className="logo flex items-center space-x-3">
          <Image src="/logo.png" alt="" width={30} height={30} />
          <a className="text-purple-300 text-lg font-semibold">WebSpace</a>
        </Link>
        <nav className="flex text-sm space-x-4 bg-secondary-bg h-full items-center justify-center px-8 rounded-xl shadow-lg">
          <NavItem text="Home" link="/" active={pathname == "/"} />
          <NavItem text="Blog" link="/blog" active={pathname == "/blog"} />
          <NavItem
            text="Contact"
            link="/contact"
            active={pathname == "/contact"}
          />
          <NavItem text="Learn" link="/learn" active={pathname == "/learn"} />
        </nav>
      </div>

      <div className="flex space-x-3 h-full items-center">
        <div className="bg-secondary-bg flex h-full items-center justify-center text-base font-bold px-8 rounded-xl shadow-lg space-x-3">
          <span className="bg-gradient-to-t primary-foreground">12</span>
          <span>:</span>
          <span className="bg-gradient-to-b primary-foreground">56</span>
          <span>:</span>
          <span className="bg-gradient-to-t primary-foreground">24</span>
        </div>
        {user ? (
          <button className="focus:ring-2 focus:ring-offset-2 focus:ring-offset-background focus:ring-purple-300 rounded-xl">
            <Avatar className="rounded-xl w-[2.15rem] h-[2.15rem] ">
              <AvatarImage src="https://github.com/shadcn.png" alt="@nouman" />
              <AvatarFallback>N</AvatarFallback>
            </Avatar>
          </button>
        ) : (
          <div className="h-full">
            <Button
              variant={"default"}
              size={"fit"}
              className="text-sm flex items-center space-x-2"
            >
              <span>Become an Astronaut</span>{" "}
              <ArrowRightCircleIcon className="text-primary-foreground w-5 h-5" />
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}

interface NavItemProps {
  active?: boolean;
  text: string;
  link: string;
}

function NavItem({ active = false, link, text }: NavItemProps) {
  return (
    <Link href={link} className={cn(active && "text-purple-300 font-bold")}>
      {text}
    </Link>
  );
}

export default Header;

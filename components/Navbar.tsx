"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  return (
    <nav className="flex text-sm space-x-4 bg-secondary-bg h-full items-center justify-center px-8 rounded-xl shadow-lg">
      <NavItem text="Home" link="/" active={pathname == "/"} />
      <NavItem text="Blog" link="/blog" active={pathname == "/blog"} />
      <NavItem text="Contact" link="/contact" active={pathname == "/contact"} />
      <NavItem text="Learn" link="/learn" active={pathname == "/learn"} />
    </nav>
  );
}

interface NavItemProps {
  active?: boolean;
  text: string;
  link: string;
}

function NavItem({ active = false, link, text }: NavItemProps) {
  return (
    <Link href={link} className={cn(active && "text-indigo-300 font-bold")}>
      {text}
    </Link>
  );
}

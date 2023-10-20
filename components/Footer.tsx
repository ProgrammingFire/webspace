"use client";

import Link from "next/link";
import Image from "next/image";
import React from "react";
import { useWindowSize } from "react-use";

export default function Footer() {
  const { height } = useWindowSize();

  return (
    <footer className="bg-secondary-bg flex flex-col divide-y-2 divide-border">
      <div className="flex justify-between px-10 py-5 items-center">
        <Link href="/" className="logo flex items-center space-x-3">
          <Image src="/logo.png" alt="" width={30} height={30} />
          <a className="bg-gradient-to-r font-bold primary-foreground text-xl">
            WebSpace
          </a>
        </Link>
        &copy; WebSpace 2023 All rights reserved. ({height})
      </div>
    </footer>
  );
}

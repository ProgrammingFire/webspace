"use client";

import React from "react";
import { LogOutIcon } from "lucide-react";
import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const { signOut } = useClerk();
  const router = useRouter();

  return (
    <button
      onClick={() => signOut().then(() => router.push("/"))}
      className="text-red-300 flex items-center"
    >
      <LogOutIcon className="w-4 h-4 mr-2" /> Logout
    </button>
  );
}

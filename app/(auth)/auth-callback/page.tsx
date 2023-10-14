"use client";

import { redirect, useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import Loading from "@/components/Loading";
import { trpc } from "@/app/_trpc/client";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { FileWarning, UserCircleIcon } from "lucide-react";
import { Team } from "@prisma/client";

interface FormError {
  element?: "username" | "fullName" | "team" | "all";
  message?: string;
}

export default function Page() {
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [team, setTeam] = useState<Team>("Earth");
  const [errors, setErrors] = useState<FormError | null>(null);

  const router = useRouter();

  const searchParams = useSearchParams();
  const origin = searchParams.get("origin");

  const { mutate: setup, isLoading } = trpc.authCallback.useMutation({
    onSuccess: ({ success, message, code }) => {
      if (success) router.push(origin ? `/${origin}` : "/solve");
      if (!success) {
        if (code === "CONFLICT")
          setErrors({ element: "username", message: message });
        if (code === "BAD_REQUEST")
          setErrors({ element: "all", message: message });
      }
    },
    onError: (err) => {
      if (err.data?.code === "UNAUTHORIZED") router.push("/");
    },
    retry: true,
    retryDelay: 500,
  });

  function onSubmit() {
    setup({ name: fullName, username, team });
  }

  if (isLoading)
    return (
      <Loading
        title="Setting up your account"
        description="You will be automatically redirected after we have set everything up
  for you..."
      />
    );

  return (
    <div className="max-w-lg mx-auto mt-24 flex flex-col space-y-6">
      {errors?.element === "all" && (
        <div className="text-red-400">{errors?.message}</div>
      )}
      <div className="flex flex-col space-y-2">
        <Label htmlFor="username" className="flex space-x-2">
          <span>Username</span>
          {errors?.element === "username" && (
            <span className="text-red-400 flex items-center">
              <FileWarning className="w-4 h-4" /> {errors.message}
            </span>
          )}
        </Label>
        <Input
          placeholder="webspace"
          id="username"
          onChange={(e) => setUsername(e.target.value)}
          value={username}
        />
      </div>

      <div className="flex flex-col space-y-2">
        <Label htmlFor="fullName" className="flex space-x-2">
          <span>Full Name</span>
          {errors?.element === "fullName" && (
            <span className="text-red-400 flex items-center">
              <FileWarning className="w-4 h-4" /> {errors.message}
            </span>
          )}
        </Label>
        <Input
          id="fullName"
          placeholder="Nouman Rahman"
          onChange={(e) => setFullName(e.target.value)}
          value={fullName}
        />
      </div>

      <div className="flex flex-col space-y-2">
        <Label htmlFor="team" className="flex space-x-2">
          <span>Team</span>
          {errors?.element === "team" && (
            <span className="text-red-400 flex items-center">
              <FileWarning className="w-4 h-4" /> {errors.message}
            </span>
          )}
        </Label>
        <Select
          onValueChange={(value) => setTeam(value as Team)}
          value={team}
          defaultValue={"Team Earth"}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a Planet which resembles your Team" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Earth">Team Earth</SelectItem>
            <SelectItem value="Mars">Team Mars</SelectItem>
            <SelectItem value="Jupiter">Team Jupiter</SelectItem>
            <SelectItem value="Saturn">Team Saturn</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" onClick={onSubmit}>
        <UserCircleIcon className="w-4 h-4 mr-4" />
        Setup your account
      </Button>
    </div>
  );
}

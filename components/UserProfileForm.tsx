"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { FormEvent, KeyboardEvent, useState } from "react";
import { Label } from "./ui/label";
import { trpc } from "@/app/_trpc/client";
import { useRouter, useSearchParams } from "next/navigation";
import { userProfileSchema as formSchema } from "@/lib/types";
import { Loader2, UserCircle } from "lucide-react";

interface UserProfileFormProps {
  defaultValues: {
    username: string;
    name: string;
    bio: string;
    team: "Earth" | "Saturn" | "Jupiter" | "Mars";
    twitter: string;
    github: string;
    youtube: string;
    website: string;
  };
}

export default function UserProfileForm({
  defaultValues,
}: UserProfileFormProps) {
  const [techStack, setTechStack] = useState<string[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const origin = searchParams.get("origin");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const { mutate: setup, isLoading } = trpc.authCallback.useMutation({
    onSuccess: ({ success, message, code }) => {
      if (success) router.push(origin ? `/${origin}` : "/solve");
      if (!success) {
        if (code === "CONFLICT")
          form.setError("username", { message: message });
      }
    },
    onError: (err) => {
      if (err.data?.code === "UNAUTHORIZED") router.push("/");
    },
    retry: true,
    retryDelay: 500,
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setup({ ...values, techStack });
  }

  function addTechToStack(event: any): void {
    if (event.key === "Enter" && event.target.value !== "") {
      setTechStack([...techStack, event.target.value]);
      event.target.value = "";
    }
  }

  const checkKeyDown = (e: KeyboardEvent<HTMLFormElement>) => {
    if (e.key === "Enter") e.preventDefault();
  };

  return (
    <div className="max-w-xl mx-auto my-24">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          onKeyDown={(e) => checkKeyDown(e)}
          className="space-y-8"
        >
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="webspace" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full name</FormLabel>
                <FormControl>
                  <Input placeholder="Nouman Rahman" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>About you</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="I am a senior developer on a random big tech company..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="team"
            render={({ field }) => (
              <FormItem>
                <FormLabel>About you</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a Planet" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Earth">Team Earth</SelectItem>
                      <SelectItem value="Mars">Team Mars</SelectItem>
                      <SelectItem value="Jupiter">Team Jupiter</SelectItem>
                      <SelectItem value="Saturn">Team Saturn</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-col space-y-2">
            <Label htmlFor="techStack" className="flex space-x-2">
              <span>Tech Stack</span>
            </Label>
            <Input
              id="techStack"
              placeholder="TypeScript, React, Next.js, Svelte, etc..."
              onKeyDown={(event) => addTechToStack(event)}
            />
            <div className="grid grid-cols-4 gap-2 mt-4">
              {techStack.map((tech, i) => (
                <div
                  onClick={() => {
                    setTechStack((stack) => {
                      return stack.filter((val) => val !== tech);
                    });
                  }}
                  className="cursor-pointer bg-secondary-bg py-2 px-5 rounded-md shadow-md text-center"
                >
                  {tech}
                </div>
              ))}
            </div>
          </div>
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your Location</FormLabel>
                <FormControl>
                  <Input placeholder="India" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="twitter"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Twitter URL</FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://twitter.com/webspace"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="github"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Github URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://github.com/webspace" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="youtube"
            render={({ field }) => (
              <FormItem>
                <FormLabel>YouTube URL</FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://youtube.com/c/webspace"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your Personal Website</FormLabel>
                <FormControl>
                  <Input placeholder="https://webspace.io" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            disabled={isLoading}
            type="submit"
            className="w-full"
            variant="outline"
          >
            {isLoading && <Loader2 className="w-4 h-4 mr-3 animate-spin" />}{" "}
            Setup your account on the space!
          </Button>
        </form>
      </Form>
    </div>
  );
}

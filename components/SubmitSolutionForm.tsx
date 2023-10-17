"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { trpc } from "@/app/_trpc/client";
import { submitSolutionFormSchema as formSchema } from "@/lib/schemas";
import { Loader2 } from "lucide-react";

interface SubmitSolutionFormProps {
  challengeId: string;
}

function SubmitSolutionForm({ challengeId }: SubmitSolutionFormProps) {
  const { mutate: submit, isLoading } = trpc.submitSolution.useMutation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      framework: "React",
      liveAppUrl: "",
      sourceCodeUrl: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    submit({ challengeId, ...values });
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="liveAppUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Live Application URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://myapp.vercel.app" {...field} />
                </FormControl>
                <FormDescription>
                  Live Application hosted on Vercel, Netlify etc.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="sourceCodeUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Live Application URL</FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://github.com/username/myapp"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Git Repository for the application
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="framework"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Framework</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Framework" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Angular">Angular</SelectItem>
                      <SelectItem value="React">React</SelectItem>
                      <SelectItem value="Svelte">Svelte</SelectItem>
                      <SelectItem value="Vue">Vue</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormDescription>
                  The Web Framework used for building the app.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={isLoading} className="w-full" type="submit">
            {isLoading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}{" "}
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default SubmitSolutionForm;

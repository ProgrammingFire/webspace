import { Button, buttonVariants } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Loader2,
  Edit,
  Plus,
  Twitter,
  Youtube,
  Globe,
  Github,
  LocateOff,
  LocateFixed,
  Locate,
  Calendar,
} from "lucide-react";
import React from "react";
import { db } from "@/lib/database";
import { notFound } from "next/navigation";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { cn } from "@/lib/utils";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import UserProfileForm from "@/components/UserProfileForm";
import { ScrollArea } from "@/components/ui/scroll-area";
import FollowButton from "@/components/FollowButton";

interface ProfilePageProps {
  params: {
    username: string;
  };
}

export default async function ProfilePage({
  params: { username },
}: ProfilePageProps) {
  const { getUser } = getKindeServerSession();
  const user = getUser();

  const dbUser = await db.user.findFirst({
    where: { username: username },
  });

  if (!dbUser) {
    notFound();
  }

  const solutions = await db.solution.findMany({
    where: { solvedBy: dbUser.id },
  });

  const createdAtDate = new Date(dbUser.createdAt).toString();
  const createdAtDateSplit = createdAtDate.split(" ");
  return (
    <div className="max-w-5xl mx-auto mt-24">
      <div className="flex items-start justify-between">
        <div className="flex items-center">
          {dbUser.profilePic && (
            <Avatar className="rounded-xl w-20 h-20 border-4 border-indigo-300">
              <AvatarImage
                src={dbUser.profilePic}
                alt={`@${dbUser.username}`}
              />
              <AvatarFallback>
                <Loader2 className="animate-spin text-indigo-300" />
              </AvatarFallback>
            </Avatar>
          )}
          <div className="flex flex-col space-y-1 ml-5">
            <h1 className="text-2xl font-semibold">
              {dbUser.name}{" "}
              <span
                className={cn(
                  "ml-3  py-2 px-4 text-base rounded-md text-background font-bold",
                  dbUser.team === "Jupiter" && "bg-orange-300",
                  dbUser.team === "Saturn" && "bg-blue-300",
                  dbUser.team === "Earth" && "bg-green-300",
                  dbUser.team === "Mars" && "bg-red-300"
                )}
              >
                Team {dbUser.team}
              </span>
            </h1>
            <h3 className="text-base font-medium text-slate-200/60">
              @{dbUser.username}
            </h3>
            <h2 className="font-medium text-base flex space-x-3">
              <span>{dbUser.followers.length} followers</span>{" "}
              <span>{dbUser.following.length} following</span>{" "}
              <span>{solutions.length} challenges solved</span>
            </h2>
          </div>
        </div>
        <div className="flex">
          {user.id === dbUser.id ? (
            <Link
              href="/edit-profile"
              className={buttonVariants({ variant: "outline" })}
            >
              <Edit className="w-4 h-4 mr-2" /> Edit Profile
            </Link>
          ) : user && user.id ? (
            <FollowButton currentUserId={user.id} dbUser={dbUser} />
          ) : (
            <Button variant="outline">
              <Plus className="w-4 h-4 mr-2" /> Login to follow
            </Button>
          )}
        </div>
      </div>
      <div className="flex justify-between border rounded-md min-w-full mt-16 px-20 py-8 text-slate-500">
        <div className="flex space-x-3 items-center">
          {dbUser.twitter && (
            <Link href={dbUser.twitter}>
              <Twitter className="w-5 h-5" />
            </Link>
          )}
          {dbUser.youtube && (
            <Link href={dbUser.youtube}>
              <Youtube className="w-5 h-5" />
            </Link>
          )}
          {dbUser.website && (
            <Link href={dbUser.website}>
              <Globe className="w-5 h-5" />
            </Link>
          )}
          {dbUser.github && (
            <Link href={dbUser.github}>
              <Github className="w-5 h-5" />
            </Link>
          )}
        </div>
        {dbUser.location && (
          <div className="flex font-semibold items-center">
            <Locate className="mr-2 w-5 h-5" /> <span>{dbUser.location}</span>
          </div>
        )}
        <div className="flex space-x-2">
          <Calendar className="w-5 h-5" /> <span>Member since</span>{" "}
          <span className="font-bold">{`${createdAtDateSplit[0]} ${createdAtDateSplit[1]} ${createdAtDateSplit[2]} ${createdAtDateSplit[3]}`}</span>
        </div>
      </div>
      <div className="flex justify-center space-x-3 mt-5">
        <div className="flex flex-col w-1/2 border rounded-md py-8 px-20">
          <h1 className="text-center mx-auto text-lg font-semibold">
            About {dbUser.name}
          </h1>
          <p className="text-slate-300 mt-4 text-center mx-auto">
            {dbUser.bio}
          </p>
        </div>
        <div className="flex flex-col w-1/2 border rounded-md py-8 px-20">
          <h1 className="text-center mx-auto text-lg font-semibold">
            Tech Stack
          </h1>
          <div className="grid grid-cols-3 gap-2 mt-4">
            {dbUser.techStack.map((tech, i) => (
              <div
                key={i}
                className="bg-secondary-bg py-2 px-3 rounded-md text-center"
              >
                {tech}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

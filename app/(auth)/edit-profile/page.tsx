import UserProfileForm from "@/components/UserProfileForm";
import { db } from "@/lib/database";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

export default async function EditProfilePage() {
  const { getUser } = getKindeServerSession();
  const user = getUser();

  if (!user || !user.id) redirect("/?err-message=sign-in");

  const dbUser = await db.user.findFirst({ where: { id: user.id } });
  if (!dbUser) redirect("/auth-callback?origin=edit-profile");

  return (
    <div className="max-w-xl mx-auto my-24">
      <UserProfileForm
        currentUser={dbUser}
        defaultValues={{
          bio: dbUser.bio
            ? dbUser.bio
            : "Hey there I am an astronaut and I have just entered the space!",
          github: dbUser.github ? dbUser.github : "https://github.com/",
          twitter: dbUser.twitter ? dbUser.twitter : "https://twitter.com/",
          name: dbUser.name,
          username: dbUser.username,
          team: dbUser.team,
          website: dbUser.website ? dbUser.website : "https://",
          youtube: dbUser.youtube ? dbUser.youtube : "https://youtube.com/c/",
          location: dbUser.location ? dbUser.location : "",
        }}
        defaultTechStack={[...dbUser.techStack]}
        updateForm
      />
    </div>
  );
}

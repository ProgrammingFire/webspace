import UserProfileForm from "@/components/UserProfileForm";
import { db } from "@/lib/database";

export default async function AuthCallbackPage() {
  return (
    <div className="max-w-xl mx-auto my-24">
      <UserProfileForm
        defaultValues={{
          username: "",
          name: "",
          bio: "Hey there I am an astronaut and I have just entered the space!",
          team: "Earth",
          website: "https://",
          github: "https://github.com/",
          twitter: "https://twitter.com/",
          youtube: "https://youtube.com/c/",
          location: "",
        }}
      />
    </div>
  );
}

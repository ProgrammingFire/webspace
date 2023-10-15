import UserProfileForm from "@/components/UserProfileForm";

export default function AuthCallbackPage() {
  return (
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
      }}
    />
  );
}

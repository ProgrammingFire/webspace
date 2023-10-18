import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex justify-center my-20">
      <SignUp
        appearance={{
          variables: {
            colorPrimary: "#6D28D9",
          },
        }}
      />
    </div>
  );
}

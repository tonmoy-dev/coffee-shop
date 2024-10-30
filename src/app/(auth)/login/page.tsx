import { UserAuthForm } from "@/components/Authentication/UserAuthForm";
import { CoffeeIcon } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="flex flex-col justify-center items-center my-16 md:my-20">
      <div className="border space-y-10 p-10 shadow sm:rounded-lg sm:px-10 w-full md:w-1/3">
        <div className="flex flex-col space-y-2 text-center ">
          <CoffeeIcon className="w-8 h-8 mx-auto" />
          <h1 className="text-2xl font-semibold tracking-tight">Log In</h1>
          <p className="text-sm text-muted-foreground">
            Enter your email below to login
          </p>
        </div>
        <UserAuthForm />
        <p className="px-8 text-center text-sm text-muted-foreground">
          By clicking continue, you agree to our{" "}
          <Link
            href="/terms"
            className="underline underline-offset-4 hover:text-primary"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="underline underline-offset-4 hover:text-primary"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
}

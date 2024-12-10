"use client";

import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";

export const Social = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  const onClick = (provider: "google") => {
    signIn(provider, {
      callbackUrl: callbackUrl || DEFAULT_LOGIN_REDIRECT,
    });
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between ">
        <span className="w-1/5 border-b dark:border-gray-600 lg:w-1/4"></span>
        <a href="#" className="text-xs text-center text-gray-500 uppercase dark:text-gray-400 hover:underline">or</a>
        <span className="w-1/5 border-b dark:border-gray-400 lg:w-1/4"></span>
      </div>
      <div className="flex items-center w-full gap-x-2 my-4">
        <Button
          size="lg"
          className="w-full"
          variant="outline"
          onClick={() => onClick("google")}
        >
          <FcGoogle className="h-5 w-5" />
          <span className="mx-2">Continue with Google</span>
        </Button>
      </div>
    </div>
  );
};

"use client";

import { Button } from "../ui/button";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { signIn } from "next-auth/react";
import { DEFAULT_ROUTES } from "@/routes";

export const Social = () => {

  const onClick = (provider : "google" | "github") => {
    signIn(provider, {
      callbackUrl : DEFAULT_ROUTES
    })
  }
  return (
    <div className="flex items-center w-full gap-x-2 ">
      <Button
        size={"lg"}
        className="w-full"
        variant={"outline"}
        onClick={() => onClick("google")}
      >
        <FcGoogle className="w-5 h-5" />
      
      </Button>

      <Button
        size={"lg"}
        className="w-full"
        variant={"outline"}
        onClick={() => onClick("github")}
      >
        <FaGithub className="w-5 h-5" />
      
      </Button>
    </div>
  );
};

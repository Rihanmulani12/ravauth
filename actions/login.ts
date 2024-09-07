"use server";
import { z } from "zod";
import { AuthError } from "next-auth";
import { signIn } from "@/auth";
import { loginSchema } from "@/schemas";
import { DEFAULT_ROUTES } from "../routes";

export const login = async (values: z.infer<typeof loginSchema>) => {
  const validated = loginSchema.safeParse(values);

  if (!validated.success) {
    return {
      error: "Invalid email or password",
    };
  }

  const { email, password } = validated.data;

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: DEFAULT_ROUTES,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return {
            error: "Invalid credentials",
          };

        default:
          return {
            error: "Something went wrong",
          };
      }
    }

    throw error;
  }
};

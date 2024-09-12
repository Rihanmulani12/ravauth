"use server";
import { z } from "zod";
import { AuthError } from "next-auth";
import { signIn } from "@/auth";
import { sendVerificationEmail } from "@/lib/mail";
import { loginSchema } from "@/schemas";
import { generateVerificationToken } from "@/lib/tokens";
import { DEFAULT_ROUTES } from "../routes";
import { getUserByEmail } from "@/data/user";

export const login = async (values: z.infer<typeof loginSchema>) => {
  const validated = loginSchema.safeParse(values);

  if (!validated.success) {
    return {
      error: "Invalid email or password",
    };
  }

  const { email, password } = validated.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser || !existingUser.email || !existingUser.password) {
    return {
      error: "Email does not exist",
    };
  }

  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(
      existingUser.email
    );

    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token
    );

    return {
      success: "Confirmation email sent",
    };
  }

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

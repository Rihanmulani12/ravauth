"use server";
import { z } from "zod";
import { db } from "@/lib/db";
import { AuthError } from "next-auth";
import { signIn } from "@/auth";
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token";
import { sendVerificationEmail, sendTwoFactorTokenEmail } from "@/lib/mail";
import { loginSchema } from "@/schemas";
import {
  generateVerificationToken,
  generateTwoFactorToken,
} from "@/lib/tokens";
import { DEFAULT_ROUTES } from "../routes";
import { getUserByEmail } from "@/data/user";
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation";

export const login = async (values: z.infer<typeof loginSchema>) => {
  const validated = loginSchema.safeParse(values);

  if (!validated.success) {
    return {
      error: "Invalid email or password",
    };
  }

  const { email, password, code } = validated.data;

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

  if (existingUser.isTwoFactorEnabled && existingUser.email) {
    if (code) {
      const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);

      if (!twoFactorToken) {
        return {
          error: "Invalid code",
        };
      }

      if(twoFactorToken.token !== code) {
        return {
          error: "Invalid code",
        };
      }

      const hasExpired = new Date() > new Date(twoFactorToken.expires);

      if(hasExpired) { 
        return {
          error: "Code has expired",
        } 
      }

      await db.twoFactorToken.delete({
        where : {
          id : twoFactorToken.id
        }
      })

      const existingConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);

      if(existingConfirmation) {
        await db.twoFactorConfirmation.delete({
          where : {
            id : existingConfirmation.id
          }
        })
      }

      await db.twoFactorConfirmation.create({
        data : {
          userId : existingUser.id
        }
      })

    } else {
      const twoFactorToken = await generateTwoFactorToken(existingUser.email);

      await sendTwoFactorTokenEmail(twoFactorToken.email, twoFactorToken.token);

      return {
        twoFactor: true,
      };
    }
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

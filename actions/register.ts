"use server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs"

import { z } from "zod";
import { sendVerificationEmail } from "@/lib/mail";
import { registerSchema } from "@/schemas";
import { getUserByEmail } from "@/data/user";
import { generateVerificationToken } from "@/lib/tokens";



export const register = async (values: z.infer<typeof registerSchema>) => {
  const validated = registerSchema.safeParse(values);

  if (!validated.success) {
    return {
      error: "Invalid fields",
    };
  }

  const { email, password, name } = validated.data;

  const hashedPassword = await bcrypt.hash(password, 10);
  
  const existingUser = await getUserByEmail(email);
  
  if(existingUser) {
    return {
      error: "User already exists",
    }
  }

  await db.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
    },
  });

  const verificationToken = await generateVerificationToken(email);
    
   await sendVerificationEmail(
    verificationToken.email,
    verificationToken.token
   )
  


  return {
    success: "Confirmation email sent",
  };
};

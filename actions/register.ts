"use server";
import { db } from "@/lib/db";
import bcrypt from "bcrypt";
import { z } from "zod";
import { registerSchema } from "@/schemas";
import { getUserByEmail } from "@/data/user";

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

  //todo: send email vrification
  


  return {
    success: "User created",
  };
};

"use server";
import { z } from "zod";
import { loginSchema } from "@/schemas";

export const login = async (values : z.infer<typeof loginSchema>) => {
    const validated = loginSchema.safeParse(values);

    if(!validated.success) {
        return {
            error : "Invalid email or password"
        }
    }

    return {
        success: "Email sent!"}
}



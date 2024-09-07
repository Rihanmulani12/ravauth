"use server";
import { z } from "zod";
import { registerSchema} from "@/schemas";

export const register = async (values : z.infer<typeof registerSchema>) => {
    const validated = registerSchema.safeParse(values);

    if(!validated.success) {
        return {
            error : "Invalid fields"
        }
    }

    return {
        success: "Email sent!"}
}



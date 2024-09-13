"use server";

import { ResetSchema } from "@/schemas";

import { z } from "zod";
import { getUserByEmail } from "@/data/user";

import { generatePasswordResetToken } from "@/lib/tokens";
import { sendPasswordResetEmail } from "@/lib/mail";

export const reset = async(values : z.infer<typeof ResetSchema>) => {
    const validateFields = ResetSchema.safeParse(values);

    if(!validateFields.success) {
        return {
            error : "Invalid email!"
        }
    }

    const {email} = validateFields.data;
    const existingUser = await getUserByEmail(email);

    if(!existingUser) {
        return {
          error : "Email not found" 
        }
    }
    
    //todo - create token and send email

    const passwordResttoken = await generatePasswordResetToken(email);

    await sendPasswordResetEmail(
       passwordResttoken.email,
       passwordResttoken.token
    )

    return {
        success : "Email sent"
    }

}

"use server";
import { z } from "zod";
import { db } from "@/lib/db";
import { NewPasswordSchema } from "@/schemas";
import { getPasswordResetTokenByToken } from "@/data/password_rest-token";
import { getUserByEmail } from "@/data/user";
import bcrypt from 'bcryptjs';

export const newPassword = async(values : z.infer<typeof NewPasswordSchema> , token? : string | null ) => {
    if(!token) {
        return{
            error : "Missing token"
        }
    }

    const validateFields = NewPasswordSchema.safeParse(values);

    if(!validateFields.success) {
        return {
            error : "Invalid fields!"
        }
    }

    const {password} = validateFields.data;
    const existingToken = await getPasswordResetTokenByToken(token);

    if(!existingToken) { 
        return {
            error : "Invalid token"
        }   

    }

    const hasExpired = new Date() > new Date(existingToken.expires);

    if(hasExpired) {
        return {
            error : "Token has expired"
        }
    }

    const exisingUser = await getUserByEmail(existingToken.email);

    if(!exisingUser) {
        return {    
            error : "Email does not exist"
        }   
    }

    const hashedPassword = await bcrypt.hash(password,10)

    await db.user.update({
        where : {
            id : exisingUser.id
        },
        data : {
            password : hashedPassword
        }
    })


    await db.passwordResetToken.delete({
        where : {
            id : existingToken.id
        }
    })

    return {
        success : "Password updated"
    }
}
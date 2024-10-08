import * as z from "zod"

export const NewPasswordSchema = z.object({
    password: z.string().min(6,
        {
            message: "Minimum 6 characters required",
        }
    ),
    
})


export const ResetSchema = z.object({
    email: z.string().email(
        {
            message: "Email is required",
        }
    ),
    
})

export const loginSchema = z.object({
    email: z.string().email(
        {
            message: "Email is required",
        }
    ),
    password: z.string().min(1 , {
        message: "Password is required",
    }),

    code : z.optional(z.string()),
      
})

export const registerSchema = z.object({
    email: z.string().email(
        {
            message: "Email is required",
        }
    ),
    password: z.string().min(6, {
        message: "Minimum 6 characters",
    }),
    name : z.string().min(1 , {
        message: "Name is required",
    })
})



import { getVerificationTokenByEmail } from "@/data/verificationToken";
import {v4 as uuid} from "uuid"
import { db } from "./db";
import { getPasswordResetTokenByEmail } from "@/data/password_rest-token";


export const generatePasswordResetToken = async(email : string) => {
    const token = uuid()
    const exprires = new Date(new Date().getTime() + 3600 * 1000);

    const exstingToken = await getPasswordResetTokenByEmail(email);

    if(exstingToken) {
        await db.passwordResetToken.delete({
            where : {
                id : exstingToken.id
            }
        })
    }

    const passwordResetToken = await db.passwordResetToken.create({
        data : {
            email,
            token,
            expires : exprires
        }
    })

    return passwordResetToken;
}

export const generateVerificationToken = async(email : string) => {
    const token = uuid()
    const exprires = new Date(new Date().getTime() + 3600 * 1000);

    const existingToken = await getVerificationTokenByEmail(email);


    if(existingToken) {
        await db.verificationToken.delete({
            where : {
                id : existingToken.id
            }
        })
    }

    const verificationToken = await db.verificationToken.create({
        data : {
            email,
            token,
            expires : exprires
        }
    })

    return verificationToken;


}



    
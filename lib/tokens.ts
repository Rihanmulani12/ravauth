import { getVerificationTokenByEmail } from "@/data/verificationToken";
import {v4 as uuid} from "uuid"
import { db } from "./db";

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
    
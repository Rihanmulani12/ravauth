import NextAuth  from "next-auth";
import authConfig from "@/auth.config";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { getUserById } from './data/user';
import { db } from "./lib/db";
import { getTwoFactorConfirmationByUserId } from "./data/two-factor-confirmation";




export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({

  pages :{
    signIn : "/auth/login",
    error : "/auth/error",
    
  },


  events : {
    async linkAccount({user}){

      await db.user.update({
        where : {
          id : user.id
        },
        data : {
           emailVerified : new Date()
        }
      })
    }
  },
  callbacks: {

    async signIn({user, account}){
      console.log({user, account})
        if(account?.provider !== "credentials") {
          return true
          
        }

        const existingUser = await getUserById(user.id);

        if(!existingUser?.emailVerified)return false;
      

        //todo -2FA check

        if(existingUser.isTwoFactorEnabled){
          const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);

          //console.log({twoFactorConfirmation})

          if(!twoFactorConfirmation) {
            return false
        }

        await db.twoFactorConfirmation.delete({
          where : {
            id : twoFactorConfirmation.id
          }
        })
      }


        return true
    },
     


    async session({ token, session }) {

     console.log({ sessionToken : token })
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if(token.role && session.user) {
        session.user.role = token.role;
      }

      if(token.isTwoFactorEnabled && session.user) {
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
      }
      return session;
    },

    async jwt({ token }) {
     if(!token.sub) {
        return token;
     }

     const existingUser = await getUserById(token.sub);

     if(!existingUser) {
        return token;
     }


     token.role = existingUser.role;

     token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;
      return token;
    },
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
});

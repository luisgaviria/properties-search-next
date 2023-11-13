import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export const options: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                // username: {
                //     label: "Username:",
                //     type: "text",
                //     placeholder: "your-cool-username"
                // },
                password: {
                    label: "Password:",
                    type: "password",
                    placeholder: "your-awesome-password"
                }
            },
            //@ts-ignore
            async authorize(credentials: {email: string; password: string}) {
                
                const user = await prisma.user.findUnique({
                    where: { 
                        email: credentials.email
                    }
                });

                if(!user){ 
                    return null;
                }
                
                const match_password = await bcrypt.compare(credentials.password,user.password);
                if(!match_password){
                    return null;
                } 
                
                return {
                    user: {
                        id: user.id,
                        email: user.email,
                        username: user.username,
                        phoneNumber: user.phoneNumber
                    }
                };
             
            },
        }),


    ],
    callbacks: {
            async jwt({token,user}){
                // console.log(user,token);
                return  {...token,...user};
            },
            async session({ session, user, token }){
                // console.log(user);
                session.user = token.user as any; 
                return session;
            }
    }
}
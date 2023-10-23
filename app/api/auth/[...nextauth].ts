import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export default NextAuth({
    pages: {
        signIn: '/',
    },
    providers: [
        CredentialsProvider({
            id: " credentials",
            name: "Credentials",
            //@ts-ignore
            async authorize(credentials: any){
                const user = await prisma.user.findUnique(
                    {
                        where: {
                            email: credentials.email
                        }
                    }
                )
                if (!user){
                    return null;
                }
                
                const isPasswordMatch = await bcrypt.compare(credentials.password,user.password);

                if(!isPasswordMatch){
                    return null;
                }

                return {
                    id: user.id,
                    username: user.username, 
                    email: user.email
                };
            },
        }),
    ],
    secret: CREDENTIALS_SECRET,
    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60
    },
});
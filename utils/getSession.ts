import type { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";

const getSession = async(authOptions: NextAuthOptions = options)=>{
    const session = await getServerSession(authOptions);
    return session;
};

export default getSession;
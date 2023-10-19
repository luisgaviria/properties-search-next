import { NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt"; 

interface reqBody {
    email: string;
    phoneNumber?: string;
    username: string;
    password: string
}

export async function POST( 
    req: Request,
    res: NextApiResponse
){
    const body: reqBody = await req.json();

    const hashed_password = await bcrypt.hash(body.password,12); 

    await prisma.user.create({
        data: {
            email: body.email,  
            username: body.username,
            password: hashed_password
        }
    });
    return NextResponse.json({
        message: "Succesfully created User"
    }); 
}
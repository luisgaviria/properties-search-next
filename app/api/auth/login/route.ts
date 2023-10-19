import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST( 
    req: NextApiRequest,
    res: NextApiResponse
){
    await prisma.user.create({
        data: {
            email: "test@test.com",
            username: "Test",
            password: "123456789"
        }
    });
    return NextResponse.json({
        message: "Succesfully created User "
    }); 
}
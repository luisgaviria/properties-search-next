import { NextApiRequest, NextApiResponse } from "next";
import getSession from '@/utils/getSession';
import {prisma} from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: NextApiRequest,res: NextApiResponse) {
    const session = await getSession() as any;
    if(session){
        const searches = await prisma.search.findMany({where: {
            userId: session.user.userId 
        },
        orderBy: {
            createdAt: 'desc'
        },
        take: 12
    })
        return NextResponse.json({
            searchHistory: searches
        });
    }
    else{
        return NextResponse.json({
            message: "not authenticated user"
        }); 
    }
}
import { NextResponse } from "next/server";

interface reqBody { 
    firstName: string; 
    lastName: string;
    telephoneNumber: string; 
    moreInfoMessage: string;
    message: string;
}

export async function POST (
    req: Request,
    res: NextResponse
){
    const body: reqBody = await req.json();
    // store somewhere? or what?
}
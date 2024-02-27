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
    // store somewhere? or what?
    const body: reqBody = await req.json(); 

    console.log(body);
    return NextResponse.json({
        message: "Api received form"
    });
}
import { NextResponse } from "next/server";
import Mailgun from "mailgun.js";
import FormData from "form-data";

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

    if(!body){ 
        return NextResponse.json({
            message: "Error not body"
        });
    }
    const mailgun = new Mailgun(FormData);
    const client = mailgun.client({username: 'api',key: process.env.MAILGUN_API_KEY as string});
    const data = {
        from: "properties@"+process.env.MAILGUN_API_DOMAIN,
        to: process.env.MAILGUN_API_TO_EMAIL,
        subject: "New Inquiry",
        text: "New Inquiry was submitted and here is the data: "+JSON.stringify(body),
    }

    await client.messages.create(process.env.MAILGUN_API_DOMAIN as string,data);
    return NextResponse.json({
        message: "Succesfully sent email!"
    });
}
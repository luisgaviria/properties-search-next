import type { NextApiRequest,NextApiResponse } from "next"; 
import { NextResponse } from 'next/server';
import axios from "axios";
export async function GET(
    req: NextApiRequest,
    res: NextApiResponse
){
    // console.log(req.headers.geo); 
    return NextResponse.json({message:"Test"});
}
import { NextRequest, NextResponse } from 'next/server';
import axios from "axios";
import qs from "qs";

const limit = 10;
const calculatePages = (total: number, pageLimit: number) => {
    let pages: number = Math.round(total / pageLimit);
  //   pages = parseInt(pages);
    const rest = total - pages * pageLimit;
    if (rest) {
      pages++;
    }
    return pages;
  }; 
  
export async function GET(
    req: NextRequest, 
    res: NextResponse
){
    if(req.method == "GET"){
        const __query__ = (req.url?.split("?") as string[])[1];
        const queryurl = qs.parse(__query__);
        const page: number = Number(queryurl.page);
        const toSkip = page*limit;
        try{
            const response = await axios.get(
                `https://api.bridgedataoutput.com/api/v2/pub/parcels?access_token=${process.env.API_ACCESS_TOKEN}&limit=${limit}&offset=${toSkip}`
            );
            const pages = calculatePages(response.data.total,limit);
            return NextResponse.json({
                properties: response.data.bundle,
                pages: pages,
                message: "Succesfully get data"
            });
        }
        catch(err){
            console.log(err);
            return NextResponse.json({
                message: "error"
            }); 
        }
    }
}
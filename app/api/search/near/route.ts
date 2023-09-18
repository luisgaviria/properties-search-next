import type { NextApiRequest,NextApiResponse } from "next"; 
import { NextResponse } from 'next/server';
import axios from "axios";
import { Lookup, lookup } from "geoip-lite";


const myIP = "108.26.190.127";

const getGeo = async (ip: string): Promise<Lookup>=>{
    const geo = await lookup(ip) as Lookup;
    return geo;
};

let offset = 0;

export async function GET(
    req: NextApiRequest,
    res: NextApiResponse<{message: string}>
){
    const geo =await getGeo(myIP);
    try {
        let query = `https://api.bridgedataoutput.com/api/v2/mlspin/listings?access_token=${process.env.API_ACCESS_TOKEN}&StandardStatus=Active&PropertyType.in=Residential&offset=${offset}&limit=12&`;
    
        if (geo) {
          const { ll } = geo || {};
          const [lat, lng] = ll || [];
          console.log(lat,lng);
         
          if (lat && lng) {
            query += `near=${lng}, ${lat}`;
          }
        }
        console.log(query);
    
        // const response = await axios.get(query);
        // const listingsNearYou = response.data.bundle;
    
        // offset += 12;
    
        // // If all properties have been fetched, reset the offset
        // if (offset >= response.data.total) {
        //   offset = 0;
        // }
    
        return NextResponse.json({
            // listingsNearYou
            message: "hello"
        });

      } catch (error) {
        // console.error(error);
        // console.error(error);
        // return res
        //   .status(500)
        //   .json({ error: "An error occurred while fetching new listings." });
      }
    // console.log(req.headers.geo); 
}
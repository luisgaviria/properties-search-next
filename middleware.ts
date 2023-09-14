import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import geoip from "fast-geoip";

export async function middleware(request: NextRequest ) {
   console.log("Middleware is fired");
   // var myIP = "108.26.190.127";
   // var geo = await geoip.lookup(myIP); 

   // const headers = new Headers(request.headers);
   // headers.set('geo',geo as any); 
   // const resp = NextResponse.next({
   //    request: {
   //       headers
   //    }
   // });
   // return resp;
}

export const config = {
   matcher: "/api/search/nearYou"
}
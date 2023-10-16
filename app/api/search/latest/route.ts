import type { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";
import axios from "axios";
// import geoip from "geoip-lite";

// const myIP = "108.26.190.127";

// const getGeo = (ip: string) => {
//   const geo = geoip.lookup(ip);
//   console.log(geo);
// };

export interface SearchResponse {
  waterFrontListings?: Property[];
  message: string;
}

interface Property {
  StreetName: string;
  LivingArea: number;
  BedroomsTotal: number;
  BridgeModificationTimestamp: Date;
  StateOrProvince: string;
  Media: Media[];
  Latitude: number;
  BathroomsTotalDecimal: number;
  City: string;
  ListPrice: number;
  Longitude: number;
  NumberOfUnitsTotal: number;
  MLSAreaMajor: null | string;
  StreetNumber: string;
  ListingId: string;
  ListingKey: string;
  distanceFrom: number;
  FeedTypes: any[];
  url: string;
}

interface Media {
  Order: number;
  MediaKey: string;
  MediaURL: string;
  ResourceRecordKey: string;
  ResourceName: string;
  ClassName: string;
  MediaCategory: string;
  MimeType: string;
  MediaObjectID: null;
  ShortDescription: null;
}

export async function GET(
  req: NextApiRequest,
  res: NextApiResponse<SearchResponse>
) {
  try{
    const response = await axios.get(
      `https://api.bridgedataoutput.com/api/v2/mlspin/listings?access_token=${process.env.API_ACCESS_TOKEN}&StandardStatus=Active&limit=12&PropertyType.in=Residential&ListPrice.gte=400000&fields=ListingId,Media,ListPrice,BedroomsTotal,BathroomsTotalDecimal,LivingArea,MLSAreaMajor,City,StateOrProvince,StreetNumber,StreetName,NumberOfUnitsTotal,Latitude,Longitude,ListingContractDate&sortBy=ListingContractDate&order=desc`
    );
    const listings = response.data.bundle;
    return NextResponse.json({
      listings: listings,
      message: "Succesfully get latest listings"
    });
  }
  catch(err){
    console.log(err);
    return NextResponse.json({
      message: "error",
    });
  }
}


// export async function GET(
//   req: NextApiRequest,
//   res: NextApiResponse<SearchResponse>
// ) {
//   try {
//     const response = await axios.get(
//       `https://api.bridgedataoutput.com/api/v2/mlspin/listings?access_token=${process.env.API_ACCESS_TOKEN}&StandardStatus=Active&limit=12&PropertyType.in=Residential&WaterfrontYN=Y&ListPrice.gte=1800000&fields=ListingId,Media,ListPrice,BedroomsTotal,BathroomsTotalDecimal,LivingArea,MLSAreaMajor,City,StateOrProvince,StreetNumber,StreetName,NumberOfUnitsTotal,Latitude,Longitude`
//     );
//     const waterFrontListings = response.data.bundle;
//     return NextResponse.json({
//       waterFrontListings: waterFrontListings,
//       message: "Succesfully get waterfront listings",
//     });
//   } catch (err) {
//     console.log(err);
//     return NextResponse.json({
//       message: "error",
//     });
//   }
// }

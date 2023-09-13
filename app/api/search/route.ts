import type { NextApiRequest, NextApiResponse } from 'next';
import qs from "qs";
import axios from "axios";
import { NextResponse } from 'next/server';

export interface SearchResponse {
    properties?: Property[];
    pages?:      number;
    message: string;
}

interface Property {
    StreetName:                  string;
    LivingArea:                  number;
    BedroomsTotal:               number;
    BridgeModificationTimestamp: Date;
    StateOrProvince:             string;
    Media:                       Media[];
    Latitude:                    number;
    BathroomsTotalDecimal:       number;
    City:                        string;
    ListPrice:                   number;
    Longitude:                   number;
    NumberOfUnitsTotal:          number;
    MLSAreaMajor:                null | string;
    StreetNumber:                string;
    ListingId:                   string;
    ListingKey:                  string;
    distanceFrom:                number;
    FeedTypes:                   any[];
    url:                         string;
}

interface Media {
    Order:             number;
    MediaKey:          string;
    MediaURL:          string;
    ResourceRecordKey: string;
    ResourceName:      string;
    ClassName:         string;
    MediaCategory:     string;
    MimeType:          string;
    MediaObjectID:     null;
    ShortDescription:  null;
}



const limit = 12;
const noPagesLimit = 200;

const calculatePages = (total: number, pageLimit: number) => {
  let pages: number = total / pageLimit;
//   pages = parseInt(pages);
  const rest = total - pages * pageLimit;
  if (rest) {
    pages++;
  }
  return pages;
};

export async function GET(
    req: NextApiRequest,
    res: NextApiResponse<SearchResponse>
    // res: any
){
    if(req.method == "GET"){ 
        const __query__ = (req.url?.split("?") as string[])[1];
        const queryurl =  qs.parse(__query__);
        const page = queryurl.page - 1;
        const queryObj = {
            sortBy: queryurl.sortBy,
            order: queryurl.order,
            near: queryurl.near,
            radius: queryurl.radius,
            NumberOfUnitsTotal: queryurl.NumberOfUnitsTotal,
            City: queryurl.City, // City :
            ListPrice:
            queryurl.ListPriceFrom || queryurl.ListPriceTo
                ? {
                    gte: queryurl.ListPriceFrom, //ListPrice.gte
                    lte: queryurl.ListPriceTo, // ListPrice.lte
                }
                : null,
            BedroomsTotal: queryurl.BedroomsTotal
            ? queryurl.BedroomsTotal === "5+" // Check if it's "5+"
                ? { gte: 5 } // For "5+", use gte: 5 (greater than or equal to 5)
                : { eq: parseInt(queryurl.BedroomsTotal as string) } // For other values, use eq with the parsed integer
            : null,
            BathroomsTotalDecimal:
            queryurl.BathroomsTotalDecimalFrom || queryurl.BathroomsTotalDecimalTo
                ? {
                    gte: queryurl.BathroomsTotalDecimalFrom, // BathroomsTotalDecimal.gte
                    eq: queryurl.BathroomsTotalDecimalTo, // BathroomsTotalDecimal.lte
                }
                : null,
            PropertyType: (queryurl.PropertyType as string)?.split(","), // PropertyType.in
            PropertySubType: (queryurl.PropertySubType as string)?.split(","),
            AssociationFee: queryurl.AssociationFeeFrom
            ? {
                lt: queryurl.AssociationFeeFrom,
                }
            : null,
            AssociationFeeFrequency: null,
            ParkingTotal:
            queryurl.ParkingTotalFrom || queryurl.ParkingTotalTo
                ? {
                    gte: queryurl.ParkingTotalFrom, // ParkingTotal.gte
                    lte: queryurl.ParkingTotalTo, // ParkingTotal.lte
                }
                : null,
            LivingArea:
            queryurl.LivingAreaFrom || queryurl.LivingAreaTo
                ? {
                    gte: queryurl.LivingAreaFrom, // LivingArea.gte
                    lte: queryurl.LivingAreaTo, // LivingArea.lte
                }
                : null,
            LotSizeArea:
            queryurl.LotSizeAreaFrom || queryurl.LotSizeAreaTo
                ? {
                    gte: queryurl.LotSizeAreaFrom, // LotSizeArea.gte
                    lte: queryurl.LotSizeAreaTo, // LotSizeArea.lte
                }
                : null,
            Basement: (queryurl.Basement as string)?.split(","), // Basement.in // Y or N :> Yes or No
            StoriesTotal: queryurl.StoriesTotalFrom
            ? {
                lt: queryurl.StoriesTotalFrom,
                }
            : null,
            ListingId: queryurl.ListingId, // ListingId=
        }
        type queryType = keyof typeof queryObj;
        let query = "";
        for (const key of Object.keys(queryObj)) {
            if (key === "City" && queryObj[key] === "Any") {
              // Skip adding this parameter to the query
              continue;
            }
            if (
              key === "City" &&
              queryObj.near !== undefined &&
              queryObj.near !== "" // Skip "City" if "near" is present and not empty
            ) {
              continue;
            }
        
            if (Array.isArray(queryObj[key as queryType])) {
              query += `&${key}.in=${queryObj[key as queryType]}`;
            } else if (typeof queryObj[key as queryType] == "object" && queryObj[key as queryType]) {
                const element = queryObj[key as queryType] as any;
                const keys2 = Object.keys(element as queryType);
                for(const key2_temp of keys2){
                    if(element[key2_temp]){
                        query += `&${key}.${key2_temp}=${element[key2_temp]}`;
                    }
                }
            } else {
                if(queryObj[key as queryType]){
                    query += `&${key}=${queryObj[key as queryType]}`; 
                }
            }
          }
          
          const toSkip = page*limit;

          try {
            const response = await axios.get(
                `https://api.bridgedataoutput.com/api/v2/mlspin/listings?access_token=${process.env.API_ACCESS_TOKEN}&offset=${toSkip}&limit=${limit}&StandardStatus=Active&fields=ListingId,Media,ListPrice,BedroomsTotal,BathroomsTotalDecimal,LivingArea,MLSAreaMajor,City,StateOrProvince,StreetNumber,StreetName,NumberOfUnitsTotal,Latitude,Longitude${query}`
              );
              const pages = calculatePages(response.data.total, limit);
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
        // return res.status(200).json({
        //     message:  "Hello"
        // });
    }

}
import type { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import qs from "qs";

const noPagesLimit = 200;

export interface SearchResponse {
    properties?: Property[];
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
export async function GET(
    req: NextRequest,
    res: NextResponse<SearchResponse>
){ 
    const __query__ = (req.url?.split("?") as string[])[1];
    const queryurl =  qs.parse(__query__);
    const center = {lat: queryurl.Lat, lng: queryurl.Lng}
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
    if(!center.lat){
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
        console.log("nopagination");
        console.log(query);
        try {
            const response = await axios.get(
                `https://api.bridgedataoutput.com/api/v2/mlspin/listings?access_token=${process.env.API_ACCESS_TOKEN}&limit=${noPagesLimit}&StandardStatus=Active&IDXParticipationYN=true&fields=ListingId,Media,ListPrice,BedroomsTotal,BathroomsTotalDecimal,LivingArea,MLSAreaMajor,City,StateOrProvince,StreetNumber,StreetName,NumberOfUnitsTotal,Latitude,Longitude${query}`
              );
            //   const pages = calculatePages(response.data.total, limit);
              return NextResponse.json({
                properties: response.data.bundle,
                // pages: pages,
                message: "Succesfully get data"
              });
        }
        catch(err){ 
            console.log(err);
            return NextResponse.json({
                message: "error"
            }); 
        }
    } else {
        // i dont think this is working need to dive deeper here but this is generally good idea!
        delete queryObj.City;
        let query = "";
        type queryType = keyof typeof queryObj;
    
        for (const key of Object.keys(queryObj)) {
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
    
        try {
          const response = await axios.get(
            `https://api.bridgedataoutput.com/api/v2/mlspin/listings?access_token=${process.env.API_ACCESS_TOKEN}&limit=${noPagesLimit}&StandardStatus=Active&fields=ListingId,Media,ListPrice,BedroomsTotal,BathroomsTotalDecimal,LivingArea,MLSAreaMajor,City,StateOrProvince,StreetNumber,StreetName,Latitude,Longitude${query}&near=${center.lng},${center.lat}&radius=1mi`
          );
          return NextResponse.json({
            properties: response.data.bundle,
            message: "Succesfully get data"
          });
        } catch (err) {
          console.log("This is the error logged:", err);
          return NextResponse.json({
            err: err
          });
        }
      }
}
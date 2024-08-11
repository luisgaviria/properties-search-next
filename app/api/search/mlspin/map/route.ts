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

interface QueryObj {
  [key: string]: any | undefined;
}

export async function GET(req: NextRequest, res: NextResponse<SearchResponse>) {
  const __query__ = (req.url?.split("?") as string[])[1];
  const queryurl = qs.parse(__query__);
  const center = { lat: queryurl.Lat, lng: queryurl.Lng };

  const queryObj: QueryObj = {
    sortBy: queryurl.sortBy,
    order: queryurl.order,
    near: queryurl.near,
    radius: queryurl.radius,
    NumberOfUnitsTotal: queryurl.NumberOfUnitsTotal,
    City: (queryurl.City as string)?.split(",") || "any", // Ensure this is an array
    ListPrice:
      queryurl.ListPriceFrom || queryurl.ListPriceTo
        ? {
            gte: queryurl.ListPriceFrom,
            lte: queryurl.ListPriceTo,
          }
        : null,
    BedroomsTotal: queryurl.BedroomsTotal
      ? queryurl.BedroomsTotal === "5+"
        ? { gte: 5 }
        : { eq: parseInt(queryurl.BedroomsTotal as string) }
      : null,
    BathroomsTotalDecimal:
      queryurl.BathroomsTotalDecimalFrom || queryurl.BathroomsTotalDecimalTo
        ? {
            gte: queryurl.BathroomsTotalDecimalFrom,
            lte: queryurl.BathroomsTotalDecimalTo,
          }
        : null,
    PropertyType: (queryurl.PropertyType as string)?.split(","),
    PropertySubType: (queryurl.PropertySubType as string)?.split(","),
    AssociationFee: queryurl.AssociationFeeFrom
      ? {
          lt: queryurl.AssociationFeeFrom,
        }
      : null,
    ParkingTotal:
      queryurl.ParkingTotalFrom || queryurl.ParkingTotalTo
        ? {
            gte: queryurl.ParkingTotalFrom,
            lte: queryurl.ParkingTotalTo,
          }
        : null,
    LivingArea:
      queryurl.LivingAreaFrom || queryurl.LivingAreaTo
        ? {
            gte: queryurl.LivingAreaFrom,
            lte: queryurl.LivingAreaTo,
          }
        : null,
    LotSizeArea:
      queryurl.LotSizeAreaFrom || queryurl.LotSizeAreaTo
        ? {
            gte: queryurl.LotSizeAreaFrom,
            lte: queryurl.LotSizeAreaTo,
          }
        : null,
    Basement: (queryurl.Basement as string)?.split(","),
    StoriesTotal: queryurl.StoriesTotalFrom
      ? {
          lt: queryurl.StoriesTotalFrom,
        }
      : null,
    ListingId: queryurl.ListingId,
  };

  type queryType = keyof typeof queryObj;

  let query = "";
  for (const key of Object.keys(queryObj)) {
    if (key === "City" && queryObj.near !== undefined && queryObj.near !== "") {
      continue; // Skip adding City if 'near' is present
    }
    if (
      queryObj[key as queryType] != null &&
      Array.isArray(queryObj[key as queryType])
    ) {
      query += `&${key}.in=${(queryObj[key as queryType] as string[]).join(
        ","
      )}`;
    } else if (
      typeof queryObj[key as queryType] == "object" &&
      queryObj[key as queryType]
    ) {
      const element = queryObj[key as queryType] as any;
      const keys2 = Object.keys(element as queryType);
      for (const key2_temp of keys2) {
        if (element[key2_temp] != null) {
          query += `&${key}.${key2_temp}=${element[key2_temp]}`;
        }
      }
    } else {
      if (queryObj[key as queryType] != null) {
        query += `&${key}=${queryObj[key as queryType]}`;
      }
    }
  }

  if (!center.lat) {
    // Handle query without center coordinates
    try {
      const response = await axios.get(
        `https://api.bridgedataoutput.com/api/v2/mlspin/listings?access_token=${process.env.API_ACCESS_TOKEN}&limit=${noPagesLimit}&StandardStatus=Active&IDXParticipationYN=true&fields=ListingId,Media,ListPrice,BedroomsTotal,BathroomsTotalDecimal,LivingArea,MLSAreaMajor,City,StateOrProvince,StreetNumber,StreetName,Latitude,Longitude${query}`
      );
      return NextResponse.json({
        properties: response.data.bundle,
        message: "Successfully get data",
      });
    } catch (err) {
      console.error("\x1b[31m%s\x1b[0m", "Error in fetching data:", err);
      return NextResponse.json({
        message: "error",
      });
    }
  } else {
    // Handle query with center coordinates
    delete queryObj?.City; // Remove City from the query if center coordinates are provided

    let query = "";
    for (const key of Object.keys(queryObj)) {
      if (
        queryObj[key as queryType] != null &&
        Array.isArray(queryObj[key as queryType])
      ) {
        query += `&${key}.in=${(queryObj[key as queryType] as string[]).join(
          ","
        )}`;
      } else if (
        typeof queryObj[key as queryType] == "object" &&
        queryObj[key as queryType]
      ) {
        const element = queryObj[key as queryType] as any;
        const keys2 = Object.keys(element as queryType);
        for (const key2_temp of keys2) {
          if (element[key2_temp] != null) {
            query += `&${key}.${key2_temp}=${element[key2_temp]}`;
          }
        }
      } else {
        if (queryObj[key as queryType] != null) {
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
        message: "Successfully get data",
      });
    } catch (err) {
      console.error("\x1b[31m%s\x1b[0m", "Error in fetching data:", err);
      return NextResponse.json({
        err: err,
      });
    }
  }
}

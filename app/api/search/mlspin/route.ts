import type { NextApiRequest, NextApiResponse } from "next";
import qs, { ParsedQs } from "qs";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import getSession from "@/utils/getSession";
import { prisma } from "@/lib/prisma";

export interface SearchResponse {
  properties?: Property[];
  pages?: number;
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
  [key: string]: any | undefined
}

const limit = 12;
const noPagesLimit = 200;

const calculatePages = (total: number, pageLimit: number) => {
  let pages: number = Math.floor(total / pageLimit);
  //   pages = parseInt(pages);
  const rest = total - pages * pageLimit;
  if (rest) {
    pages++;
  }
  return pages;
};

// MORE FILTERS
// HOA -> AssociationFee -> added 
// PARKING SPACES -> ParkingTotal -> added
// SQUAREFEET MINIMUM -> livingarea -> added 
// SQUAREFEET MAXIMUM -> added
// LOTSIZE MINIMUM -> Lotsize squarefeet -> added
// LOTSIZE MAXIMUM  -> added 
// BASEMENT  -> Basement array -> added
// OTHER AMENITIES -> Cooling array, pollfeatures, waterfrontFeatures array  done?
// DAYS ON MARKET/ZILLOW! -> our date - ListingContractDate = days! -> one more filter function after api call to make equation!

export async function GET( 
  req: NextRequest,
  res: NextResponse<SearchResponse>,
  // res: any
) {
  let searchInput: string = "";
  if (req.method == "GET") {
    const __query__ = (req.url?.split("?") as string[])[1];
    console.log(__query__);
    const queryurl = qs.parse(__query__);
    const save = new Boolean(queryurl.save);
    delete queryurl.save;
    const page: number = Number(queryurl.page) - 1; //ignore;
    const queryObj: QueryObj = {
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
      Cooling: (queryurl.Cooling as string)?.split(','),
      WaterfrontFeatures: (queryurl.WaterfrontFeatures as string)?.split(','),
      StoriesTotal: queryurl.StoriesTotalFrom
        ? {
            lt: queryurl.StoriesTotalFrom,
          }
        : null,
      ListingId: queryurl.ListingId, // ListingId=
    };
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
        delete queryObj.City;
        continue;
      }

      if (Array.isArray(queryObj[key as queryType])) {
        query += `&${key}.in=${queryObj[key as queryType]}`;
      } else if (
        typeof queryObj[key as queryType] == "object" &&
        queryObj[key as queryType]
      ) {
        const element = queryObj[key as queryType] as any;
        const keys2 = Object.keys(element as queryType);
        for (const key2_temp of keys2) {
          if (element[key2_temp]) {
            query += `&${key}.${key2_temp}=${element[key2_temp]}`;
          }
        }
      } else {
        if (queryObj[key as queryType]) {
          query += `&${key}=${queryObj[key as queryType]}`;
        }
      }
    }

    const toSkip = page * limit;

    try {
      console.log(query);
      const response = await axios.get(
        `https://api.bridgedataoutput.com/api/v2/mlspin/listings?access_token=${process.env.API_ACCESS_TOKEN}&offset=${toSkip}&limit=${limit}&StandardStatus=Active&IDXParticipationYN=true&fields=ListingId,Media,ListPrice,BedroomsTotal,BathroomsTotalDecimal,LivingArea,MLSAreaMajor,City,StateOrProvince,StreetNumber,StreetName,NumberOfUnitsTotal,Latitude,Longitude${query}`,
      );
      searchInput = queryObj.near as string;
      const session = (await getSession()) as any;
      if (session) {
        const data: any = {
          userId: session?.user.id,
        };
        const keys = Object.keys(queryurl);

        keys.map((key) => {
          data[key] = queryurl[key];
        });

        delete data.radius;
        delete data.page;
        delete data.sortBy;
        delete data.order;
        delete data.NumberOfUnitsTotal;
        if (queryObj.near && queryObj.City == "Any") {
          delete data.City;
        }

        if (data.ListPriceFrom) {
          data.ListPriceFrom = parseInt(data.ListPriceFrom);
        }

        if (data.ListPriceTo) {
          data.ListPriceTo = parseInt(data.ListPriceTo);
        }

        data.BathroomsTotal = data.BathroomsTotalDecimalTo;
        delete data.BathroomsTotalDecimalTo;

        console.log(save.valueOf());
        if (save.valueOf()) {
          await prisma.search.create({
            data: data,
          });
        }
      }
      const pages = calculatePages(response.data.total, limit);
      return NextResponse.json({
        properties: response.data.bundle,
        pages: pages,
        message: "Succesfully get data",
      });
    } catch (err) {
      console.log(err);
      return NextResponse.json({
        message: "error",
      });
    }
  }
}

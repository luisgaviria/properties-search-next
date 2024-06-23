"use client";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { atom, useAtom } from "jotai";
import { useQuery } from "react-query";
import Link from "@/node_modules/next/link";

// const searchAtom = atom<string[]>([]);

// searchAtom.debugLabel = "Search History";

export default function ProfileComponent() {
  const searchHistory = useQuery({
    queryKey: "getSearchHistory",
    queryFn: () => getSearchHistory(),
    enabled: true,
  });
  // const [searchHistory,setSearchHistory] = useAtom(searchAtom);
  const { data, status }: { data: any; status: any } = useSession();

  const getSearchHistory = async () => {
    const response = await fetch("/api/search_history", {
      cache: "no-store",
    }).then((res) => res.json());

    if (response.searchHistory) {
      return response.searchHistory;
    } else {
      return null;
    }
  };

  const generateQuery = (row: any) => {
    let query = "";
    query += `page=1&near=${row.near}`;

    console.log(row);

    if (row.BedroomsTotal != "") {
      query += `&BedroomsTotal=${row.BedroomsTotal}`;
    }
    // if(row.BathroomsTotalDecimalFrom != ""){
    //     query+=`&BathroomsTotalDecimalFrom=${row.BathroomsTotalDecimalFrom}`;
    // }
    if (row.BathroomsTotal != "") {
      query += `&BathroomsTotal=${row.BathroomsTotal}`;
    }
    if (row.ListPriceFrom != 0) {
      query += `&ListPriceFrom=${row.ListPriceFrom}`;
    }
    if (row.ListPriceTo != 0) {
      query += `&ListPriceTo=${row.ListPriceTo}`;
    }
    if (row.PropertySubType != "") {
      query += `&PropertySubType=${row.PropertySubType}`;
    }
    if (
      row.PropertyType != "Residential Lease,Residential,Residential Income"
    ) {
      query += `&PropertyType=${row.PropertyType}`;
    }
    if (row.City != "") {
      query += `&City=${row.City}`;
    }
    return query;
  };

  return (
    <div>
      Dashboard
      <h1>{data?.user.email}</h1>
      <h1>{data?.user.id}</h1>
      <h1>{data?.user.username}</h1>
      <h1>{data?.user.phoneNumber}</h1>
      {searchHistory.data?.map((row: any) => {
        // here connect bathrooms bedrooms and so on from prisma database
        return (
          <h2>
            <Link href={`/search?${generateQuery(row)}`}>
              {row.near} {new Date(row.createdAt).toLocaleString("us")}
            </Link>
          </h2>
        );
      })}
    </div>
  );
}

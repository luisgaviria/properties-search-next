"use client"
import {useQuery} from "react-query";
import { useAtom,atom } from "jotai";
import { Property } from "../definitions/Property";
import PropertySearchTile from "../Mlspin/PropertySearchTile/PropertySearchTile";
import styles from "./LatestListings.module.scss";

interface latestResponse {
    message: string,
    listings: Property[]
}

const listingsArr = atom<Property[]>([]);

const LatestListings = ()=> { 
    const [listings,setListings] = useAtom(listingsArr);
    const getListings =async ()=>{
        const res: latestResponse = await fetch("/api/search/mlspin/latest",{
            cache: 'no-store'
        }).then((res)=>res.json());
        setListings(res.listings);
    };
    useQuery({
        queryKey: ["getLatestListings"],
        queryFn: ()=> getListings(),
        enabled: true
    });
    return (
        <div className={styles["properties-new-container"]}>
          <div className={styles["properties-grid-new-listing"]}>
            {listings.length ? listings.map(nearListing=>{
                return ( 
                    <PropertySearchTile key={nearListing.ListingId} data={nearListing} />
                );
            }) : null}
          </div>
        </div>
      );
};
 
export default LatestListings;
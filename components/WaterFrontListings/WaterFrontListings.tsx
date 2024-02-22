"use client"
import {useQuery} from "react-query";
import { useAtom,atom } from "jotai";
import { Property } from "../definitions/Property";
import PropertySearchTile from "../Mlspin/PropertySearchTile/PropertySearchTile";
import styles from "./WaterFrontListings.module.scss";
import { Carousel } from "react-bootstrap";

interface latestResponse {
    message: string,
    waterFrontListings: Property[][]
}

const listingArr = atom<Property[][]>([]);

const WaterFrontListings = ()=>{
    const [listings,setListings] = useAtom(listingArr);
    const getListings =async ()=>{
        const res: latestResponse = await fetch("/api/search/mlspin/waterFrontListings",{
            cache: 'no-store'
        }).then((res)=>res.json());
        setListings(res.waterFrontListings);
    };
    useQuery({
        queryKey: ["getWaterFrontListings"],
        queryFn: ()=> getListings(),
        enabled: true
    });

    return (
            <Carousel
                className="homeCarousel"
                controls={false}
                touch
            >
                {
                    listings.length ? listings.map(page=>{
                        return (
                            <Carousel.Item>
                                <div className={styles["properties-new-container"]}>
                                    <div className={styles["properties-grid-new-listing"]}>
                                        {page.length ? page.map(nearListing=>{
                                            return ( 
                                                <PropertySearchTile key={nearListing.ListingId} data={nearListing} />
                                                );
                                        }) : null}
                                    </div>
                                </div>
                            </Carousel.Item>
                        )
                    }) : null
                }
            </Carousel>
      );
};

export default WaterFrontListings;
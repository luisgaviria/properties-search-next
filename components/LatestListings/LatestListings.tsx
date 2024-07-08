"use client";
import { useQuery } from "react-query";
import { useAtom, atom } from "jotai";
import { Property } from "../definitions/Property";
import PropertySearchTile from "../Mlspin/PropertySearchTile/PropertySearchTile";
import styles from "./LatestListings.module.scss";
import { Carousel } from "react-bootstrap";
import Image from "next/image";
import { useEffect } from "react";

type LatestResponse = {
  message: string;
  listings: Property[][];
};

// const listingsArr = atom<Property[][]>([]);

const LatestListings = ({ listings }: { listings: Property[][] }) => {
  // const getListings = async () => {
  //   const res: latestResponse = await fetch("/api/search/mlspin/latest", {
  //     cache: "no-store",
  //   }).then((res) => res.json());
  //   setListings(res.listings);
  // };
  // useEffect(()=>{
  //   getListings();
  // },[]);
  // useQuery({
  //   queryKey: ["getLatestListings"],
  //   queryFn: () => getListings(),
  //   enabled: true,
  // });
  return (
    <Carousel
      className="homeCarousel"
      controls={true}
      touch
      interval={null}
      nextIcon={
        <Image
          src={"/arrow-next.svg"}
          alt="next arrow"
          width={50}
          height={50}
        />
      }
      prevIcon={
        <Image
          src="/arrow-prev.svg"
          alt="previous arrow"
          width={50}
          height={50}
          loading="eager"
        />
      }
    >
      {listings?.length
        ? listings.map((page) => {
            return (
              <Carousel.Item>
                <div className={styles["properties-new-container"]}>
                  <div className={styles["properties-grid-new-listing"]}>
                    {page.length
                      ? page.map((nearListing) => {
                          return (
                            <PropertySearchTile
                              key={nearListing.ListingId}
                              data={nearListing}
                            />
                          );
                        })
                      : null}
                  </div>
                </div>
              </Carousel.Item>
            );
          })
        : null}
    </Carousel>
  );
};

export default LatestListings;

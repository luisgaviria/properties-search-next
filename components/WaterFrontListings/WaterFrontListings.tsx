"use client";
import { useQuery } from "react-query";
import { useAtom, atom } from "jotai";
import { Property } from "../definitions/Property";
import PropertySearchTile from "../Mlspin/PropertySearchTile/PropertySearchTile";
import styles from "./WaterFrontListings.module.scss";
import { Carousel } from "react-bootstrap";
import Image from "next/image";
import { useEffect } from "react";

// interface latestResponse {
//   message: string;
//   waterFrontListings: Property[][];
// }

// const listingArr = atom<Property[][]>([]);

const WaterFrontListings = ({ listings }: { listings: Property[][] }) => {
  // const [listings, setListings] = useAtom(listingArr);
  // const getListings = async () => {
  //   const res: latestResponse = await fetch(
  //     "/api/search/mlspin/waterFrontListings",
  //     {
  //       cache: "no-store",
  //     }
  //   ).then((res) => res.json());
  //   setListings(res.waterFrontListings);
  // };
  // useQuery({
  //   queryKey: ["getWaterFrontListings"],
  //   queryFn: () => getListings(),
  //   enabled: true,
  // });
  // useEffect(()=>{ // this should be invoked before site rendering
  //   getListings();
  // },[]);

  return (
    <Carousel
      className="homeCarousel"
      controls={true}
      touch={false}
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
      {listings.length
        ? listings.map((page, index) => {
            return (
              <Carousel.Item key={index + 1}>
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

export default WaterFrontListings;

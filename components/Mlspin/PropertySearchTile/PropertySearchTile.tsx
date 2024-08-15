import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import styles from "./PropertySearchTile.module.scss";
import { Carousel } from "react-bootstrap";
import Image from "next/image";

let defaultImageURL = "/missing-image.webp";

const formatPrice = (price: any) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(price);
};

const loader = ({ src, width }: { src: string; width?: number }) => {
  return `${src}${width ? `?w=${width}` : ""}`;
};

export default function PropertySearchTile({ data }: any) {
  const childrenClick = (event: any) => {
    event.stopPropagation();
  };

  function isAll9sString(inputString: any) {
    if (typeof inputString !== "string" || inputString.length === 0) {
      return false;
    }
    const characters = inputString.split("");
    const isAll9s = characters.every((char) => char === "9");
    return isAll9s;
  }

  if (isAll9sString(data.LivingArea)) {
    return null;
  }

  return (
    <div>
      <div className={styles[`properties_grid_element_buy`]}>
        <Carousel variant="primary" onClick={childrenClick} interval={null}>
          {data.Media && data.Media.length > 0
            ? data.Media.slice(0,4).map((media: any, index: number) => {
                if (index < 9) {
                  // Log media object to inspect its properties
                  // console.log("Media Object:", media);

                  // Determine image source with fallback
                  const imageSrc = media.MediaURL
                    ? media.MediaURL
                    : defaultImageURL;

                  return (
                    <Carousel.Item style={{ cursor: "pointer" }} key={index}>
                      <a href={`/search/${data.ListingId}`}>
                        <Image
                          loader={(props: any) =>
                            loader({ ...props, width: 500 })
                          }
                          className={styles["img-carousel-tile"]}
                          placeholder="blur"
                          src={imageSrc}
                          blurDataURL="blur.jpg"
                          key={index}
                          alt="property main image"
                          width={50}
                          height={300}
                        />
                      </a>
                    </Carousel.Item>
                  );
                }
              })
            : null}
        </Carousel>

        <div style={{ cursor: "pointer" }}>
          <div className={styles["tile-city"]}>
            {`${data.StreetNumber} ${data.StreetName} - ${data.City}`}
            <span>{formatPrice(data.ListPrice)}</span>
            <br />
            {!isAll9sString(data.LivingArea) ? (
              <span>
                {data.LivingArea !== "" && data.LivingArea !== null
                  ? `${data.LivingArea} sqft`
                  : null}
              </span>
            ) : null}
          </div>

          <div className={styles["tile-area"]}>
            {data.BedroomsTotal ? ` ${data.BedroomsTotal} Beds, ` : "0 Beds "}
            <span>
              {data.BathroomsTotalDecimal
                ? `${data.BathroomsTotalDecimal} Baths`
                : "0 Baths"}
            </span>
            <br />
            <span>{data.MLSAreaMajor ? `${data.MLSAreaMajor}` : null}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

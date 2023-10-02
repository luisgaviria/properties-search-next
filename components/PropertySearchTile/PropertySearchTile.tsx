import React from "react";
import styles from "./PropertySearchTile.module.scss";
import { Carousel } from "react-bootstrap";
// import { formatPrice } from "../../utils/formatPrice";
const formatPrice = (price: any) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(price);
};

export default function PropertySearchTile({ data }: any) {
  // const parentClick = () => {
  //     navigate(`/buy/${data.ListingId}`);
  //   };

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
    <div
    // onClick={parentClick}
    >
      <div className={styles[`properties_grid_element_buy`]}>
        <Carousel
          onClick={childrenClick}
          interval={null}
          // autoPlay={false}
        >
          {data.Media?.map((media: any, index: any) => {
            if (index < 9) {
              return (
                <Carousel.Item
                  style={{ cursor: "pointer" }}
                  //   interval={null}
                  //   autoPlay={false}
                  className={styles["img-wrap-buytile"]}
                >
                  {
                    //We should use Image tag here
                    /* <Image
                    // type="image/webp"
                    className={styles["img-carousel-tile"]}
                    // src={media.MediaURL}
                    src={
                      "https://dvvjkgh94f2v6.cloudfront.net/6a24dcf8/73135979/83dcefb7.jpeg) "
                    }
                    key={index}
                    // onClick={parentClick}
                    alt="property main image"
                    width={50}
                    height={50}
                  /> */
                  }

                  <img
                    // type="image/webp"
                    className={styles["img-carousel-tile"]}
                    src={media.MediaURL}
                    key={index}
                    alt="property main image"
                    // onClick={parentClick}
                  />
                </Carousel.Item>
              );
            }
          })}
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

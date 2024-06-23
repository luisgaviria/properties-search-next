import React from "react";
import styles from "./PropertySearchTile.module.scss";

const formatPrice = (price: any) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(price);
};

const loader = (props: { src: string }) => {
  return `${props.src}`;
};

export default function PropertySearchTile({ data, onClick }: any) {
  // const router = useRouter();
  // const parentClick = () =>{
  //   router.push("/search/"+data.ListingId);
  // }
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
    <div onClick={onClick}>
      <div className={styles[`properties_grid_element_buy`]}>
        <div style={{ cursor: "pointer" }}>
          <div className={styles["tile-city"]}>
            {`${data.address.full}`}
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

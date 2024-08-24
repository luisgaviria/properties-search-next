import styles from "./PropertySearchList.module.scss";
import PropertySearchTile from "../PropertySearchTile/PropertySearchTile";
import { Property } from "../../definitions/Property";
import { Suspense } from "react";
import Loading from "./loading";
import { formatPrice } from "@/utils/formatPrice";

const generateTitle = (state: any) => {
  const livingArea =
    state.LivingArea !== null ? state.LivingArea?.toLocaleString() : null;

  return `Property Listing: ${state.StreetNumber} ${state.StreetName}, ${
    state.City
  }, ${state.StateOrProvince} - ${formatPrice(state.ListPrice)} - ${
    livingArea !== null ? livingArea + " sqft" : ""
  }`;
};

function truncateStringWithEllipsis(str: string) {
  const maxLength = 157;

  if (typeof str !== "string") {
    throw new Error("Input must be a string.");
  }

  if (!str || str.trim() === "") {
    return "";
  }

  if (str.length <= maxLength) {
    return str;
  }

  return str.substring(0, maxLength - 3) + "...";
}

export default function PropertySearchList({
  properties,
}: {
  properties: Property[];
}) {
  const defaultImageURL = "/missing-image.webp";
  return (
    <>
      {properties?.map((property: Property, index: number) => {
        return (
          <Suspense fallback={<Loading />}>
            <PropertySearchTile key={property.id || index} data={property} />
          </Suspense>
        );
      })}
    </>
  );
}

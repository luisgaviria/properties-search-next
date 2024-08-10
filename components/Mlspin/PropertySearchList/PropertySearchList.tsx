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
  return (
    <>
      <script type="application/ld+json">
        {properties?.map(
          (property: Property, index: number) => `
       {
        "@context": "https://schema.org",
        "@type": "RealEstateListing",
        "name": "Home Page",
        "description": "There are ${
          properties.length
        } properties available in the home page.",
        "numberOfItems": ${properties.length},
        "itemListElement": [
        ${properties
          .map(
            (property, index) => `
        {
        "@type": "ListItem",
        "position": ${index + 1},
        "item": {
        "@type": "RealEstateListing",
        "name": "${generateTitle(property)}",
        "url": "${property.url}",
        "address": {
        "@type": "PostalAddress",
        "streetAddress": "${property.StreetNumber} ${property.StreetName}",
        "addressLocality": "${property.City}",
        "addressRegion": "${property.StateOrProvince}",
        "addressCountry": "USA"
        },
        "price": "${formatPrice(property.ListPrice)}",
        "numberOfBedrooms": "${property.BedroomsTotal}",
        "numberOfBathrooms": "${property.BathroomsTotalDecimal}",
        "floorSize": {
        "@type": "QuantitativeValue",
        "value": ${
          property.LivingArea !== undefined && property.LivingArea !== 0
            ? `"${property?.LivingArea?.toLocaleString()}"`
            : null
        },
        "unitCode": "SQFT"
        }
        }
        `
          )
          .join(",")}
        ]
      }
      `
        )}
      </script>
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

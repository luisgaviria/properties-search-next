import styles from "./PropertySearchList.module.scss";
import PropertySearchTile from "../PropertySearchTile/PropertySearchTile";
import { Property } from "../../definitions/Property";
import { Suspense } from "react";
import Loading from "./loading";

export default function PropertySearchList({
  properties,
  onClick,
}: {
  properties: Property[];
  onClick: (data: Property) => void;
}) {
  return (
    <>
      {properties?.map((property: Property, index: number) => {
        return (
          <Suspense fallback={<Loading />}>
            <PropertySearchTile
              key={property.id || index}
              onClick={() => onClick(property)}
              data={property}
            />
          </Suspense>
        );
      })}
    </>
  );
}

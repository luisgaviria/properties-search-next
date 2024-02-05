import styles from "./PropertySearchList.module.scss";
import PropertySearchTile from "../PropertySearchTile/PropertySearchTile";
import { Property } from "../../definitions/Property";
import { Suspense } from "react";
import Loading from "./loading";

export default function PropertySearchList({
  properties,
}: {
  properties: Property[];
}) {
  return (
    <>
      {properties?.map((property: Property, index: number) => {
        return (
          <Suspense fallback={<Loading />}>
            <PropertySearchTile
              key={property.id || index}
              data={property}
            />
          </Suspense>
        );
      })}
    </>
  );
}

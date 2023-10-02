import styles from "./PropertySearchList.module.scss";
import PropertySearchTile from "../PropertySearchTile/PropertySearchTile";
import { Property } from "../definitions/Property";
import { Suspense } from "react"; 
import Loading from "./loading";

export default function PropertySeachList({properties}: {properties: Property[]}) {
  return (
    <Suspense fallback={<Loading/>}> 
      {properties.map((property: Property, index: number) => {
        return (
          <PropertySearchTile
            key={property.id || index}
            onClick={() => {}}
            data={property}
          />
        );
      })}
    </Suspense>
  );
}

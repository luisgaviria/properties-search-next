import styles from "./PropertySearchList.module.scss";
import PropertySearchTile from "../PropertySearchTile/PropertySearchTile";

export default function PropertySeachList() {
  return (
    <div
      className={
        formVisible["map"]
          ? styles["properties_grid_map_view"]
          : styles["properties_grid"]
      }
    >
      {properties.map((property: Property, index: number) => {
        return (
          <PropertySearchTile
            key={property.id || index}
            onClick={() => {}}
            data={property}
          />
        );
      })}
    </div>
  );
}

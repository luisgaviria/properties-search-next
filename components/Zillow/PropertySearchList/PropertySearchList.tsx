import styles from "./PropertySearchList.module.scss";
import PropertySearchTile from "../PropertySearchTile/PropertySearchTile";
import { Suspense } from "react";
export default function PropertySearchList({
    properties,
    onClick
}: {properties: any;onClick: ()=>void}) {
    return ( 
      <>
        {properties?.map((property: any,index:number)=>{ 
            return ( 
                <Suspense>
                    <PropertySearchTile
                        key={property.id || index}
                        onClick={onClick}
                        data={property}
                    />
                </Suspense>
            )
        })}
        </>
    );
}
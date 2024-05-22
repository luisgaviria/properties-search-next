"use client"

import { InfoWindow, Marker } from "@react-google-maps/api";
import { Property } from "../definitions/Property";
import { useState } from "react";
import { Image } from "react-bootstrap";
import Link from "next/link";

const MarkerWithInfowindow = ({property}: {property: Property})=> { 
    const [isOpen,setIsOpen] = useState(false);
    const onClickMarker = ()=>{
         setIsOpen(true); 
    };
    const onCloseMarker = ()=>{
        setIsOpen(false);
    };
    
    return (
        <Marker onClick={onClickMarker} position={{lat: property.Latitude, lng: property.Longitude}}>
        { isOpen &&             
            <InfoWindow onCloseClick={onCloseMarker}>
                <div style={{color: 'black'}}>
                    <Image width="250px" height="200px" src={property?.Media[0]?.MediaURL}/>
                    <a target="_blank" href={`/search/${property.ListingId}`}><h2>{property.City}, {property.StreetName}, {property.StreetNumber}</h2></a>
                </div>
            </InfoWindow>
        }
        </Marker>
    );
};

export default MarkerWithInfowindow;
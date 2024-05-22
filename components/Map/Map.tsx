"use client";
import React from 'react';
import MarkerWithInfowindow from "../MarkerWithInfowindow/MarkerWithInfowindow";
import { GoogleMap, LoadScript } from '@react-google-maps/api';
import { Property } from '../definitions/Property';

const containerStyle = {
  width: '100%',
  height: '100%'
};

function Map({properties}: {properties: Property[]}) {
  return (
    <LoadScript
      googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_API_KEY as string}
    >
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={{lat: properties[0].Latitude,lng: properties[0].Longitude}}
        zoom={14}
      >
        {properties.map((property)=>{
            return (
              <MarkerWithInfowindow property={property} />
            )
        })}
      </GoogleMap>
    </LoadScript>
  )
}

export default React.memo(Map)
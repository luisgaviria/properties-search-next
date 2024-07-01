"use client";

import React, { Component, ReactElement } from "react";
import GoogleMapReact from "google-map-react";
// import MarkerClusterer from "@google/markerclusterer";
import mapStyles from "./mapStyles";
import { Property } from "../definitions/Property";
import { MarkerClusterer } from "@googlemaps/markerclusterer";

interface GoogleMapContainerProps {
  properties?: Property[];
  onMoveMap?: (map: any) => void; // You can replace 'any' with a more specific type for map
}

interface MarkerWithInfoWindow {
  marker: google.maps.Marker;
  infoWindow: google.maps.InfoWindow | null;
}

class GoogleMapContainer extends Component<GoogleMapContainerProps> {
  private googleMapRef: any; // Change 'any' to the correct type for map
  private googleRef: any; // Change 'any' to the correct type for maps

  private markersWithInfoWindows: MarkerWithInfoWindow[] = [];

  componentDidMount() {
    // Load the MarkerClusterer script asynchronously
    const script = document.createElement("script");
    script.src =
      "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/markerclusterer.js";
    script.async = true;
    document.body.appendChild(script);

    setInterval(async () => {
      // Create markers and info windows
      const markersWithInfoWindows: MarkerWithInfoWindow[] = (
        this.props.properties || []
      ).map((property: Property) => {
        const imgUrl = property.Media?.[0]?.MediaURL; // Use optional chaining

        if (!imgUrl) {
          return { marker: null, infoWindow: null }; // Skip properties without images
        }

        return {
          marker: new this.googleRef.Marker({
            position: { lat: property.Latitude, lng: property.Longitude },
          }),
          infoWindow: null, // InfoWindow will be created later
        };
      });

      // Load info windows asynchronously
      const loadedInfoWindows = await Promise.all(
        (this.props.properties || []).map(
          async (property: Property, index: number) => {
            const imgUrl = property.Media?.[0]?.MediaURL; // Use optional chaining

            if (!imgUrl) {
              return null; // Skip properties without images
            }

            try {
              // const imgElement = await loadImage(imgUrl);

              const infoWindow = new this.googleRef.InfoWindow({
                content: `
                <a href="/buy/${property.ListingId}">
                  <img height="220px" src="${imgUrl}" alt="Property" />
                  <br />
                  <div>
                    ${property.StreetNumber} ${property.StreetName} ${property.City}
                  </div>
                </a>
              `,
              });

              return infoWindow;
            } catch (error) {
              console.error("Error loading image:", error);
              return null; // Skip properties with loading errors
            }
          },
        ),
      );

      // Attach click listeners and handle clustering
      markersWithInfoWindows.forEach((markerWithInfoWindow, i) => {
        if (markerWithInfoWindow.marker) {
          markerWithInfoWindow.marker.addListener("click", () => {
            if (loadedInfoWindows[i]) {
              loadedInfoWindows[i].open(
                this.googleMapRef,
                markerWithInfoWindow.marker,
              );
            }
          });
        }
      });

      new MarkerClusterer({
        map: this.googleMapRef,
        markers: this.markersWithInfoWindows.map((x) => x.marker),
      });
      // new MarkerClusterer(
      //   this.googleMapRef,
      //   markersWithInfoWindows.map((x) => x.marker),
      //   {
      //     imagePath:
      //       "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m",
      //     gridSize: 200,
      //     minimumClusterSize: 1000,
      //     textColor: "transparent",
      //   }
      // );

      // Store the markers and info windows for later use
      this.markersWithInfoWindows = [];
    }, 1000);
  }

  setGoogleMapRef = (map: any, maps: any) => {
    this.googleMapRef = map;
    this.googleRef = maps;

    // Create markers and info windows when the map is loaded
    this.markersWithInfoWindows = (this.props.properties || []).map(
      (property) => {
        console.log(property);
        const imgUrl = property.Media?.[0]?.MediaURL;
        return {
          marker: new this.googleRef.Marker({
            position: { lat: property.Latitude, lng: property.Longitude },
          }),
          infoWindow: new this.googleRef.InfoWindow({
            content: `
            <div style="padding: 10px" class="marker">
              <img style="width: 300px; height: 200px;" src="${imgUrl}"/>
              <br/>
              <a href="/search/${property.ListingId}" target="_blank" style="text-decoration:underline; color: blue">${property.City}, ${property.StreetName}, ${property.StreetNumber}</a>
            </div>
          `,
          }),
        };
      },
    );

    // Attach click listeners
    this.markersWithInfoWindows.forEach((markerWithInfoWindow) => {
      markerWithInfoWindow.marker.addListener("click", () => {
        if (markerWithInfoWindow.infoWindow) {
          markerWithInfoWindow.infoWindow.open(
            this.googleMapRef,
            markerWithInfoWindow.marker,
          );
        }
      });
    });

    new MarkerClusterer({
      map: this.googleMapRef,
      markers: this.markersWithInfoWindows.map((x) => x.marker),
    });

    // Handle clustering
    // new MarkerClusterer(
    //   this.googleMapRef,
    //   this.markersWithInfoWindows.map((x) => x.marker),
    //   {
    //     imagePath:
    //       "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m",
    //     gridSize: 200,
    //     minimumClusterSize: 1000,
    //     textColor: "transparent",
    //   }
    // );
    // this.markersWithInfoWindows = null;
    this.markersWithInfoWindows = [];
  };
  render(): ReactElement {
    const defaultCenter = this.props.properties?.length
      ? {
          lat: this.props.properties[0].Latitude,
          lng: this.props.properties[0].Longitude,
        }
      : {
          lat: 42.361145,
          lng: -71.057083,
        };

    return (
      <GoogleMapReact
        bootstrapURLKeys={{
          key: `${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}`,
        }}
        yesIWantToUseGoogleMapApiInternals
        onGoogleApiLoaded={({ map, maps }) => this.setGoogleMapRef(map, maps)}
        defaultCenter={defaultCenter}
        defaultZoom={15}
        key={1}
        options={{
          styles: mapStyles,
          zoomControl: true,
          // viewControl: true,
        }}
        onChange={this.props.onMoveMap}
      />
    );
  }
}

export default GoogleMapContainer;

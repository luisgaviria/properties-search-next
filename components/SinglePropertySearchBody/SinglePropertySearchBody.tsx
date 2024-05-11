"use client";
import { formatPrice, checkNumberNine } from "@/utils/formatPrice";
import { Metadata, ResolvingMetadata } from "next";
import Image from "next/image";
import { atom, useAtom } from "jotai";
import { PropertyDetails } from "@/components/definitions/PropertyDetails";
import { usePathname, useSearchParams } from "next/navigation";
import { useQuery } from "react-query";
import { Carousel } from "react-bootstrap";
import styles from "./SinglePropertySearchBody.module.scss";
import { MdOutlineAttachMoney, MdHouse, MdBedroomParent } from "react-icons/md";
import { FaRestroom } from "react-icons/fa";
import { AiOutlineAreaChart } from "react-icons/ai";
import { BsFillPhoneVibrateFill } from "react-icons/bs";
import Table from "react-bootstrap/Table";
import GoogleMapReact from "google-map-react";
import mapStyles from "./mapStyles";
import { LoanCalculator } from "@/components/LoanCalculator/LoanCalculator";
import CTA from "@/components/CTA/CTA";
import Link from "next/link";
import { Container } from "@/app/client-react-boostrap";
import { useTheme } from "next-themes";

const Marker = ({ text }: { text: string; lat: number; lng: number }) => (
  <MdHouse size={25} />
);

const zillowIdsAtom = atom<string[]>([]);

zillowIdsAtom.debugLabel = "Zillow ID Data";

export const StateAtom = atom({
  Media: [] as any,
  LivingArea: "",
  StreetNumber: "",
  StreetName: "",
  City: "",
  StateOrProvince: "",
  ListPrice: 0,
  PublicRemarks: "",
  BedroomsTotal: 0,
  BathroomsTotalDecimal: 0,
  MlsStatus: "",
  OnMarketDate: new Date(),
  MLSPIN_MARKET_TIME: "",
  OriginalListPrice: 0,
  BathroomsHalf: 0,
  RoomsTotal: 0,
  MLSAreaMajor: "",
  CountyOrParish: "",
  BuildingAreaTotal: "",
  LotSizeArea: "",
  LotFeatures: "",
  LotSizeSquareFeet: "",
  PropertyType: "",
  PropertySubType: "",
  StructureType: "",
  BuildingName: "",
  BusinessName: "",
  NumberOfUnitsTotal: 0,
  InsuranceExpense: 0,
  AssociationYN: "",
  AssociationFee: 0,
  AssociationName: "",
  AssociationFeeFrequency: [""] as string[],
  AssociationFeeIncludes: [""] as string[],
  AssociationAmenities: [""] as string[],
  CommunityFeatures: [""] as string[],
  AccessibilityFeatures: [""] as string[],
  Utilities: [""] as string[],
  TenantPays: [""] as string[],
  Heating: [""] as string[],
  MLSPIN_HEAT_ZONES: [""] as string[],
  Cooling: [""] as string[],
  LaundryFeatures: [""] as string[],
  WindowFeatures: [""] as string[],
  Flooring: [""] as string[],
  Appliances: [""] as string[],
  FireplacesTotal: 0,
  FireplaceFeatures: [""] as string[],
  WaterfrontFeatures: [""] as string[],
  PoolFeatures: [""] as string[],
  GarageYN: "",
  GarageSpaces: [""] as string[],
  ParkingFeatures: [""] as string[],
  CarportYN: "",
  SecurityFeatures: [""] as string[],
  InteriorFeatures: [""] as string[],
  MainLevelBedrooms: 0,
  RoomMasterBedroomFeatures: [""] as string[],
  RoomLivingRoomFeatures: [""] as string[],
  SpaFeatures: [""] as string[],
  PatioAndPorchFeatures: [""] as string[],
  WaterSource: [""] as string[],
  Sewer: "",
  YearBuilt: "",
  YearBuiltSource: "",
  TaxAssessedValue: 0,
  TaxAnnualAmount: 0,
  PetsAllowed: "",
  MLSPIN_MANAGEMENT: "",
  ListingTerms: "",
  SeniorCommunityYN: "",
  MLSPIN_LEAD_PAINT: "",
  Disclosures: "",
  Latitude: 0,
  Longitude: 0,
  detailsVisible: {
    details: false,
    loan: false,
  },
  agentName: "",
  officeName: "",
});

StateAtom.debugLabel = "PropertyDetails";

const loader = (props: { src: string }) => {
  return `${props.src}`;
};

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

const defaultProps = {
  center: {
    lat: 10.99835602,
    lng: 77.01502627,
  },
  zoom: 16,
};

const options = {
  styles: mapStyles,
  zoomControl: true,
};

export default function SinglePropertyBuy() {
  const {resolvedTheme} = useTheme();
  const pathName = usePathname();
  const [zillowIds, setZillowIds] = useAtom(zillowIdsAtom);
  const [state, setState] = useAtom(StateAtom);
  const data = useQuery({
    queryKey: ["getPropertyData"],
    queryFn: () => getData(),
    enabled: true,
  });

  const getData = async () => {
    // get Property Id from url
    const id = pathName.split("/search/")[1];
    // const {id} = params.get("");
    const data: {
      property: PropertyDetails;
      zillowData: string[];
      message: string;
      agentName: string;
      officeName: string;
    } = await fetch(`/api/search/mlspin/${id}`, { cache: "no-store" }).then(
      (res) => res.json()
    );
    setZillowIds(data.zillowData);
    setState((prevState: any) => ({
      ...prevState,
      ...data.property,
      agentName: data.agentName,
      officeName: data.officeName,
    }));
  };

  const toggleVisibility = (details: "loan" | "details") => {
    setState((prevState: any) => ({
      ...prevState,
      detailsVisible: {
        ...prevState.detailsVisible,
        [details]: !prevState.detailsVisible[details],
      },
    }));
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

  const imageUrls = state.Media?.map((img: any) => img.MediaURL) || [];
  const filteredImageUrls = imageUrls.filter(
    (url: any) => url && typeof url === "string"
  );

  return resolvedTheme ? (
    <>
      <script type="application/ld+json">
        {state.StreetNumber
          ? `
      {
        "@context": "https://schema.org",
        "@type": "RealEstateListing",
        "name": "${generateTitle(state)}",
        "description": "${truncateStringWithEllipsis(
          state.PublicRemarks ?? ""
        )}",
        "image": "${filteredImageUrls[0] || ""}",
        "url": "/buy/${pathName.split("/search/")[1]}",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "${state.StreetNumber} ${state.StreetName}",
          "addressLocality": "${state.City}",
          "addressRegion": "${state.StateOrProvince}",
          "postalCode": "",
          "addressCountry": "USA"
        },
        "price": "${formatPrice(state.ListPrice)}",
        "numberOfBedrooms": "${state.BedroomsTotal}",
        "numberOfBathrooms": "${state.BathroomsTotalDecimal}",
        "floorSize": {
          "@type": "QuantitativeValue",
          "value": ${
            state.LivingArea !== undefined && state.LivingArea !== ""
              ? `"${state.LivingArea?.toLocaleString()}"`
              : null
          },
          "unitCode": "SQFT"
        }
      }
    `
          : null}
      </script>
      <Carousel
        variant="dark"
        nextIcon={
          <Image
            src={"/arrow-next.svg"}
            alt="next arrow"
            width={50}
            height={50}
            loading="eager"
          />
        }
        prevIcon={
          <Image
            src="/arrow-prev.svg"
            alt="previous arrow"
            width={50}
            height={50}
            loading="eager"
          />
        }
        className={styles["single-carousel"]}
      >
        {state.Media?.map((obj: any, index: any) => {
          return (
            <Carousel.Item key={index}>
              <div className={styles["show-page-image"]}>
                <Image
                  loader={loader}
                  alt={`Property image carousel item ${index}`}
                  src={obj.MediaURL}
                  key={index}
                  fill={true}
                />
              </div>
            </Carousel.Item>
          );
        })}
      </Carousel>
      <Container>
        <div className={styles["prop-tile-address"]}>
          <h1>
            {state.StreetNumber} {state.StreetName} {state.City},{" "}
            {state.StateOrProvince}
          </h1>
        </div>
        <div className={styles["single-property-details"]}>
          <div className={styles["show-page-details-icons"]}>
            <div className={styles["icon-item"]}>
              <Image src={resolvedTheme == "dark" ? "/BEDROOM-WHITE.svg" : "/BEDROOM.webp"} width={50} height={50} alt="bedroom" />
              <span>{state.BedroomsTotal} Bedrooms</span>
            </div>
            <div className={styles["icon-item"]}>
              {/* <FaRestroom size={50} /> */}
              <Image src={resolvedTheme == "dark" ? "/BATHTUB-WHITE.svg" : "/BATHTUB.webp"} width={50} height={50} alt="bathhub" />
              <span>{state.BathroomsTotalDecimal} Bathrooms</span>
            </div>
            {state.LivingArea ? (
              <div className={styles["icon-item"]}>
                <Image
                  src={resolvedTheme == "dark" ? "/DISCOUNT-WHITE.svg" : "/DISCOUNT.webp"}
                  width={50}
                  height={50}
                  alt="bathhub"
                />
                <span>
                  <span>
                    {state.LivingArea !== undefined && state.LivingArea !== ""
                      ? ` ${state.LivingArea?.toLocaleString()} sqft`
                      : null}
                  </span>
                </span>
              </div>
            ) : null}
            {/* <div className="icon-item" onClick={() => {
                setState((prevState) => {
                  return {
                    ...prevState,
                    PreviewMode: true,
                  };
                });
              }} style={{cursor: 'pointer'}}>
            
                    <MdOutlineSlowMotionVideo size={50} /> 
                    <span> Video</span>
            
                </div> */}
            <div className={styles["icon-item"]}>
              {/* <MdOutlineAttachMoney size={50} /> */}
              <Image
                src={resolvedTheme=="dark" ? "/HOMELOAN-WHITE.svg" : "/HOMELOAN.webp"}
                width={50}
                height={50}
                alt="homeloan"
              />
              <span>{formatPrice(state.ListPrice)}</span>
            </div>
            <div className={styles["icon-item"]}>
              <Image src={resolvedTheme == "dark" ? "/REALTOR-WHITE.svg" : "/REALTOR.webp" } width={50} height={50} alt="bathhub" />
              <span>508-762-7639</span>
            </div>
          </div>
        </div>
        <br />
        <div className={styles["single-prop-container"]}>
          <p className={styles["single-prop-description-text"]}>
            {state.PublicRemarks ?? ""}
          </p>
        </div>
        <div
          onClick={() => toggleVisibility("details")}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            cursor: "pointer",
          }}
        >
          {state.detailsVisible.details ? (
            <>
              <div className={styles["property-detail-table-title"]}>
                <span>View Property Details</span>
              </div>
              <div className={styles["arrow-wrapper"]}>
                <img src={resolvedTheme == "dark" ? "/arrow-down-white.svg" : "/arrow-down.svg"} alt="Down Arrow" />
              </div>
            </>
          ) : (
            <>
              <div className={styles["property-details"]}>
                <div className={styles["property-detail-table-title"]}>
                  <span>Property Details</span>
                </div>
                <img
                  className={styles["arrow-wrapper"]}
                  src={resolvedTheme=="dark" ? "/arrow-up-white.svg" : "/arrow-up.svg"}
                  alt="Up Arrow"
                />
              </div>
            </>
          )}
        </div>

        {!state.detailsVisible.details ? ( // Add this conditional block
          <div className={styles["property-detail-table"]}>
            <Table bordered hover responsive variant={resolvedTheme}>
              <tbody>
                {state.MlsStatus ? (
                  <tr key="status">
                    <td>Listing Status:</td>
                    <td>{state.MlsStatus}</td>
                  </tr>
                ) : null}
                {state.OnMarketDate ? (
                  <tr key="OnMarketDate">
                    <td>Dated Listed:</td>
                    <td>{state.OnMarketDate.toDateString()}</td>
                  </tr>
                ) : null}

                {state.MLSPIN_MARKET_TIME ? (
                  <tr key="DaysOnMarket">
                    <td>Days On Market:</td>
                    <td>{state.MLSPIN_MARKET_TIME}</td>
                  </tr>
                ) : null}
                {state.ListPrice > 0 ? (
                  <>
                    <tr key="ListPrice">
                      <td>Listing Price:</td>
                      <td>{formatPrice(state.ListPrice)}</td>
                    </tr>
                    {state.OriginalListPrice !== state.ListPrice ? (
                      <tr key="OriginalListPrice">
                        <td>Original Price:</td>
                        <td>{formatPrice(state.OriginalListPrice)}</td>
                      </tr>
                    ) : null}
                  </>
                ) : null}

                {state.BedroomsTotal ? (
                  <tr key="BedroomsTotal">
                    <td>Number of Bedrooms:</td>
                    <td>{state.BedroomsTotal}</td>
                  </tr>
                ) : null}

                {state.BathroomsTotalDecimal ? (
                  <tr key="BathroomsTotalDecimal">
                    <td>Bathrooms:</td>
                    <td>{state.BathroomsTotalDecimal}</td>
                  </tr>
                ) : null}
                {state.BathroomsHalf && state.BathroomsHalf > 0 ? (
                  <tr key="BathroomsHalf">
                    <td>Bathrooms Half:</td>
                    <td>{state.BathroomsHalf}</td>
                  </tr>
                ) : null}

                {state.RoomsTotal && state.RoomsTotal > 0 ? (
                  <tr key="RoomsTotal">
                    <td>Rooms Total:</td>
                    <td>{state.RoomsTotal}</td>
                  </tr>
                ) : null}

                {state.MLSAreaMajor ? (
                  <tr key="MLSAreaMajor">
                    <td>Neighborhood:</td>
                    <td>{state.MLSAreaMajor}</td>
                  </tr>
                ) : null}

                {state.CountyOrParish ? (
                  <tr key="CountyOrParish">
                    <td>County:</td>
                    <td>{state.CountyOrParish}</td>
                  </tr>
                ) : null}

                {state.LivingArea !== undefined && state.LivingArea !== null ? (
                  <tr key="LivingArea">
                    <td>Living Area:</td>
                    <td>{`${state.LivingArea?.toLocaleString()} sqft`}</td>
                  </tr>
                ) : null}

                {state.BuildingAreaTotal &&
                parseInt(state.BuildingAreaTotal) > 0 &&
                state.BuildingAreaTotal !== state.LivingArea ? (
                  <tr key="BuildingAreaTotal">
                    <td>Building Area:</td>
                    <td>{state.BuildingAreaTotal?.toLocaleString()} sqft</td>
                  </tr>
                ) : null}

                {state.LotSizeArea ? (
                  <tr key="LotSizeArea">
                    <td>Lot Size Area:</td>
                    <td>{state.LotSizeArea} acres</td>
                  </tr>
                ) : null}

                {state.LotFeatures && state.LotFeatures.length ? (
                  <tr key="LotFeatures">
                    <td>Lot Features:</td>
                    <td>{(state.LotFeatures as any).join(", ")}</td>
                  </tr>
                ) : null}

                {state.LotSizeSquareFeet ? (
                  <tr key="LotSizeSquareFeet">
                    <td>Lot Size Square Feet:</td>
                    <td>{state.LotSizeSquareFeet?.toLocaleString()} sqft</td>
                  </tr>
                ) : null}

                {state.PropertyType && state.PropertyType.length > 0 ? (
                  <tr key="PropertyType">
                    <td>Property Type:</td>
                    <td>{state.PropertyType}</td>
                  </tr>
                ) : null}

                {state.PropertySubType ? (
                  <tr key="PropertySubType">
                    <td>Property Sub Type:</td>
                    <td>{state.PropertySubType}</td>
                  </tr>
                ) : null}

                {state.StructureType && state.StructureType.length > 0 ? (
                  <tr key="StructureType">
                    <td>Structure Type:</td>
                    <td>{state.StructureType}</td>
                  </tr>
                ) : null}

                {state.BuildingName && state.BuildingName.length > 0 ? (
                  <tr key="BuildingName">
                    <td>Building Name:</td>
                    <td>{state.BuildingName}</td>
                  </tr>
                ) : null}

                {state.BusinessName && state.BusinessName.length > 0 ? (
                  <tr key="BusinessName">
                    <td>Business Name:</td>
                    <td>{state.BusinessName}</td>
                  </tr>
                ) : null}

                {state.NumberOfUnitsTotal > 0 ? (
                  <tr key="NumberOfUnitsTotal">
                    <td>Number Of Units Total:</td>
                    <td>{state.NumberOfUnitsTotal}</td>
                  </tr>
                ) : null}

                {state.InsuranceExpense ? (
                  <tr key="NumberOfUnitsTotal">
                    <td>Insurance: </td>
                    <td>{state.InsuranceExpense}</td>
                  </tr>
                ) : null}

                {state.AssociationYN ? (
                  <tr key="AssociationYN">
                    <td>Association:</td>
                    <td>Yes</td>
                  </tr>
                ) : null}

                {state.AssociationFee ? (
                  <tr>
                    <td>Association Fee:</td>
                    <td>${state.AssociationFee?.toLocaleString("en-us")}</td>
                  </tr>
                ) : null}

                {state.AssociationName ? (
                  <tr key="AssociationName">
                    <td>Association Name:</td>
                    <td>{state.AssociationName}</td>
                  </tr>
                ) : null}

                {state.AssociationFeeFrequency ? (
                  <tr key="AssociationFeeFrequency">
                    <td>Association Fee Frequency:</td>
                    <td>{state.AssociationFeeFrequency}</td>
                  </tr>
                ) : null}

                {state.AssociationFeeIncludes &&
                state.AssociationFeeIncludes.length > 0 ? (
                  <tr key="AssociationFeeIncludes">
                    <td>Association Fee Includes:</td>
                    <td>{state.AssociationFeeIncludes.join(", ")}</td>
                  </tr>
                ) : null}

                {state.AssociationAmenities &&
                state.AssociationAmenities.length > 0 ? (
                  <tr key="AssociationAmenities">
                    <td>Association Amenities:</td>
                    <td>{state.AssociationAmenities.join(", ")}</td>
                  </tr>
                ) : null}

                {state.CommunityFeatures && state.CommunityFeatures.length ? (
                  <tr key="CommunityFeatures">
                    <td>Community Features:</td>
                    <td>{state.CommunityFeatures.join(", ")}</td>
                  </tr>
                ) : null}

                {state.AccessibilityFeatures &&
                state.AccessibilityFeatures.length ? (
                  <tr key="AccessibilityFeatures">
                    <td>Accessibility Features:</td>
                    <td>{state.AccessibilityFeatures.join(", ")}</td>
                  </tr>
                ) : null}

                {state.Utilities && state.Utilities.length > 0 ? (
                  <tr key="Utilities">
                    <td>Utilities:</td>
                    <td>{state.Utilities.join(", ")}</td>
                  </tr>
                ) : null}

                {state.TenantPays && state.TenantPays.length > 0 ? (
                  <tr key="TenantPays">
                    <td>Tenant Pays:</td>
                    <td>{state.TenantPays.join(", ")}</td>
                  </tr>
                ) : null}

                {state.Heating && state.Heating.length > 0 ? (
                  <tr key="Heating">
                    <td>Heating:</td>
                    <td>{state.Heating.join(", ")}</td>
                  </tr>
                ) : null}

                {state.MLSPIN_HEAT_ZONES &&
                state.MLSPIN_HEAT_ZONES.length > 0 &&
                state.MLSPIN_HEAT_ZONES !== state.Heating ? (
                  <tr key="MLSPIN_HEAT_ZONES">
                    <td>Heating Zones:</td>
                    <td>{state.MLSPIN_HEAT_ZONES.join(", ")}</td>
                  </tr>
                ) : null}

                {state.Cooling && state.Cooling.length > 0 ? (
                  <tr key="Coolin">
                    <td>Cooling:</td>
                    <td>{state.Cooling.join(", ")}</td>
                  </tr>
                ) : null}

                {state.LaundryFeatures && state.LaundryFeatures.length > 0 ? (
                  <tr key="LaundryFeatures">
                    <td>Laundry Features:</td>
                    <td>{state.LaundryFeatures.join(", ")}</td>
                  </tr>
                ) : null}

                {state.WindowFeatures && state.WindowFeatures.length > 0 ? (
                  <tr key="WindowFeatures">
                    <td>Window Features:</td>
                    <td>{state.WindowFeatures.join(", ")}</td>
                  </tr>
                ) : null}

                {state.Flooring && state.Flooring.length > 0 ? (
                  <tr key="Flooring">
                    <td>Flooring:</td>

                    <td>{state.Flooring.join(", ")}</td>
                  </tr>
                ) : null}

                {state.Appliances && state.Appliances.length > 0 ? (
                  <tr key="Appliances">
                    <td>Appliances Features:</td>
                    <td>{state.Appliances.join(", ")}</td>
                  </tr>
                ) : null}

                {state.FireplacesTotal > 0 ? (
                  <>
                    <tr key="YearBuilt">
                      <td>Fireplaces:</td>
                      <td>{state.FireplacesTotal}</td>
                    </tr>
                    {state.FireplaceFeatures &&
                    state.FireplaceFeatures.length > 0 ? (
                      <tr key="YearBuiltSource">
                        <td>Fireplace Features:</td>
                        <td>{state.FireplaceFeatures.join(", ")}</td>
                      </tr>
                    ) : null}
                  </>
                ) : null}

                {state.WaterfrontFeatures &&
                state.WaterfrontFeatures.length > 0 ? (
                  <tr key="WaterfrontFeatures">
                    <td>Waterfront Features:</td>
                    <td>{state.WaterfrontFeatures.join(", ")}</td>
                  </tr>
                ) : null}

                {state.PoolFeatures && state.PoolFeatures.length > 0 ? (
                  <tr key="PoolFeatures">
                    <td>Pool Features:</td>
                    <td>{state.PoolFeatures.join(", ")}</td>
                  </tr>
                ) : null}

                {state.GarageYN && (
                  <>
                    <tr key="GarageYN">
                      <td>Garage Available:</td>
                      <td>Yes</td>
                    </tr>
                    {state.GarageSpaces ? (
                      <tr key="GarageSpaces">
                        <td>Garage Spaces:</td>
                        <td>{state.GarageSpaces}</td>
                      </tr>
                    ) : null}
                  </>
                )}

                {state.ParkingFeatures && state.ParkingFeatures.length > 0 ? (
                  <tr key="ParkingFeatures">
                    <td>Parking Features:</td>
                    <td>{state.ParkingFeatures.join(", ")}</td>
                  </tr>
                ) : null}

                {state.CarportYN ? (
                  <tr key="CarportYN">
                    <td>Carport:</td>
                    <td>Yes</td>
                  </tr>
                ) : null}

                {state.SecurityFeatures && state.SecurityFeatures.length > 0 ? (
                  <tr key="SecurityFeatures">
                    <td>Security Features:</td>
                    <td>{state.SecurityFeatures.join(", ")}</td>
                  </tr>
                ) : null}

                {state.InteriorFeatures && state.InteriorFeatures.length > 0 ? (
                  <tr key="InteriorFeatures">
                    <td>Interior Features:</td>
                    <td>{state.InteriorFeatures.join(", ")}</td>
                  </tr>
                ) : null}

                {state.MainLevelBedrooms && state.MainLevelBedrooms > 0 ? (
                  <tr key="MainLevelBedrooms">
                    <td>Main Level Bedrooms:</td>
                    <td>{state.MainLevelBedrooms}</td>
                  </tr>
                ) : null}

                {state.RoomMasterBedroomFeatures &&
                state.RoomMasterBedroomFeatures.length > 0 ? (
                  <tr key="RoomMasterBedroomFeatures">
                    <td>Master Bedroom Features:</td>
                    <td>{state.RoomMasterBedroomFeatures.join(", ")}</td>
                  </tr>
                ) : null}

                {state.RoomLivingRoomFeatures &&
                state.RoomLivingRoomFeatures.length > 0 ? (
                  <tr key="RoomLivingRoomFeatures">
                    <td>Living Room Features:</td>
                    <td>{state.RoomLivingRoomFeatures.join(", ")}</td>
                  </tr>
                ) : null}

                {state.SpaFeatures && state.SpaFeatures.length > 0 ? (
                  <tr key="SpaFeatures">
                    <td>Spa Features:</td>
                    <td>{state.SpaFeatures.join(", ")}</td>
                  </tr>
                ) : null}

                {state.PatioAndPorchFeatures &&
                state.PatioAndPorchFeatures.length > 0 ? (
                  <tr key="PatioAndPorchFeatures">
                    <td>Patio or Porch Features:</td>
                    <td>{state.PatioAndPorchFeatures.join(", ")}</td>
                  </tr>
                ) : null}

                {state.WaterSource && state.WaterSource.length > 0 ? (
                  <tr key="WaterSource">
                    <td>Water Source:</td>
                    <td>{state.WaterSource.join(", ")}</td>
                  </tr>
                ) : null}

                {state.Sewer && state.Sewer.length > 0 ? (
                  <tr key="Sewer">
                    <td>Sewer:</td>
                    <td>{state.Sewer}</td>
                  </tr>
                ) : null}

                {state.YearBuilt && state.YearBuilt.length > 0 ? (
                  <tr key="YearBuilt">
                    <td>Year Built:</td>
                    <td>{state.YearBuilt}</td>
                    {state.YearBuiltSource &&
                    state.YearBuiltSource.length > 0 ? (
                      <tr key="YearBuiltSource">
                        <td>Year Built Source:</td>
                        <td>{state.YearBuiltSource}</td>
                      </tr>
                    ) : null}
                  </tr>
                ) : null}

                {checkNumberNine(state.TaxAssessedValue) ? (
                  <tr key="TaxAssessedValue">
                    <td>Tax Assessed Value:</td>
                    <td>{formatPrice(state.TaxAssessedValue)}</td>
                  </tr>
                ) : null}

                {checkNumberNine(state.TaxAssessedValue) ? (
                  <tr key="TaxAnnualAmount">
                    <td>Yearly Taxes:</td>
                    <td>{formatPrice(state.TaxAnnualAmount)}</td>
                  </tr>
                ) : null}

                {state.PetsAllowed && state.PetsAllowed.length > 0 ? (
                  <tr key="PetsAllowed">
                    <td>Pets Allowed:</td>
                    <td>{state.PetsAllowed}</td>
                  </tr>
                ) : null}

                {state.MLSPIN_MANAGEMENT &&
                state.MLSPIN_MANAGEMENT.length > 0 ? (
                  <tr key="MLSPIN_MANAGEMENT">
                    <td>Management:</td>
                    <td>{state.MLSPIN_MANAGEMENT}</td>
                  </tr>
                ) : null}

                {state.ListingTerms && state.ListingTerms.length > 0 ? (
                  <tr key="ListingTerms">
                    <td>Listing Terms:</td>
                    <td>{state.ListingTerms}</td>
                  </tr>
                ) : null}

                {state.SeniorCommunityYN ? (
                  <tr key="SeniorCommunityYN">
                    <td>Senior Community:</td>
                    <td>Yes</td>
                  </tr>
                ) : null}

                {state.MLSPIN_LEAD_PAINT &&
                state.MLSPIN_LEAD_PAINT.length > 0 ? (
                  <tr key="MLSPIN_LEAD_PAINT">
                    <td>Lead Paint:</td>
                    <td>{state.MLSPIN_LEAD_PAINT}</td>
                  </tr>
                ) : null}

                {state.Disclosures && state.Disclosures.length > 0 ? (
                  <tr key="Disclosures">
                    <td>Disclosures:</td>
                    <td>{state.Disclosures}</td>
                  </tr>
                ) : null}
              </tbody>
            </Table>
            <div className={styles["disclosure-wrapper"]}>
              <p>
                The property listing data and information, or the Images, set
                forth herein were provided to MLS Property Information Network,
                Inc. from third party sources, including sellers, lessors,
                landlords and public records, and were compiled by MLS Property
                Information Network, Inc. The property listing data and
                information, and the Images, are for the personal, non
                commercial use of consumers having a good faith interest in
                purchasing, leasing or renting listed properties of the type
                displayed to them and may not be used for any purpose other than
                to identify prospective properties which such consumers may have
                a good faith interest in purchasing, leasing or renting. MLS
                Property Information Network, Inc. and its subscribers disclaim
                any and all representations and warranties as to the accuracy of
                the property listing data and information, or as to the accuracy
                of any of the Images, set forth herein.
              </p>
            </div>

            <div className={styles["container"]}>
              <span>{state?.officeName}</span>
              <br />
              <span>{state?.agentName}</span>
            </div>
          </div>
        ) : null}

        <hr />
        <div className={styles["single-prop-map"]}>
          <GoogleMapReact
            bootstrapURLKeys={{
              key: "AIzaSyDpH2-Av-Vx28bMqZaTA0VTTy7j1ffRvR0",
            }}
            center={{
              lat: state?.Latitude ? state.Latitude : 10.99835602,
              lng: state?.Longitude ? state.Longitude : 77.01502627,
            }}
            defaultZoom={defaultProps.zoom}
            yesIWantToUseGoogleMapApiInternals
            options={options}
          >
            <Marker
              lat={state.Latitude}
              lng={state.Longitude}
              text="My Marker"
            />
          </GoogleMapReact>
        </div>
        <hr />
        {state.ListPrice > 100000 ? (
          <>
            <LoanCalculator
              // initialAmount={state.ListPrice}
              // associationFee={state.AssociationFee}
              // yearlyTaxes={checkNumberNine(state.TaxAnnualAmount)}
            />
          </>
        ) : null}
        {zillowIds.length == 0 ? (
          <div className={styles["zillowDataDiv"]}>
            <h2>No Zillow Public data</h2>
          </div>
        ) : (
          <>
            <hr />
            <div className={styles["zillowDataDiv"]}>
              <h2>Zillow Public Data:</h2>

              {zillowIds?.map((zillowId: string) => {
                return (
                  <div style={{ marginTop: "20px" }}>
                    <Link
                      href={`/zillow/${zillowId}`}
                      className={resolvedTheme == "dark" ? styles["btn-cta-zillow-dark"] : styles["btn-cta-zillow"]
                    }
                    >
                      <span>{zillowId}</span>
                    </Link>
                  </div>
                );
              })}
            </div>
          </>
        )}
        <div className={styles["single-prop-buttons"]}>
          <hr />

          <Link href="/search" className={resolvedTheme == "dark" ? styles["btn-cta-dark"] : styles["btn-cta"]}>
            <span>GO BACK</span>
          </Link>

          {/* <Button onClick={handleGoBack}>Go back</Button> */}
        </div>

        <CTA pageName="singlePage" />
      </Container>
    </>
  ) : null;
}

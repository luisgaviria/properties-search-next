"use client";
// import { useState, ChangeEvent } from "react";
import { atom, useAtom } from "jotai";
import { useQuery } from "react-query";
import { useRouter, useSearchParams } from "next/navigation";
// import { useRouter } from "next/router";

import { Suspense, useEffect } from "react";

import Image from "@/node_modules/next/image";
import { Form, Pagination } from "@/app/client-react-boostrap";
import styles from "./Filters.module.scss";
import cities from "../../data/massachusetsCities.json";
import { ChangeEvent } from "react";
// import PropertySearchTile from "../PropertySearchTile/PropertySearchTile";

import Slider from "@/node_modules/rc-slider/lib/Slider";
import Map from "@/components/Map/Map";
import PropertySearchTile from "../PropertySearchTile/PropertySearchTile";

import "rc-slider/assets/index.css";
import { Property } from "../definitions/Property";
import {
  response,
  mapResponse,
  FormVisibleState,
  FilterState,
  strOrNumber,
} from "../definitions/Filters";

import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import SearchButton from "../SearchButton/SearchButton";

import { createPagination } from "@/utils/createPagination";
import PropertySearchList from "../PropertySearchList/PropertySearchList";
import Loading from "./loading";

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(price);
};

const formVisibleAtom = atom({
  propertyType: true,
  propertySubType: true,
  price: true,
  city: true,
  bedBaths: true,
  map: false,
  sortBy: true,
});

formVisibleAtom.debugLabel = "Form Visibility";

const filterAtom = atom<FilterState>({
  // Add the types here
  ListPriceFrom: 0,
  ListPriceTo: 0,
  City: "Any",
  PropertyType: [],
  PropertySubType: [],
  NumberOfUnitsTotal: null,
  BathroomsTotal: 0,
  BedroomsTotal: 0,
  sortBy: "ListPrice",
  order: "desc",
});

filterAtom.debugLabel = "Filters";

const propertiesAtom = atom<Property[]>([]);

propertiesAtom.debugLabel = "Properties";

const mapPropertiesAtom = atom<Property[]>([]);

mapPropertiesAtom.debugLabel = "Map Properties";

const enableSearchingAtom = atom(true);

enableSearchingAtom.debugLabel = "Enable Searching";

const searchInputAtom = atom("");

searchInputAtom.debugLabel = "Search Input";

const pagesAtom = atom({
  actualPage: 1,
  pages: 0,
});

pagesAtom.debugLabel = "Pages";

export default function Filters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // const [searchCounter, setSearchCounter] = useState(0);
  const getDataCity = async (city: string) => {
    let query = "";
    query += `City=${city}`;

    const radiusVal = "1mi";

    if (enableSearching && value) {
      query += `&near=${value}`;
      query += `&radius=${radiusVal}`;
    }
    query+=`&PropertyType=Residential,Residential Income`;

    // const res = await fetch('/api/search/');

    const res: mapResponse = await fetch(`/api/search/map?${query}`, {
      cache: "no-store",
    }).then((res) => res.json());

    console.log(res.properties);

    setMapProperties(res.properties);

    // use also no pages later for google map
    query+="&save=true";
    const res2: response = await fetch(`/api/search?${query}&page=1`, {
      cache: "no-store",
    }).then((res) => res.json());

    setPageObj({ actualPage: 1, pages: res2.pages });

    setProperties(res2.properties);
  };

  const getDataFromHome = async(page_num: number,input: string,filters: any,save=true)=> {
    let query = "";
    const radiusVal = "1mi";
    
    console.log(save);

    if(filters.PropertyType){
      query += `&PropertyType=${filters.PropertyType.toString()}`; 
    }
    if(filters.PropertySubType){
      query += `&PropertySubType=${filters.PropertySubType.toString()}`;
    }
    if(filters.BedroomsTotal){
      query += `&BedroomsTotal=${filters.BedroomsTotal}`;
    }
    if(filters.BathroomsTotal){
      query += `&BathroomsTotalDecimalTo=${filters.BathroomsTotal}`;
    }

    query += `&near=${input}`;
    query += `&radius=${radiusVal}`; 
    query += '&order=desc'; 
    query += '&sortBy=ListPrice';

    console.log(query);
     
     // here connect bathrooms bedrooms and so on from prisma database

    const res: mapResponse = await fetch(`/api/search/map?${query}`, {
      cache: "no-store",
    }).then((res) => res.json());

    console.log(res.properties);

    setMapProperties(res.properties);

    // use also no pages later for google map
    if(save == true){ 
      const res2: response = await fetch(
        `/api/search?save=true${query}&page=${page_num}`,
        { cache: "no-store" }
      ).then((res) => res.json());
      setValue(input);
      setPageObj({ actualPage: page_num, pages: res2.pages });
      setEnableSearching(true);
      setProperties(res2.properties);
    }
    else {
      const res2: response = await fetch(
        `/api/search?${query}&page=${page_num}`,
        { cache: "no-store" }
      ).then((res) => res.json());
      setValue(input);
      setPageObj({ actualPage: page_num, pages: res2.pages });
      setEnableSearching(true);
      setProperties(res2.properties);
    }

  };
  const getData = async (page_num: number) => {
    clearSuggestions();
    let query = "";
    const keys = Object.keys(filter) as Array<keyof typeof filter>;
    keys.map((keyAsString) => {
      // Explicitly convert key to a string
      const key = String(keyAsString);
      if (Array.isArray(filter[key as keyof typeof filter])  && (filter[key as keyof typeof filter] as string[]).length) {
          query += query.length ? `&${key}=` : `${key}=`;
          (filter[key as keyof typeof filter] as string[]).map((item: string) => {
            query += `${item},`;
          });
      } else if (filter[key as keyof typeof filter]) {
        if (key === "BedroomsTotal" && typeof filter[key] === "string") {
          if ((filter[key] as strOrNumber) !== "Any") {
            if ((filter[key] as strOrNumber) === "5+") {
              query += query.length
                ? "&BedroomsTotal=5%2B"
                : "BedroomsTotal=5%2B";
            } else {
              query += query.length
                ? `&${key}=${filter[key]}`
                : `${key}=${filter[key]}`;
            }
          }
        } else if (
          key === "BathroomsTotal" &&
          typeof filter[key] === "string"
        ) {
          if ((filter[key] as strOrNumber) !== "Any") {
            if ((filter[key] as strOrNumber) === "3+") {
              query += query.length
                ? `&${key}DecimalFrom=3`
                : `${key}DecimalFrom=3`;
            } else {
              query += query.length
                ? `&${key}DecimalTo=${filter[key]}`
                : `${key}DecimalTo=${filter[key]}`;
            }
          }
        } else {
          if (filter[key as keyof typeof filter] && !Array.isArray(filter[key as keyof typeof filter])) {
            if(key == 'City' && enableSearching){ 
              // do nothing
            }
            else {
              query += query.length
              ? `&${key}=${filter[key as keyof typeof filter]}`
              : `${key}=${filter[key as keyof typeof filter]}`;
            }
 
          }
        }
      }
    });

    const radiusVal = "1mi";
     
    // console.log(query);
    
    // console.log(value);
    if (enableSearching && value) {
      query += `&near=${value}`;
      query += `&radius=${radiusVal}`;
    }
    else if (enableSearching && searchInput){
      query += `&near=${searchInput}`;
      query += `&radius=${radiusVal}`;
    }

    // const res = await fetch('/api/search/');

    const res: mapResponse = await fetch(`/api/search/map?${query}`, {
      cache: "no-store",
    }).then((res) => res.json());

    console.log(res.properties);

    setMapProperties(res.properties);

    // use also no pages later for google map 
    query += "&save=true";
    const res2: response = await fetch(
      `/api/search?${query}&page=${page_num}`,
      { cache: "no-store" }
    ).then((res) => res.json());

    setPageObj({ actualPage: page_num, pages: res2.pages });

    setProperties(res2.properties);
  };

  const onPropertyClick = (data: Property) => {
    router.push("/search/" + data.ListingId);
  };

  const onMoveMap = async (event: { center: { lat: number; lng: number } }) => {
    const data = await getDataDynamically(event.center);
    console.log("map data:", data); // debugger
    const temp = mapProperties;
    data.map((property: Property) => {
      if (!temp.includes(property)) {
        temp.push(property);
      }
    });
    setMapProperties(temp);
  };

  const getDataDynamically = async (center: { lat: number; lng: number }) => {
    try {
      let query = "";
      const keys = Object.keys(filter) as Array<keyof typeof filter>;
      keys.map((keyAsString) => {
        const key = String(keyAsString);
        if (key === "City" && value) {
          return;
        }
        if (Array.isArray(filter[key as keyof typeof filter]) && (filter[key as keyof typeof filter] as string[]).length) {
          query += query.length ? `&${key}=` : `${key}=`;
          (filter[key as keyof typeof filter] as string[]).map((item: string) => {
            query += `${item},`;
          });
        } else if (filter[key as keyof typeof filter]) {
          if (key === "BedroomsTotal" && typeof filter[key as keyof typeof filter] === "string") {
            if ((filter[key] as strOrNumber) !== "Any") {
              if ((filter[key] as strOrNumber) === "5+") {
                query += query.length
                  ? "&BedroomsTotal=5%2B"
                  : "BedroomsTotal=5%2B";
              } else {
                query += query.length
                  ? `&${key}=${filter[key]}`
                  : `${key}=${filter[key]}`;
              }
            }
          } else if (
            key === "BathroomsTotal" &&
            typeof filter[key] === "string"
          ) {
            if ((filter[key] as strOrNumber) !== "Any") {
              if ((filter[key] as strOrNumber) === "3+") {
                query += query.length
                  ? `&${key}DecimalFrom=3`
                  : `${key}DecimalFrom=3`;
              } else {
                query += query.length
                  ? `&${key}DecimalTo=${filter[key]}`
                  : `${key}DecimalTo=${filter[key]}`;
              }
            }
          } else {
            if (filter[key as keyof typeof filter] && !Array.isArray(filter[key as keyof typeof filter])) {
              query += query.length
                ? `&${key}=${filter[key as keyof typeof filter]}`
                : `${key}=${filter[key as keyof typeof filter]}`;
            }
          }
        }
      });
      const res: mapResponse = await fetch(
        `/api/search/map?${query}&Lat=${center.lat}&Lng=${center.lng}`
      ).then((res) => res.json());
      return res.properties;
    } catch (err) {
      console.error("Error while fetching properties:", err);
      throw err;
    }
  };

  const [pageObj, setPageObj] = useAtom(pagesAtom);

  const properties_ = useQuery({
    queryKey: ["getPropertiesData", pageObj.actualPage],
    queryFn: () => getData(1),
    enabled: false,
  });

  const onClickSearchHomes = () => {
    // setPageObj({actualPage: 1,pages: });
    properties_.refetch();
  };

  const [formVisible, setFormVisible] = useAtom(formVisibleAtom);
  const [filter, setFilter] = useAtom(filterAtom);
  const [enableSearching, setEnableSearching] = useAtom(enableSearchingAtom);
  const [searchInput, setSearchInput] = useAtom(searchInputAtom);
  const [properties, setProperties] = useAtom(propertiesAtom);
  const [mapProperties, setMapProperties] = useAtom(mapPropertiesAtom);

  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      /* Define search scope here */
    },
    debounce: 300,
  });

  useEffect(() => {
    if (searchParams.get("near")){
      console.log(searchParams.get("near"));
      const page = parseInt(searchParams.get("page") as string);
      setPageObj((prevPageObj) => {
        return {
          ...prevPageObj,
          actualPage: page,
        };
      });
      const near = searchParams.get("near") as string;
      console.log(searchParams.entries());
      let propertyType = (searchParams.get("PropertyType"))?.split(",");
      let propertySubType = (searchParams.get("PropertySubType"))?.split(",");
      let bedroomsTotal = searchParams.get("BedroomsTotal");
      let bathroomsTotal = searchParams.get("BathroomsTotal");
      let listPriceFrom = searchParams.get("ListPriceFrom");
      let listPriceTo = searchParams.get("ListPriceTo");
      // console.log(BedroomsTotal);
      let obj : any = {};
      propertyType && (obj.PropertyType = propertyType.toString());
      propertySubType && (obj.PropertySubType = propertySubType);
      bedroomsTotal && (obj.BedroomsTotal = bedroomsTotal);
      bathroomsTotal && (obj.BathroomsTotal = bathroomsTotal);
      listPriceFrom && (obj.ListPriceFrom = listPriceFrom);
      listPriceTo && (obj.ListPriceTo = listPriceTo);

      if(typeof propertyType != 'undefined' && propertyType.length){
        setFilter((prevState: any)=>{
          return {
            ...prevState,
            ...obj
          }
        });
        setSearchInput(near);
        getDataFromHome(page,near,obj,false);
      }
      else {
        propertyType = ["Residential Lease","Residential,Residential Income"];
        setFilter((prevState: any)=>{
          return {
            ...prevState,
            PropertyType: propertyType
          }
        });
        setSearchInput(near);
        getDataFromHome(page,near,propertyType,true);
      }
     
      // getData(page);
    } else if (window.location.href.split("/")[5]) {
      const city = window.location.href.split("/")[5];
      let modStr = city[0].toUpperCase() + city.slice(1);
      setFilter((prevState) => {
        return {
          ...prevState,
          City: modStr,
          PropertyType: ["Residential,Residential Income"]
        };
      });
      getDataCity(modStr);
    }
    // if(searchParams.get("page") || searchParams.get("near")){
    //   setFilter(prevFilter=>{
    //     return {
    //       ...prevFilter,

    //     }
    //   });
    // }
  }, []);

  const onInputAddressChange = (e: any) => {
    // Update the autocomplete input value
    // props.changeInput(e.target.value);
    setSearchInput(e.target.value);
    setValue(e.target.value);
  };

  const onSelectSuggestion = (suggestion: any) => () => {
    // When user selects a suggestion, update the input value and clear suggestions
    // props.changeInput(suggestion.description);
    setValue(suggestion.description, false);
    clearSuggestions();

    setSearchInput(suggestion.description);

    // Get latitude and longitude via utility functions
    getGeocode({ address: suggestion.description }).then((results) => {
      const { lat, lng } = getLatLng(results[0]);
      // Update your state with lat and lng
    });
  };

  //Jotai
  const onCheckEnablingSearching = () => {
    setEnableSearching((prevState: boolean) => !prevState);
  };

  const renderAutocompleteSuggestions = () =>
    data.map((suggestion) => (
      <p
        key={suggestion.place_id}
        style={{ border: "1px solid black" }}
        onClick={onSelectSuggestion(suggestion)}
      >
        <strong>{suggestion.structured_formatting.main_text}</strong>{" "}
        <small>{suggestion.structured_formatting.secondary_text}</small>
      </p>
    ));

  // Jotai state
  const onChangeSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFilter((prevSearch: FilterState) => ({
      ...prevSearch,
      [name]: value,
    }));
  };

  //Jotai
  const onChangeSlider = (values: any) => {
    setFilter((prevFilter: FilterState) => ({
      ...prevFilter,
      ListPriceFrom: values[0],
      ListPriceTo: values[1],
    }));
  };

  //State
  // const onChangeSlider = (values: any) => {
  //   const filter = {
  //     ...state.filter,
  //     ListPriceFrom: values[0],
  //     ListPriceTo: values[1],
  //   };

  //   setState((prevState) => ({
  //     ...prevState,
  //     filter: filter,
  //   }));
  // };

  //Jotai
  const onChangePropertyTypeCheckbox = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setFilter((prevFilter: FilterState) => {
      let PropertyTypes = Array.isArray(prevFilter.PropertyType)
        ? [...prevFilter.PropertyType]
        : [];

      if (event.target.checked) {
        PropertyTypes.push(event.target.value);
      } else {
        PropertyTypes = PropertyTypes.filter((item) => {
          return item !== event.target.value;
        });
      }

      return {
        ...prevFilter,
        PropertyType: PropertyTypes,
      };
    });
  };

  //Jotai
  const onChangeInput = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    // Remove any non-numeric characters from the input value
    const numericValue = Number(value.replace(/[^0-9]/g, ""));

    // Make sure the numeric value is within the valid range
    const filteredValue = Math.max(0, Math.min(100000000, numericValue));

    // Update the filter state using setFilter
    setFilter((prevFilter: FilterState) => ({
      ...prevFilter,
      [name]: filteredValue,
    }));
  };

  const toggleMapVisibility = (formType: keyof FormVisibleState) => {
    setFormVisible((prevFormVisible: FormVisibleState) => ({
      ...prevFormVisible,
      [formType]: !prevFormVisible[formType],
    }));
  };

  //Jotai
  const onChangePropertySubTypeCheckbox = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setFilter((prevFilter: FilterState) => {
      const PropertySubTypes = prevFilter.PropertySubType || [];
      const { value, checked } = event.target;

      if (checked) {
        // Add the value to the PropertySubTypes array if checked
        return {
          ...prevFilter,
          PropertySubType: [...PropertySubTypes, value],
        };
      } else {
        // Remove the value from the PropertySubTypes array if unchecked
        return {
          ...prevFilter,
          PropertySubType: PropertySubTypes.filter((item) => item !== value),
        };
      }
    });
  };

  //Jotai
  const toggleFormVisibility = (formType: keyof FormVisibleState) => {
    setFormVisible((prevFormVisible: FormVisibleState) => ({
      ...prevFormVisible,
      [formType]: !prevFormVisible[formType],
    }));
  };

  return (
    <>
      <div className={styles["property-search"]}>
        <div className={styles["filter-wrapper"]}>
          <Image
            width={40}
            height={40}
            src="/HOUSE.webp"
            alt="house icon"
            className={styles["type-icon"]}
          />
          {/* type icon */}
          <div
            className={styles["toggle-wrapper"]}
            onClick={() => toggleFormVisibility("propertyType")}
          >
            {/* toggle-wrapper */}
            <span className={styles["label_filters"]}>
              {formVisible.propertyType ? "Listing Type" : "Listing Type"}
            </span>
            {formVisible.propertyType ? (
              <Image
                width={40}
                height={40}
                src="/arrow-up.svg"
                alt="Up Arrow"
              />
            ) : (
              <Image
                width={40}
                height={40}
                src="/arrow-down.svg"
                alt="Down Arrow"
              />
            )}
          </div>
          {formVisible.propertyType && (
            <Form className={styles["property-type-form"]}>
              <Form.Group>
                <div
                  key={`default`}
                  className={`${styles["propType_filter"]} ${styles["mb-2"]}`}
                >
                  {/* "propType_filter mb-2" */}

                  <Form.Check>
                    <Form.Check.Input
                      value="Residential,Residential Income"
                      checked={
                        filter.PropertyType.indexOf(
                          "Residential,Residential Income"
                        ) > -1
                          ? true
                          : false
                      }
                      id="buy"
                      type="checkbox"
                      onChange={onChangePropertyTypeCheckbox}
                    />
                    <Form.Check.Label htmlFor="Buy">Buy</Form.Check.Label>
                  </Form.Check>

                  <Form.Check>
                    <Form.Check.Input
                      type="checkbox"
                      value="Residential Lease"
                      checked={
                        filter.PropertyType.indexOf("Residential Lease") > -1
                          ? true
                          : false
                      }
                      onChange={onChangePropertyTypeCheckbox}
                    />
                    <Form.Check.Label htmlFor="Rent">Rent</Form.Check.Label>
                  </Form.Check>

                  <Form.Check>
                    <Form.Check.Input
                      type="checkbox"
                      value="Commercial Sale"
                      checked={
                        filter.PropertyType.indexOf("Commercial Sale") > -1
                          ? true
                          : false
                      }
                      onChange={onChangePropertyTypeCheckbox}
                    />
                    <Form.Check.Label htmlFor="Commercial">
                      Commercial
                    </Form.Check.Label>
                  </Form.Check>

                  {/* <Form.Check
                    type="checkbox"
                    label="Commercial"
                    value="Commercial Sale"
                    checked={
                      state.filter.PropertyType.indexOf("Commercial Sale") > -1
                        ? true
                        : false
                    }
                    onChange={onChangePropertyTypeCheckbox}
                  /> */}
                  {/* <Form.Check
                    type="checkbox"
                    label="Business Opportunity"
                    value="Business Opportunity"
                    checked={
                      state.filter.PropertyType.indexOf(
                        "Business Opportunity"
                      ) > -1
                        ? true
                        : false
                    }
                    onChange={onChangePropertyTypeCheckbox}
                  /> */}
                </div>
              </Form.Group>
            </Form>
          )}
        </div>
        <div className={styles["filter-wrapper"]}>
          <Image
            width={40}
            height={40}
            className={styles["subtype-icon"]}
            src="/SKYSCRAPER.webp"
            alt="skyscrapper image"
          />
          <div
            onClick={() => toggleFormVisibility("propertySubType")}
            className={styles["toggle-wrapper"]}
          >
            <span className={styles["label_filters"]}>
              {formVisible.propertySubType
                ? "Listing SubType"
                : "Listing SubType"}
            </span>
            {formVisible.propertySubType ? (
              <Image
                width={40}
                height={40}
                src="/arrow-up.svg"
                alt="Up Arrow"
              />
            ) : (
              <Image
                width={40}
                height={40}
                src="/arrow-down.svg"
                alt="Down Arrow"
              />
            )}
          </div>

          {formVisible.propertySubType && (
            <Form className={styles["property-subtype-form"]}>
              <Form.Group>
                <div
                  key={`default`}
                  className={`${styles["propType_filter"]} ${styles["mb-2"]} `}
                >
                  <Form.Check // prettier-ignore
                    label="House"
                    type="checkbox"
                    value="Single Family Residence"
                    checked={
                      filter.PropertySubType.indexOf(
                        "Single Family Residence"
                      ) > -1
                        ? true
                        : false
                    }
                    onChange={onChangePropertySubTypeCheckbox}
                  />

                  <Form.Check
                    type="checkbox"
                    label="Condominium"
                    value="Condominium"
                    checked={
                      filter.PropertySubType.indexOf("Condominium") > -1
                        ? true
                        : false
                    }
                    onChange={onChangePropertySubTypeCheckbox}
                  />

                  <Form.Check
                    type="checkbox"
                    label="Townhomes"
                    value="Townhouse"
                    checked={
                      filter.PropertySubType.indexOf("Townhouse") > -1
                        ? true
                        : false
                    }
                    onChange={onChangePropertySubTypeCheckbox}
                  />
                  <Form.Check
                    type="checkbox"
                    label="Apartment"
                    value="Apartment"
                    checked={
                      filter.PropertySubType.indexOf("Apartment") > -1
                        ? true
                        : false
                    }
                    onChange={onChangePropertySubTypeCheckbox}
                  />

                  <Form.Check
                    type="checkbox"
                    label="Multi Family"
                    value="Multi Family"
                    checked={
                      filter.PropertySubType.indexOf("Multi Family") > -1
                        ? true
                        : false
                    }
                    onChange={onChangePropertySubTypeCheckbox}
                  />
                  {/* <Form.Check
                    type="checkbox"
                    label="2 Family"
                    value="2 Family"
                    checked={
                      filter.
                    }
                    // value={2}
                    // checked={filter.NumberOfUnitsTotal === 2}
                    // onChange={() => {
                    //   setFilter((prevFilter: FilterState) => ({
                    //     ...prevFilter,
                    //     NumberOfUnitsTotal:
                    //       prevFilter.NumberOfUnitsTotal === 2 ? 0 : 2,
                    //   }));
                    // }}
                  /> */}

                  <Form.Check
                    type="checkbox"
                    label="3 Family"
                    value="3 Family"
                    checked={
                      filter.PropertySubType.indexOf("3 Family") > -1
                        ? true
                        : false
                    }
                    onChange={onChangePropertySubTypeCheckbox}
                  />

                  <Form.Check
                    type="checkbox"
                    label="4 Family"
                    value="4 Family"
                    checked={
                      filter.PropertySubType.indexOf("4 Family") > -1
                        ? true
                        : false
                    }
                    onChange={onChangePropertySubTypeCheckbox}
                  />

                  <Form.Check
                    type="checkbox"
                    label="Residential"
                    value="Residential"
                    checked={
                      filter.PropertySubType.indexOf("Residential") > -1
                        ? true
                        : false
                    }
                    onChange={onChangePropertySubTypeCheckbox}
                  />

                  {/* <Form.Check
                    type="checkbox"
                    label="Duplex"
                    value="Duplex"
                    checked={
                      state.filter.PropertySubType.indexOf("Duplex") > -1
                        ? true
                        : false
                    }
                    onChange={onChangePropertySubTypeCheckbox}
                  /> */}

                  {/* 
                  <Form.Check
                    type="checkbox"
                    label="Cabin"
                    value="Cabin"
                    checked={
                      state.filter.PropertySubType.indexOf("Cabin") > -1
                        ? true
                        : false
                    }
                    onChange={onChangePropertySubTypeCheckbox}
                  /> */}

                  {/* <Form.Check
                    type="checkbox"
                    label="Parking"
                    value="Parking"
                    checked={
                      state.filter.PropertySubType.indexOf("Parking") > -1
                        ? true
                        : false
                    }
                    onChange={onChangePropertySubTypeCheckbox}
                  /> */}

                  {/* <Form.Check
                    type="checkbox"
                    label="Attached"
                    value="Attached (Townhouse/Rowhouse/Duplex)"
                    checked={
                      state.filter.PropertySubType.indexOf(
                        "Attached (Townhouse/Rowhouse/Duplex)"
                      ) > -1
                        ? true
                        : false
                    }
                    onChange={onChangePropertySubTypeCheckbox}
                  /> */}
                  {/* <Form.Check
                    type="checkbox"
                    label="Manufactured"
                    value="Manufactured Home"
                    checked={
                      state.filter.PropertySubType.indexOf(
                        "Manufactured Home"
                      ) > -1
                        ? true
                        : false
                    }
                    onChange={onChangePropertySubTypeCheckbox}
                  /> */}

                  {/* <Form.Check
                    type="checkbox"
                    label="Mobile Home"
                    value="Mobile Home"
                    checked={
                      state.filter.PropertySubType.indexOf("Mobile Home") > -1
                        ? true
                        : false
                    }
                    onChange={onChangePropertySubTypeCheckbox}
                  /> */}
                </div>
              </Form.Group>
            </Form>
          )}
        </div>
        <div className={styles["filter-wrapper"]}>
          <Image
            width={40}
            height={40}
            className={styles["price-icon"]}
            src="/HOMELOAN.webp"
            alt="money icon"
          />
          <div
            onClick={() => toggleFormVisibility("price")}
            className={styles["toggle-wrapper"]}
          >
            <span className={styles["label_filters"]}>
              {formVisible.price ? "Price Range" : "Price Range"}
            </span>
            {formVisible.price ? (
              <Image
                width={40}
                height={40}
                src="/arrow-up.svg"
                alt="Up Arrow"
              />
            ) : (
              <Image
                width={40}
                height={40}
                src="/arrow-down.svg"
                alt="Down Arrow"
              />
            )}
          </div>
          {formVisible.price && (
            <Form className={styles["price-input-wrapper"]}>
              <Form.Group className={styles["price-label"]}>
                <div className={styles["min-wrapper"]}>
                  <Form.Label>Min:</Form.Label>
                  <Form.Control
                    autoComplete="off"
                    name={"ListPriceFrom"}
                    onChange={onChangeInput}
                    value={filter.ListPriceFrom}
                    type="number"
                  />
                </div>
                <div>
                  <Form.Label>Max:</Form.Label>
                  <Form.Control
                    autoComplete="off"
                    name={"ListPriceTo"}
                    onChange={onChangeInput}
                    value={formatPrice(filter.ListPriceTo)}
                  />
                </div>
              </Form.Group>
              <div className={styles["range-slider-price"]}>
                <Slider
                  range
                  className="t-slider"
                  step={1000}
                  min={0}
                  max={10000000}
                  value={[filter.ListPriceFrom, filter.ListPriceTo]}
                  //[state.filter.ListPriceFrom, state.filter.ListPriceTo]
                  // onInput={onChangeSlider}
                  onChange={onChangeSlider}
                  vertical={false}
                  allowCross={false}
                />
              </div>
            </Form>
          )}
        </div>

        <div className={styles["filter-wrapper"]}>
          <Image
            width={40}
            height={40}
            className={styles["price-icon"]}
            src="/LOCATION.webp"
            alt="money icon"
          />
          <div
            onClick={() => toggleFormVisibility("city")}
            className={styles["toggle-wrapper"]}
          >
            <span className={styles["label_filters"]}>
              {formVisible.city ? "Location" : "Location"}
            </span>
            {formVisible.city ? (
              <Image
                width={40}
                height={40}
                src="/arrow-up.svg"
                alt="Up Arrow"
              />
            ) : (
              <Image
                width={40}
                height={40}
                src="/arrow-down.svg"
                alt="Down Arrow"
              />
            )}
          </div>

          {formVisible.city && (
            <Form className={styles["input-form-wrapper"]}>
              <Form.Group className={styles["input-form"]}>
                <div className={styles["mktFormColBuy"]}>
                  <Form.Check
                    checked={enableSearching}
                    type="checkbox"
                    onChange={onCheckEnablingSearching}
                    className={styles["mktoFormCheckBox"]}
                  />
                  <div className={styles["mktFieldWrap"]}>
                    <Form.Control
                      name="Location"
                      id="Location"
                      autoComplete="off"
                      type="text"
                      placeholder="Enter a Location"
                      className={
                        enableSearching
                          ? styles["inputText"]
                          : styles["disabled"]
                      }
                      onChange={onInputAddressChange}
                      disabled={!enableSearching}
                      // onSubmit={() => getData(1)}
                      value={searchInput}
                    />
                    {enableSearching && (
                      <Image
                        className={styles["icon-mag-buy"]}
                        src="/mag-glass.png"
                        height={25}
                        width={25}
                        alt="magnifiying glass icon"
                        // onClick={() => getData(1)}
                      />
                    )}

                    {status === "OK" && (
                      <div className={styles["autocomplete-suggestions"]}>
                        {renderAutocompleteSuggestions()}
                      </div>
                    )}
                  </div>
                </div>
                <div className={styles["city_label"]}>
                  <Form.Label
                    style={{
                      fontWeight: "bold",
                      lineHeight: "1.2",
                      marginTop: "5px",
                    }}
                    key={3021}
                  >
                    Uncheck Location Input to Use City Dropdown:
                  </Form.Label>
                  <Form.Select
                    value={filter.City}
                    name="City"
                    onChange={onChangeSelect}
                  >
                    {cities.map((city, index) => {
                      return (
                        <option key={index} value={city.Name}>
                          {city.Name}
                        </option>
                      );
                    })}
                  </Form.Select>
                </div>
              </Form.Group>
            </Form>
          )}
        </div>

        <div className={styles["filter-wrapper"]}>
          <div className={styles["bed-baths-icon-wrapper"]}>
            <Image
              width={55}
              height={55}
              className={styles["beds-icon"]}
              src={"/BEDROOM.webp"}
              alt="Bedroom Icon"
            />
            <Image
              width={55}
              height={55}
              alt="Bathroom Icon"
              className={styles["baths-icon"]}
              src={"/BATHTUB.webp"}
            />
          </div>

          <div
            onClick={() => toggleFormVisibility("bedBaths")}
            className={styles["toggle-wrapper"]}
          >
            <span className={styles["label_filters"]}>
              {formVisible.bedBaths ? "Beds & Baths" : "Beds & Baths"}
            </span>
            {formVisible.bedBaths ? (
              <Image
                width={40}
                height={40}
                src={"/arrow-up.svg"}
                alt="Up Arrow"
              />
            ) : (
              <Image
                width={40}
                height={40}
                src="/arrow-down.svg"
                alt="Down Arrow"
              />
            )}
          </div>

          {formVisible.bedBaths && (
            <>
              <Form className={styles["beds-baths-form"]}>
                <Form.Group>
                  <div className={styles["beds-label"]}>
                    <Form.Label>Beds:</Form.Label>
                  </div>
                  <Form.Select
                    value={filter.BedroomsTotal}
                    name="BedroomsTotal"
                    onChange={onChangeSelect}
                  >
                    <option value={"Any"}>Any</option>
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                    <option value={4}>4</option>
                    <option value={"5+"}>5+</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group>
                  <div className={styles["baths-label"]}>
                    <Form.Label>Baths:</Form.Label>
                  </div>
                  <Form.Select
                    value={filter.BathroomsTotal}
                    name="BathroomsTotal"
                    onChange={onChangeSelect}
                  >
                    <option value={"Any"}>Any</option>
                    <option value={1}>1</option>
                    <option value={1.5}>1.5</option>
                    <option value={2}>2</option>
                    <option value={2.5}>2.5</option>
                    <option value={"3+"}>3+</option>
                  </Form.Select>
                </Form.Group>
              </Form>
            </>
          )}
        </div>
      </div>
      <SearchButton onClick={onClickSearchHomes} />

      <div className={formVisible["map"] ? styles["search-container"] : ""}>
        <div className={styles["properties-grid-filter"]}>
          {/* <div className="pagination-wrapper">
            <Pagination>{items}</Pagination>
          </div> */}
          <div className={styles["btn-map-wrapper"]}>
            <div className={styles["btn-filters-vis"]}>
              <span>{"MORE FILTERS"}</span>
            </div>
            <div
              className={styles["btn-map"]}
              onClick={() => toggleMapVisibility("map")}
            >
              <span>{formVisible.map ? "HIDE MAP" : "VIEW MAP"}</span>
            </div>
          </div>

          <div className={styles["sort-container"]}>
            <div className={styles["sort-select"]}>
              {formVisible.sortBy && (
                <Form.Select
                  value={filter.sortBy}
                  onChange={onChangeSelect}
                  name="sortBy"
                >
                  <option value={""}>Sort By</option>
                  <option value={"ListPrice"}>List Price</option>
                  <option value={"LivingArea"}>Living Area</option>
                  <option value={"ModificationTimestamp"}>Last Modified</option>
                  <option value={"ListingContractDate"}>Listing Date</option>
                </Form.Select>
              )}
            </div>
            <div className={styles["order-select"]}>
              {formVisible.sortBy && (
                <Form.Select
                  value={filter.order}
                  onChange={onChangeSelect}
                  name="order"
                >
                  <option value={"asc"}>ascending</option>
                  <option value={"desc"}>descending</option>
                </Form.Select>
              )}
            </div>
          </div>

          {/* <PropertySeachList properties={properties} /> */}
          <div
            className={
              formVisible["map"]
                ? styles["properties_grid_map_view"]
                : styles["properties_grid"]
            }
          >
            <Suspense fallback={<Loading />}>
              <PropertySearchList
                properties={properties}
                onClick={onPropertyClick}
              />
            </Suspense>
            {/* {properties.map((property: Property, index: number) => {
              return (
                <PropertySearchTile
                  key={property.id || index}
                  onClick={() => {}}
                  data={property}
                />
              );
            })} */}
          </div>

          <div className={styles["pagination-wrapper"]}>
            <Suspense fallback={<Loading />}>
              <Pagination>
                {createPagination(pageObj.pages, pageObj.actualPage, getData)}
              </Pagination>
            </Suspense>
          </div>
        </div>
        <div className={styles["map-wrapper"]}>
          {formVisible.map && (
            <div className={styles["grid-prop-map"]}>
              <Suspense fallback={<Loading />}>
                <Map properties={mapProperties} onMoveMap={onMoveMap} />
              </Suspense>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

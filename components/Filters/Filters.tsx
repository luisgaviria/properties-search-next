"use client";
import { useState, ChangeEvent } from "react";
import Image from "@/node_modules/next/image";
import { Form } from "@/app/client-react-boostrap";
import styles from "./Filters.module.scss";
import cities from "../../data/massachusetsCities.json";
// import PropertySearchTile from "../PropertySearchTile/PropertySearchTile";

import Slider from "@/node_modules/rc-slider/lib/Slider";

import "rc-slider/assets/index.css";

import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";


// interface FiltersProps {
//   changeFilter: (filter: FilterState) => void;
// }

interface stateInterface {
  formVisible: FormVisibleState;
  filter: FilterState;
  enableSearching: boolean;
}

interface FormVisibleState {
  propertyType: boolean;
  price: boolean;
  city: boolean;
  bedBaths: boolean;
  propertySubType: boolean;
  map: boolean;
  sortBy: boolean;
}

interface FilterState {
  ListPriceFrom: number;
  ListPriceTo: number;
  City: string;
  PropertyType: string[];
  PropertySubType: string[];
  NumberOfUnitsTotal: number | null;
  BathroomsTotal: number;
  BedroomsTotal: number;
  sortBy: string;
  order: string;
}

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(price);
};

// const checkNumberNine = (number: any) => {
//     const digitCount = Array.from(String(number)).reduce((count: any, digit: any) => {
//       count[digit] = (count[digit] || 0) + 1;
//       return count;
//     }, {});

//     if (digitCount["9"] === String(number).length) {
//       return null;
//     }

//     return number;
// };

export default function Filters() {
  const [searchCounter, setSearchCounter] = useState(0);
  const [state, setState] = useState<stateInterface>({
    formVisible: {
      propertyType: true,
      propertySubType: true,
      price: true,
      city: true,
      bedBaths: true,
      map: false,
      sortBy: false,
    },
    filter: {
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
    },
    enableSearching: true,
  });

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

  const onInputAddressChange = (e: any) => {
    // Update the autocomplete input value
    // props.changeInput(e.target.value);
    setValue(e.target.value);
  };

  const onSelectSuggestion = (suggestion: any) => () => {
    // When user selects a suggestion, update the input value and clear suggestions
    // props.changeInput(suggestion.description);
    setValue(suggestion.description, false);
    clearSuggestions();

    // Get latitude and longitude via utility functions
    getGeocode({ address: suggestion.description }).then((results) => {
      const { lat, lng } = getLatLng(results[0]);
      // Update your state with lat and lng
    });
  };

  const onCheckEnablingSearching = () => {
    // props.changeEnableSearching(!state.enableSearching);
    setState((prevState) => {
      const newState = {
        ...prevState,
        enableSearching: !prevState.enableSearching,
      };
      return newState;
    });
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


  const onChangeSelect = (event: any) => {
    const filter = { ...state.filter, [event.target.name]: event.target.value };
    // changeFilter(filter);
    setState((prevState) => ({
      ...prevState,
      filter,
    }));
  };

  const onChangeSlider = (values: any) => {
    const filter = {
      ...state.filter,
      ListPriceFrom: values[0],
      ListPriceTo: values[1],
    };

    setState((prevState) => ({
      ...prevState,
      filter: filter,
    }));
  };

  const onChangePropertyTypeCheckbox = (event: any) => {
    let PropertyTypes = Array.isArray(state.filter.PropertyType)
      ? state.filter.PropertyType
      : [];

    if (event.target.checked) {
      PropertyTypes.push(event.target.value);
    } else {
      PropertyTypes = PropertyTypes.filter((item) => {
        return item !== event.target.value;
      });
    }

    setState((prevState) => {
      return {
        ...prevState,
        filter: {
          ...prevState.filter,
          PropertyType: PropertyTypes,
        },
      };
    });
  };

  const onChangeInput = (event: any) => {
    const { name, value } = event.target;

    // Remove any non-numeric characters from the input value
    const numericValue = Number(value.replace(/[^0-9]/g, ""));

    // Make sure the numeric value is within the valid range
    const filteredValue = Math.max(0, Math.min(100000000, numericValue));

    // Update the state and the slider based on the input change
    setState((prevState) => ({
      ...prevState,
      filter: {
        ...prevState.filter,
        [name]: filteredValue,
      },
    }));
  };

  const onChangePropertySubTypeCheckbox = (event: any) => {
    let PropertySubTypes = state.filter.PropertySubType;
    if (event.target.checked) {
      PropertySubTypes.push(event.target.value);
    } else {
      PropertySubTypes = PropertySubTypes.filter((item) => {
        return item !== event.target.value;
      });
    }
    setState((state) => {
      return {
        ...state,
        filter: {
          ...state.filter,
          PropertySubType: PropertySubTypes,
        },
      };
    });
  };

  const toggleFormVisibility = (formType: keyof FormVisibleState) => {
    setState((prevState) => ({
      ...prevState,
      formVisible: {
        ...prevState.formVisible,
        [formType]: !prevState.formVisible[formType],
      },
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
            {state.formVisible.propertyType ? "Listing Type" : "Listing Type"}
          </span>
          {state.formVisible.propertyType ? (
            <Image width={40} height={40} src="/arrow-up.svg" alt="Up Arrow" />
          ) : (
            <Image
              width={40}
              height={40}
              src="/arrow-down.svg"
              alt="Down Arrow"
            />
          )}
        </div>
        {state.formVisible.propertyType && (
          <Form className={styles["property-type-form"]}>
            <Form.Group>
              <div
                key={`default`}
                className={`${styles["propType_filter"]} ${styles["mb-2"]}`}
              >
                {/* "propType_filter mb-2" */}
                <Form.Check
                  type="checkbox"
                  label="Buy"
                  value="Residential,Residential Income"
                  checked={
                    state.filter.PropertyType.indexOf(
                      "Residential,Residential Income"
                    ) > -1
                      ? true
                      : false
                  }
                  onChange={onChangePropertyTypeCheckbox}
                />
                <Form.Check
                  type="checkbox"
                  label="Rent"
                  value="Residential Lease"
                  checked={
                    state.filter.PropertyType.indexOf("Residential Lease") > -1
                      ? true
                      : false
                  }
                  onChange={onChangePropertyTypeCheckbox}
                />
                <Form.Check
                  type="checkbox"
                  label="Commercial"
                  value="Commercial Sale"
                  checked={
                    state.filter.PropertyType.indexOf("Commercial Sale") > -1
                      ? true
                      : false
                  }
                  onChange={onChangePropertyTypeCheckbox}
                />
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
            {state.formVisible.propertySubType
              ? "Listing SubType"
              : "Listing SubType"}
          </span>
          {state.formVisible.propertySubType ? (
            <Image width={40} height={40} src="/arrow-up.svg" alt="Up Arrow" />
          ) : (
            <Image
              width={40}
              height={40}
              src="/arrow-down.svg"
              alt="Down Arrow"
            />
          )}
        </div>

        {state.formVisible.propertySubType && (
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
                    state.filter.PropertySubType.indexOf(
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
                    state.filter.PropertySubType.indexOf("Condominium") > -1
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
                    state.filter.PropertySubType.indexOf("Townhouse") > -1
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
                    state.filter.PropertySubType.indexOf("Apartment") > -1
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
                    state.filter.PropertySubType.indexOf("Multi Family") > -1
                      ? true
                      : false
                  }
                  onChange={onChangePropertySubTypeCheckbox}
                />
                <Form.Check
                  type="checkbox"
                  label="2 Family"
                  value={2}
                  checked={state.filter.NumberOfUnitsTotal == 2 ? true : false}
                  onChange={() => {
                    // special function
                    const temp = state.filter.NumberOfUnitsTotal;
                    if (!temp) {
                      setState((prevState: any) => {
                        return {
                          ...prevState,
                          filter: {
                            ...prevState.filter,
                            NumberOfUnitsTotal: 2,
                          },
                        };
                      });
                    } else {
                      setState((prevState: any) => {
                        return {
                          ...prevState,
                          filter: {
                            ...prevState.filter,
                            NumberOfUnitsTotal: 0,
                          },
                        };
                      });
                    }
                  }}
                />

                <Form.Check
                  type="checkbox"
                  label="3 Family"
                  value="3 Family"
                  checked={
                    state.filter.PropertySubType.indexOf("3 Family") > -1
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
                    state.filter.PropertySubType.indexOf("4 Family") > -1
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
                    state.filter.PropertySubType.indexOf("Residential") > -1
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
            {state.formVisible.price ? "Price Range" : "Price Range"}
          </span>
          {state.formVisible.price ? (
            <Image width={40} height={40} src="/arrow-up.svg" alt="Up Arrow" />
          ) : (
            <Image
              width={40}
              height={40}
              src="/arrow-down.svg"
              alt="Down Arrow"
            />
          )}
        </div>
        {state.formVisible.price && (
          <Form className={styles["price-input-wrapper"]}>
            <Form.Group className={styles["price-label"]}>
              <div className={styles["min-wrapper"]}>
                <Form.Label>Min:</Form.Label>
                <Form.Control
                  autoComplete="off"
                  name={"ListPriceFrom"}
                  onChange={onChangeInput}
                  value={state.filter.ListPriceFrom}
                  type="number"
                />
              </div>
              <div>
                <Form.Label>Max:</Form.Label>
                <Form.Control
                  autoComplete="off"
                  name={"ListPriceTo"}
                  onChange={onChangeInput}
                  value={formatPrice(state.filter.ListPriceTo)}
                />
              </div>
            </Form.Group>
            <div className={styles["range-slider-price"]}>
              <Slider
                range
                step={1000}
                min={0}
                max={10000000}
                value={(state.filter.ListPriceFrom, state.filter.ListPriceTo)}
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
            {state.formVisible.city ? "Location" : "Location"}
          </span>
          {state.formVisible.city ? (
            <Image width={40} height={40} src="/arrow-up.svg" alt="Up Arrow" />
          ) : (
            <Image
              width={40}
              height={40}
              src="/arrow-down.svg"
              alt="Down Arrow"
            />
          )}
        </div>

        {state.formVisible.city && (
          <Form className={styles["input-form-wrapper"]}>
            <Form.Group className={styles["input-form"]}>
              <div className={styles["mktFormColBuy"]}>
                <Form.Check
                  checked={state.enableSearching}
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
                    className={state.enableSearching ? styles["inputText"] : styles["disabled"]}
                    onChange={onInputAddressChange}
                    // onSubmit={() => getData(1)}
                    value={value}
                  />
                  {state.enableSearching && (
                      <img
                        className={styles["icon-mag-buy"]}
                        // src={magGlass}
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
                  value={state.filter.City}
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
            {state.formVisible.bedBaths ? "Beds & Baths" : "Beds & Baths"}
          </span>
          {state.formVisible.bedBaths ? (
            <Image width={40} height={40} src="/arrow-up.svg" alt="Up Arrow" />
          ) : (
            <Image
              width={40}
              height={40}
              src="/arrow-down.svg"
              alt="Down Arrow"
            />
          )}
        </div>

        {state.formVisible.bedBaths && (
          <>
            <Form className={styles["beds-baths-form"]}>
              <Form.Group>
                <div className={styles["beds-label"]}>
                  <Form.Label>Beds:</Form.Label>
                </div>
                <Form.Select
                  value={state.filter.BedroomsTotal}
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
                  value={state.filter.BathroomsTotal}
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

    <div className={styles["search-btn"]}>
        <div className={styles["btn-cta" ]}
        // onClick={() => getData(1)}
        >
          <span>SEARCH HOMES</span>
        </div>
      </div>
      {/* <PropertySearchTile data={{StreetNumber: 10,LivingArea: 10,StreetName: "hello",City: "Test", ListPrice: "Hello",LivingArea: "10200", BedroomsTotal: 10,BathroomsTotalDecimal: 12.3,MLSAreaMajor: "HELLo"}}/> */}
    </>
  );
}

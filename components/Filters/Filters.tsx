"use client";
// import { useState, ChangeEvent } from "react";
import { atom, useAtom } from "jotai";
import { useHydrateAtoms } from "jotai/utils";

import Image from "@/node_modules/next/image";
import { Form } from "@/app/client-react-boostrap";
import styles from "./Filters.module.scss";
import cities from "../../data/massachusetsCities.json";
// import PropertySearchTile from "../PropertySearchTile/PropertySearchTile";

import Slider from "@/node_modules/rc-slider/lib/Slider";
import Map from "@/components/Map/Map";

import "rc-slider/assets/index.css";

import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import SearchButton from "../SearchButton/SearchButton";

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

const formVisibleAtom = atom({
  propertyType: true,
  propertySubType: true,
  price: true,
  city: true,
  bedBaths: true,
  map: false,
  sortBy: true,
});

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

const enableSearchingAtom = atom({
  enableSearching: true,
});

export default function Filters() {
  // const [searchCounter, setSearchCounter] = useState(0);

  const [formVisible, setFormVisible] = useAtom(formVisibleAtom);
  const [filter, setFilter] = useAtom(filterAtom);
  const [enableSearching, setEnableSearching] = useAtom(enableSearchingAtom);

  // const [state, setState] = useState<stateInterface>({
  //   formVisible: {
  //     propertyType: true,
  //     propertySubType: true,
  //     price: true,
  //     city: true,
  //     bedBaths: true,
  //     map: false,
  //     sortBy: true,
  //   },
  //   filter: {
  //     ListPriceFrom: 0,
  //     ListPriceTo: 0,
  //     City: "Any",
  //     PropertyType: [],
  //     PropertySubType: [],
  //     NumberOfUnitsTotal: null,
  //     BathroomsTotal: 0,
  //     BedroomsTotal: 0,
  //     sortBy: "ListPrice",
  //     order: "desc",
  //   },
  //   enableSearching: true,
  // });

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

  //Jotai
  const onCheckEnablingSearching = () => {
    setEnableSearching((prevSeach) => ({
      ...prevSeach,
      enableSearching: !prevSeach.enableSearching,
    }));
  };

  //State
  // const onCheckEnablingSearching = () => {
  //   // props.changeEnableSearching(!state.enableSearching);
  //   setState((prevState) => {
  //     const newState = {
  //       ...prevState,
  //       enableSearching: !prevState.enableSearching,
  //     };
  //     return newState;
  //   });
  // };

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
  const onChangeSelect = (event: any) => {
    const { name, value } = event.target;
    setFilter((prevSeach) => ({
      ...prevSeach,
      [name]: value,
    }));
  };

  //useState
  // const onChangeSelect = (event: any) => {
  //   const filter = { ...state.filter, [event.target.name]: event.target.value };
  //   // changeFilter(filter);
  //   setState((prevState) => ({
  //     ...prevState,
  //     filter,
  //   }));
  // };

  //Jotai
  const onChangeSlider = (values: any) => {
    setFilter((prevFilter) => ({
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
    setFilter((prevFilter) => {
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

  //State
  // const onChangePropertyTypeCheckbox = (event: any) => {
  //   let PropertyTypes = Array.isArray(state.filter.PropertyType)
  //     ? state.filter.PropertyType
  //     : [];

  //   if (event.target.checked) {
  //     PropertyTypes.push(event.target.value);
  //   } else {
  //     PropertyTypes = PropertyTypes.filter((item) => {
  //       return item !== event.target.value;
  //     });
  //   }

  //   setState((prevState) => {
  //     return {
  //       ...prevState,
  //       filter: {
  //         ...prevState.filter,
  //         PropertyType: PropertyTypes,
  //       },
  //     };
  //   });
  // };

  //Jotai
  const onChangeInput = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    // Remove any non-numeric characters from the input value
    const numericValue = Number(value.replace(/[^0-9]/g, ""));

    // Make sure the numeric value is within the valid range
    const filteredValue = Math.max(0, Math.min(100000000, numericValue));

    // Update the filter state using setFilter
    setFilter((prevFilter) => ({
      ...prevFilter,
      [name]: filteredValue,
    }));
  };

  //State
  // const onChangeInput = (event: any) => {
  //   const { name, value } = event.target;

  //   // Remove any non-numeric characters from the input value
  //   const numericValue = Number(value.replace(/[^0-9]/g, ""));

  //   // Make sure the numeric value is within the valid range
  //   const filteredValue = Math.max(0, Math.min(100000000, numericValue));

  //   // Update the state and the slider based on the input change
  //   setState((prevState) => ({
  //     ...prevState,
  //     filter: {
  //       ...prevState.filter,
  //       [name]: filteredValue,
  //     },
  //   }));
  // };

  // const toggleMapVisibility = (formType: keyof FormVisibleState) => {
  //   //
  //   //  "save global state"
  //   // saveGlobalStateToLocalStorage();
  //   //
  //   setState((prevState) => ({
  //     ...prevState,
  //     formVisible: {
  //       ...prevState.formVisible,
  //       [formType]: !prevState.formVisible[formType],
  //     },
  //   }));
  // };

  const toggleMapVisibility = (formType: keyof FormVisibleState) => {
    setFormVisible((prevFormVisible) => ({
      ...prevFormVisible,
      [formType]: !prevFormVisible[formType],
    }));
  };

  //Jotai
  const onChangePropertySubTypeCheckbox = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setFilter((prevFilter) => {
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

  //State
  // const onChangePropertySubTypeCheckbox = (event: any) => {
  //   let PropertySubTypes = state.filter.PropertySubType;
  //   if (event.target.checked) {
  //     PropertySubTypes.push(event.target.value);
  //   } else {
  //     PropertySubTypes = PropertySubTypes.filter((item) => {
  //       return item !== event.target.value;
  //     });
  //   }
  //   setState((state) => {
  //     return {
  //       ...state,
  //       filter: {
  //         ...state.filter,
  //         PropertySubType: PropertySubTypes,
  //       },
  //     };
  //   });
  // };

  //Jotai
  const toggleFormVisibility = (formType: keyof FormVisibleState) => {
    setFormVisible((prevFormVisible) => ({
      ...prevFormVisible,
      [formType]: !prevFormVisible[formType],
    }));
  };

  //State
  // const toggleFormVisibility = (formType: keyof FormVisibleState) => {
  //   setState((prevState) => ({
  //     ...prevState,
  //     formVisible: {
  //       ...prevState.formVisible,
  //       [formType]: !prevState.formVisible[formType],
  //     },
  //   }));
  // };

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
                  <Form.Check
                    type="checkbox"
                    label="2 Family"
                    value={2}
                    checked={filter.NumberOfUnitsTotal === 2}
                    onChange={() => {
                      setFilter((prevFilter) => ({
                        ...prevFilter,
                        NumberOfUnitsTotal:
                          prevFilter.NumberOfUnitsTotal === 2 ? 0 : 2,
                      }));
                    }}
                  />

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
                  step={1000}
                  min={0}
                  max={10000000}
                  value={(filter.ListPriceFrom, filter.ListPriceTo)}
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
                    checked={!!enableSearching}
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
                      // onSubmit={() => getData(1)}
                      value={value}
                    />
                    {enableSearching && (
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
      <SearchButton />

      <div className={formVisible["map"] ? "search-container" : ""}>
        <div className="properties-grid-filter">
          {/* <div className="pagination-wrapper">
            <Pagination>{items}</Pagination>
          </div> */}

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

          <div className={styles["map-wrapper"]}>
            {formVisible.map && (
              <div className={styles["grid-prop-map"]}>
                <Map
                // properties={state.mapProperties}
                // onMoveMap={onMoveMap}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* <PropertySearchTile data={{StreetNumber: 10,LivingArea: 10,StreetName: "hello",City: "Test", ListPrice: "Hello",LivingArea: "10200", BedroomsTotal: 10,BathroomsTotalDecimal: 12.3,MLSAreaMajor: "HELLo"}}/> */}
    </>
  );
}

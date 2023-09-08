'use client'
import { useState } from "react";
import Image from "next/image";
import { Form } from "@/app/client-react-boostrap";
import styles from "./Filters.module.scss"; 
import RangeSlider from "react-range-slider-input";


import arrowDown from "./images/svg/arrow-down.svg";
import arrowUp from "./images/svg/arrow-up.svg";
import LocationPNG from "./images/LOCATION.webp";
import PricePNG from "./images/HOMELOAN.webp";
import SubTypePNG from "./images/SKYSCRAPER.webp";
import TypePNG from "./images/HOUSE.webp";
import BedsPNG from "./images/BEDROOM.webp";
import BathsPNG from "./images/BATHTUB.webp";

interface formVisibleInt {
    propertyType: boolean,
    price: boolean, 
    city: boolean,
    bedBaths: boolean,
    property_sub_type: boolean,
    map: boolean, 
    sortBy: boolean
}

const formatPrice = (price:any) => {
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

export default function Filters(){
    const [state,setState] = useState({
        formVisible: {
            propertyType: false, 
            property_sub_type: false,
            price: false
        },
        filter: {
            ListPriceFrom: 0,
            ListPriceTo: 0,
            City: "Any",
            PropertyType: [] as string[], 
            PropertySubType: [] as string[],
            NumberOfUnitsTotal: null,
            sortBy: "ListPrice",
            order: "desc",
        } 
    });

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

    const onChangePropertyTypeCheckbox = (event: any ) => {
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
    
    
    const onChangePropertySubTypeCheckbox = (event: any)=>{
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
    
    const toggleFormVisibility = (formType: any) => {
        setState((prevState) => ({
          ...prevState,
          formVisible: {
            ...prevState.formVisible,
            [formType]: !(prevState.formVisible as any)[formType],// not any should be here 
          },
        }));
      };
    
     
    return (
        <div className={styles["property-search"]}>
            <div className={styles["filter-wrapper"]}>
                <Image src={TypePNG} alt="house icon" className={styles["type-icon"]}/>
                {/* type icon */}
                <div className={styles["toggle-wrapper"]} onClick={()=> toggleFormVisibility("propertyType")}>
                    {/* toggle-wrapper */}
                    <span className={styles["label_filters"]}>
                        {state.formVisible.propertyType ? "Listing Type" : "Listing Type"}
                    </span>
                        {state.formVisible.propertyType ? (
                    <Image src={arrowUp} alt="Up Arrow" />
                    ) : (
                    <Image src={arrowDown} alt="Down Arrow" />
                    )}
                </div>
                {state.formVisible.propertyType && (
            <Form className={styles["property-type-form"]}>
              <Form.Group>
                <div key={`default`} className={`${styles["propType_filter"]} ${styles["mb-2"]}`}>
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
                      state.filter.PropertyType.indexOf("Residential Lease") >
                      -1
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
            <div
                onClick={() => toggleFormVisibility("property_sub_type")}
                className={styles["toggle-wrapper"]}
            >
                  <Image className={styles["subtype-icon"]} src={SubTypePNG} alt="skyscrapper image"/>

            <span className={styles["label_filters"]}>
              {state.formVisible.property_sub_type
                ? "Listing SubType"
                : "Listing SubType"}
            </span>
            {state.formVisible.property_sub_type ? (
              <Image src={arrowUp} alt="Up Arrow" />
            ) : (
              <Image src={arrowDown} alt="Down Arrow" />
            )}
          </div>


          {state.formVisible.property_sub_type && (
            <Form className={styles["property-subtype-form"]}>
              <Form.Group>
                <div key={`default`} className={`${styles["propType_filter"]} ${styles["mb-2"]} `}>
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
                    checked={
                      state.filter.NumberOfUnitsTotal == 2 ? true : false
                    }
                    onChange={() => {
                      // special function
                      const temp = state.filter.NumberOfUnitsTotal;
                      if (!temp) {
                        setState((prevState : any) => {
                          return {
                            ...prevState,
                            filter: {
                              ...prevState.filter,
                              NumberOfUnitsTotal: 2,
                            },
                          };
                        });

                      } else {
                        setState((prevState : any) => {
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
          <Image className={styles["price-icon"]} src={PricePNG} alt="money icon"/>
          <div
            onClick={() => toggleFormVisibility("price")}
            className={styles["toggle-wrapper"]}
          >
            <span className={styles["label_filters"]}>
              {state.formVisible.price ? "Price Range" : "Price Range"}
            </span>
            {state.formVisible.price ? (
              <Image src={arrowUp} alt="Up Arrow" />
            ) : (
              <Image src={arrowDown} alt="Down Arrow" />
            )}
          </div>
          {state.formVisible.price && (
            <Form className={styles["price-input-wrapper"]}>
              <Form.Group className={styles["price-label"]}>
                <div>
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
                <RangeSlider
                  step={1000}
                  min={0}
                  max={10000000}
                  value={[state.filter.ListPriceFrom, state.filter.ListPriceTo]}
                  onInput={onChangeSlider}
                />
              </div>
            </Form>
          )}
        </div>
        </div> 
        
    );
    // return (

    // );
};
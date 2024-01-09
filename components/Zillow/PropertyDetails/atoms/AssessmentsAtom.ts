import {atom} from "jotai";
export interface AssessmentInt {
    landUseDescription:     string;
    zoningDescription:      string;
    year:                   number;
    marketLandValue:        string;
    numberOfBuildings:      number;
    lotSizeIrregular:       string;
    county:                 string;
    pools:                  any[];
    censusTract:            string;
    areas:                  Area[];
    building:               Building[];
    lotSizeFrontage:        string;
    parcelID:               string;
    marketValueYear:        string;
    lotTopography:          string;
    ownerName:              string[];
    taxYear:                number;
    marketTotalValue:       string;
    taxID:                  null | string;
    taxExemption:           string;
    legal:                  Legal;
    id:                     string;
    state:                  string;
    lotSizeDepth:           string;
    apn:                    string;
    marketImprovementValue: string;
    totalValue:             number;
    address:                Address;
    landUseCode:            string;
    landUseGeneral:         string;
    coordinates:            number[];
    zpid:                   string;
    fips:                   string;
    landValue:              number;
    zoningCode:             string;
    lotSizeAcres:           number;
    garages:                Garage[];
    improvementValue:       number;
    taxAmount:              number;
    lotSizeSquareFeet:      number;
    url:                    string;
}

interface Address {
    zip:          string;
    city:         string;
    zip4:         string;
    streetPre:    string;
    house:        string;
    unitType:     string;
    unit:         string;
    street:       string;
    houseExt:     string;
    streetSuffix: string;
    state:        string;
    streetPost:   string;
    full:         string;
}




export interface Area {
    areaSquareFeet: number;
    type:           string;
}



export interface Building {
    airConditioning:    string;
    foundation:         string;
    architecturalStyle: string;
    yearBuilt:          number;
    fireplace:          string;
    noOfUnits:          number;
    effectiveYearBuilt: string;
    sewer:              string;
    heating:            string;
    class:              string;
    comments:           string;
    quarterBaths:       string;
    totalStories:       number;
    kitchens:           string;
    water:              string;
    classDescription:   string;
    quality:            string;
    totalRooms:         number;
    bedrooms:           number;
    condition:          string;
    baths:              string;
    threeQuarterBaths:  string;
    halfBaths:          number;
    occupancyStatus:    string;
    fullBaths:          number;
}


export interface Garage {
    carCount:       number;
    areaSquareFeet: string;
    type:           string;
}



export interface Legal {
    phase:           string|null;
    tract:           string|null;
    city:            string|null;
    municipality:    string|null;
    section:         string|null;
    lot:             string|null;
    otherLot:        string|null;
    unit:            string|null;
    lotDescription:  string|null;
    district:        string|null;
    block:           string|null;
    subdivisionName: string|null;
    township:        string;
}

export const AssessmentsAtom = atom<AssessmentInt[]>([]);

AssessmentsAtom.debugLabel = "Assessments Data";
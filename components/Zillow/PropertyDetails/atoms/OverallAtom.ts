import { atom } from "jotai";
export interface OverallInt {
    landUseDescription: string;
    zoningDescription:  string;
    numberOfBuildings:  number;
    lotSizeIrregular:   string;
    county:             string;
    pools:              any[];
    areas:              Area[];
    building:           Building[];
    lotSizeFrontage:    string;
    parcelID:           number;
    lotTopography:      string;
    ownerName:          string[];
    legal:              Legal;
    id:                 string;
    state:              string;
    lotSizeDepth:       string;
    apn:                string;
    address:            Address;
    landUseCode:        string;
    landUseGeneral:     string;
    coordinates:        number[];
    zpid:               string;
    fips:               string;
    zoningCode:         string;
    lotSizeAcres:       number;
    garages:            Garage[];
    lotSizeSquareFeet:  number;
    transactionsUrl:    string;
    assessmentsUrl:     string;
    url:                string;
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

interface Area {
    areaSquareFeet: number;
    type:           string;
}

interface Building {
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

interface Garage {
    carCount:       number;
    areaSquareFeet: string;
    type:           string;
}

interface Legal {
    phase:           string;
    tract:           string;
    city:            string;
    municipality:    string;
    section:         string;
    lot:             string;
    otherLot:        string;
    unit:            string;
    lotDescription:  string;
    district:        string;
    block:           string;
    subdivisionName: string;
    township:        string;
}
 

export const OverallAtom = atom<Overall>({
    landUseDescription: "",
    zoningDescription:  "",
    numberOfBuildings:  0,
    lotSizeIrregular:   "",
    county:             "",
    pools:              [],
    areas:              [],
    building:           [],
    lotSizeFrontage:    "",
    parcelID:           0,
    lotTopography:      "",
    ownerName:          [],
    legal:              {
        phase:           "",
        tract:           "",
        city:            "",
        municipality:    "",
        section:         "",
        lot:             "",
        otherLot:        "",
        unit:            "",
        lotDescription:  "",
        district:        "",
        block:           "",
        subdivisionName: "",
        township:        ""
    },
    id:                 "",
    state:              "",
    lotSizeDepth:       "",
    apn:                "",
    address:            {    
        zip:          "",
        city:         "",
        zip4:         "",
        streetPre:    "",
        house:        "",
        unitType:     "",
        unit:         "",
        street:       "",
        houseExt:     "",
        streetSuffix: "",
        state:        "",
        streetPost:   "",
        full:         "",
    },
    landUseCode:        "",
    landUseGeneral:     "",
    coordinates:        [],
    zpid:               "",
    fips:               "",
    zoningCode:         "",
    lotSizeAcres:       0,
    garages:            [],
    lotSizeSquareFeet:  0,
    transactionsUrl:    "",
    assessmentsUrl:     "",
    url:                "",
});

OverallAtom.debugLabel = "Overall Data";
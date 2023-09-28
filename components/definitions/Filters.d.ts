
export type strOrNumber = string | number;

export interface response {
  message: string;
  pages: number; 
  properties: Property[];
}

export interface mapResponse {
  message: string;
  properties: Property[];
}

export interface FormVisibleState {
  propertyType: boolean;
  price: boolean;
  city: boolean;
  bedBaths: boolean;
  propertySubType: boolean;
  map: boolean;
  sortBy: boolean;
}

export interface FilterState {
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
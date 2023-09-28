export interface Property {
    id: string;
    StreetName:                  string;
    LivingArea:                  number;
    BedroomsTotal:               number;
    BridgeModificationTimestamp: Date;
    StateOrProvince:             string;
    Media:                       Media[];
    Latitude:                    number;
    BathroomsTotalDecimal:       number;
    City:                        string;
    ListPrice:                   number;
    Longitude:                   number;
    NumberOfUnitsTotal:          number;
    MLSAreaMajor:                string;
    StreetNumber:                string;
    ListingId:                   string;
    ListingKey:                  string;
    distanceFrom:                number;
    FeedTypes:                   any[];
    url:                         string;
  }
  
  interface Media{
    Order:             number;
    MediaKey:          string;
    MediaURL:          string;
    ResourceRecordKey: string;
    ResourceName:      string;
    ClassName:         string;
    MediaCategory:     string;
    MimeType:          string;
    MediaObjectID:     string;
    ShortDescription:  string;
  }
import {atom} from "jotai";
export interface TransactionInt {
    cityTransferTax:                number | null;
    salesPrice:                     number | null;
    intraFamilyTransfer:            string;
    loanRateTypeCode:               string;
    loanTypeCode:                   string;
    transferTaxExempt:              string;
    unpaidBalance:                  string;
    partialInterestTransferPercent: string;
    id:                             string;
    state:                          string;
    countyTransferTax:              number | null;
    loanTermMonths:                 string;
    totalTransferTax:               number | null;
    delinquentAsOfDate:             string;
    origLoanRecordingDate:          string;
    buyerMultiVesting:              string;
    fips:                           string;
    recordingDate:                  Date;
    auctionAddress:                 string;
    origLoanDocumentDate:           string;
    auctionDate:                    string;
    loanDueDate:                    string;
    documentTypeCode:               number;
    signatureDate:                  string;
    initialInterestRate:            number | null;
    origLoanAmount:                 string;
    totalDelinquentAmount:          string;
    occupancyStatus:                string;
    borrowerVesting:                string | string;
    titleCompanyName:               string;
    parcels:                        Parcel[];
    documentDate:                   string;
    documentType:                   string;
    lenderType:                     string | null;
    installmentAmount:              string;
    sellerName:                     string[] | null;
    maxLoanAmount:                  string;
    loanTermYears:                  string;
    loanClosedOrOpenEndedCode:      string;
    recordingPageNumber:            string | null;
    installmentDueDate:             string;
    trusteeSaleNumber:              string;
    buyerVesting:                   number | null;
    recordingBookNumber:            string | null;
    recordType:                     string | null;
    origLoanDocumentNumber:         string;
    startingBid:                    string;
    partialInterestTransfer:        string;
    buyerName:                      string[] | null;
    loanAmountDescription:          string;
    loanAmount:                     number;
    stateTransferTax:               string;
    lenderName:                     string[] | null;
    category:                       string;
    effectiveDate:                  string;
    url:                            string;
}

export interface Parcel {
    zip:          string;
    city:         string;
    coordinates:  number[];
    fips:         string;
    zip4:         string;
    streetPre:    string;
    house:        string;
    parcelID:     number;
    unitType:     string;
    unit:         string;
    street:       string;
    houseExt:     string;
    streetSuffix: string;
    state:        string;
    apn:          string;
    streetPost:   string;
    full:         string;
}  
 

export const TransactionsAtom = atom<TransactionInt[]>([]);

TransactionsAtom.debugLabel = "Transactions Data";
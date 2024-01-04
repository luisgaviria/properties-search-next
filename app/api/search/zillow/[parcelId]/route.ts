import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(
    req: NextRequest,
    {params}: {params: {parcelId: string}}, 
    res: NextResponse
){
    const parcelId : string = params.parcelId;
    if(!parcelId){
        return NextResponse.json({
            message: "No property"
        });
    }  
    
    const overallResponse = await axios.get(`https://api.bridgedataoutput.com/api/v2/pub/parcels/${parcelId}?access_token=${process.env.API_ACCESS_TOKEN}`);
    const transactionsResponse = await axios.get(`https://api.bridgedataoutput.com/api/v2/pub/parcels/${parcelId}/transactions?access_token=${process.env.API_ACCESS_TOKEN}`); 
    const assessmentsResponse = await axios.get(`https://api.bridgedataoutput.com/api/v2/pub/parcels/${parcelId}/assessments?access_token=${process.env.API_ACCESS_TOKEN}`);
    
    return NextResponse.json({
        overall: overallResponse.data.bundle,
        transactions: transactionsResponse.data.bundle, 
        assessments: assessmentsResponse.data.bundle
    });
}
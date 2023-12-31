import Filters from "@/components/Mlspin/Filters/Filters"
import { Metadata } from "next";

export async function generateMetadata({params,searchParams}:{params: any;searchParams: any}): Promise<Metadata> {
    const city = params.city;
     
    const data = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/search/mlspin?City=${city}&page=1&PropertyType=Residential,Residential Income`,{cache: "no-store"}).then(res=>res.json());
    const totalAmountOfProperties = data.pages*12;
    return { 
        title: `There are ${totalAmountOfProperties} for sale in ${city}`
    }
}

export default function ExactCity(){ 
    return (
        <>  
            <Filters/>
        </>
    )
}
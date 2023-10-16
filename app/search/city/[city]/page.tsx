import Filters from "@/components/Filters/Filters"
import { Metadata } from "next";

export async function generateMetadata({params,searchParams}:{params: any;searchParams: any}): Promise<Metadata> {
    const city = params.city;
     
    const data = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/search?City=${city}&page=1`,{cache: "no-store"}).then(res=>res.json());
    console.log(data);
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
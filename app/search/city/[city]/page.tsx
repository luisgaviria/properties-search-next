import Filters from "@/components/Mlspin/Filters/Filters"
// import { response } from "@/components/definitions/Filters";
import { Metadata } from "next";
import { headers } from 'next/headers';
import { usePathname } from "next/navigation";

// export async function generateMetadata({params,searchParams}:{params: any;searchParams: any}): Promise<Metadata> {
//     const city = params.city;
     
//     const data = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/search/mlspin?City=${city}&page=1&PropertyType=Residential,Residential Income`,{cache: "no-store"}).then(res=>res.json());
//     const totalAmountOfProperties = data.pages*12;
//     return { 
//         title: `There are ${totalAmountOfProperties} for sale in ${city}`
//     }
// }

async function getCityListings(city: any){
    let query = "";
    query+=`City=${city}`;
    query+=`&PropertyType=Residential,Residential Income`;
    query+="&save=true";
    const res: any = await fetch(`${process.env.URL_API}/api/search/mlspin?${query}&page=1`,{
        cache: "no-store"
    }).then((res)=>res.json());

    return {properties: res.properties,pages: res.pages};
}  

export default async function ExactCity(){ 
    const headersList = headers();
    const xInvokePath = headersList.get('x-pathname') as string; 
    console.log(xInvokePath);
    // on vercel it is not sending as a header x-invoke-path we need to create middleware to add one more header with request url
    const data = await getCityListings(xInvokePath.split('/city/')[1][0].toUpperCase() + xInvokePath.split('/city/')[1].slice(1)); 
    return (
        <>  
            <Filters cityData={data.properties} cityPages={data.pages}/>
        </>
    )
}
import fs from "fs"
import Head from "next/head";
import Filters from "@/components/Mlspin/Filters/Filters";


async function getCityListing(city: string) {
    let query = "";
    query += `City=${city}`; // ${city} -> previously!
    query += `&PropertyType=Residential,Residential Income`;
    query += "&save=true";
    const res: any = await fetch(
      `https://www.bostonharmonyhomes.com/api/search/mlspin?${query}&page=1`,
      {
        cache: "no-store",
      },
    ).then((res) => res.json());
  
    return { properties: res.properties, pages: res.pages };
  }

export async function generateMetadata({ params }: {params: {city: string}}) {
    const city = params.city; 
    const data = await fetch(`https://www.bostonharmonyhomes.com/api/search/mlspin?City=${city}&page=1&PropertyType=Residential,Residential Income`,{cache: "no-store"}).then(res=>res.json());
    // we should use an exisitng api not the one which is in development because the one in development is not running and it is not working!
    const totalAmountOfProperties = data.pages*12;
  
    return {
        title: `There are ${totalAmountOfProperties} for sale in ${city}`
    }
}

export async function generateStaticParams() {
    const file = fs.readFileSync(process.cwd() + '/data/massachusetsCities.json','utf8');
    const data = JSON.parse(file);

    return data.map((city: any) => ({
        city: city.Name.toLowerCase(),
    }));
}

export default async function CityPage({ params }: {params: {city: string}}) {
    const city = params.city;
    const data = await getCityListing(city);
  
    return (
        <>
        <Head>
          <title>{`There are 12  for sale in Boston`}</title>
        </Head>
        <Filters cityData={data.properties} cityPages={data.pages} />
      </>
    );
  }
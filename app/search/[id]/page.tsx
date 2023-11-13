import { PropertyDetails } from "@/components/definitions/PropertyDetails";
import { formatPrice,checkNumberNine } from "@/utils/formatPrice";
import { Metadata } from "next";
import SinglePropertyBuy from "@/components/SinglePropertySearchBody/SinglePropertySearchBody";
const generateTitle = (state : PropertyDetails) => {
  const livingArea =
    state.LivingArea !== null
      ? state.LivingArea?.toLocaleString()
      : null;

  return `Property Listing: ${state.StreetNumber} ${state.StreetName}, ${
    state.City
  }, ${state.StateOrProvince} - ${formatPrice(state.ListPrice)} - ${
    livingArea !== null ? livingArea + " sqft" : ""
  }`;
};

function truncateStringWithEllipsis(str: string) {
  const maxLength = 157;

  if (typeof str !== "string") {
    throw new Error("Input must be a string.");
  }

  if (!str || str.trim() === "") {
    return "";
  }

  if (str.length <= maxLength) {
    return str;
  }

  return str.substring(0, maxLength - 3) + "...";
}


export async function generateMetadata({params,searchParams}:{params: any;searchParams: any}): Promise<Metadata> {
    const id = params.id;
    console.log(id);

    const data: PropertyDetails = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/search/${id}`,{cache: "no-store"}).then(res=>res.json());
    const imageUrls = data.Media?.map((img : any) => img.MediaURL) || [];
    const filteredImageUrls = imageUrls.filter(
      (url: any) => url && typeof url === "string"
    );


    return {
      title: generateTitle(data),
      description: truncateStringWithEllipsis(data.PublicRemarks as string ?? ""),
      metadataBase: new URL(
        process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
      ),
      alternates: {
        canonical: `/buy/${id}`,
      },
      openGraph: {
        description: truncateStringWithEllipsis(data.PublicRemarks ?? ""),
        images: [{url:filteredImageUrls[0] || "" }],
        url: `/buy/${id}`,
        type: "article"
      },
      twitter: {
        card: "summary_large_image",
        title: generateTitle(data),
        description: truncateStringWithEllipsis(data.PublicRemarks ?? ""),
        images: [{url: filteredImageUrls[0] || ""}]
      }
    }
  } 

export default function PageSinglePropertyBuy(){ 
  return (
    <SinglePropertyBuy/>
  )
};
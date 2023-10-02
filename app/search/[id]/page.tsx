
import { formatPrice,checkNumberNine } from "@/utils/formatPrice";
import { Metadata } from "next";
import { PropertyDetails } from "@/components/definitions/PropertyDetails";

const generateTitle = (state : PropertyDetails) => {
    const livingArea =
      state.LivingArea !== null
        ? state.LivingArea?.toLocaleString("en-us")
        : null;

    return `Property Listing: ${state.StreetNumber} ${state.StreetName}, ${
      state.City
    }, ${state.StateOrProvince} - ${formatPrice(state.ListPrice)} - ${
      livingArea !== null ? livingArea + " sqft" : ""
    }`;
  };
export const generateMetadata =async ({title}: {title: string} )=>{
    return {
        // title: generateTitle(state)
    }
}

export default function SinglePropertyBuy(props){ 

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

    return (
        <>
             <title>{generateTitle(state)}</title>
          <meta
            name="description"
            content={truncateStringWithEllipsis(state.PublicRemarks ?? "")}
          />
          <link rel="canonical" href={`/buy/${params.id}`} />
          <meta property="og:title" content={generateTitle(state)} />
          <meta
            property="og:description"
            content={truncateStringWithEllipsis(state.PublicRemarks ?? "")}
          />
          <meta property="og:image" content={filteredImageUrls[0] || ""} />;
          <meta property="og:url" content={`/buy/${params.id}`} />
          <meta property="og:type" content="product" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={generateTitle(state)} />
          <meta
            name="twitter:description"
            content={truncateStringWithEllipsis(state.PublicRemarks ?? "")}
          />
          <meta name="twitter:image" content={filteredImageUrls[0] || ""} />
          <meta name="twitter:url" content={`/buy/${params.id}`} />
          <script type="application/ld+json">
            {`
      {
        "@context": "https://schema.org",
        "@type": "RealEstateListing",
        "name": "${generateTitle(state)}",
        "description": "${truncateStringWithEllipsis(
          state.PublicRemarks ?? ""
        )}",
        "image": "${filteredImageUrls[0] || ""}",
        "url": "/buy/${params.id}",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "${state.StreetNumber} ${state.StreetName}",
          "addressLocality": "${state.City}",
          "addressRegion": "${state.StateOrProvince}",
          "postalCode": "",
          "addressCountry": "USA"
        },
        "price": "${formatPrice(state.ListPrice)}",
        "numberOfBedrooms": "${state.BedroomsTotal}",
        "numberOfBathrooms": "${state.BathroomsTotalDecimal}",
        "floorSize": {
          "@type": "QuantitativeValue",
          "value": ${
            state.LivingArea !== undefined && state.LivingArea !== ""
              ? `"${state.LivingArea?.toLocaleString("en-us")}"`
              : null
          },
          "unitCode": "SQFT"
        }
      }
    `}
          </script>
        </>
        // <h1>HELLO</h1>
    )
};
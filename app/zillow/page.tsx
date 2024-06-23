import { Suspense } from "react";
import Loading from "../loading";
import Filters from "@/components/Zillow/Filters/Filters";
export default function Zillow() {
  return (
    <>
      <Suspense fallback={<Loading />}>
        <Filters />
      </Suspense>
    </>
  );
}

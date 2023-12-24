import Filters from "@/components/Mlspin/Filters/Filters";
import { Suspense } from "react";
import Loading from "../loading";

export default function Search() {
  return (
    <>
      <Suspense fallback={<Loading />}>
        <Filters />
      </Suspense>
    </>
  );
}

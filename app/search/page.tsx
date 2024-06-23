import Filters from "@/components/Mlspin/Filters/Filters";
import { Suspense } from "react";
import Loading from "../loading";

export default function Search() {
  return (
    <>
      {/* <Suspense fallback={<Loading />}> */}
      <Filters cityData={null} cityPages={0} />{" "}
      {
        // doesnt matter what is params here it won't use it in that case
      }
      {/* </Suspense> */}
    </>
  );
}

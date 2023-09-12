"use client";
import { Spinner } from "./client-react-boostrap";

export default function Loading() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "55vh",
      }}
    >
      <Spinner style={{ margin: "0 auto" }} animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </div>
  );
}

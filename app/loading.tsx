"use client";
import Spinner from "@/node_modules/react-bootstrap/esm/Spinner";

export default function Loading() {
  return (
    <Spinner animation="border" role="status">
      <span className="visually-hidden">Loading...</span>
    </Spinner>
  );
}

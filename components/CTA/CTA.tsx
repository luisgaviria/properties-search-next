"use client";

import { useState } from "react";

import Container from "@/node_modules/react-bootstrap/esm/Container";

import "./CTA.scss";

const CTA = () => {
  const [isHovered, setIsHovered] = useState(false);
  // let buttonTextOne = "";
  // let buttonTextTwo = "";

  // switch (pageName) {
  //   case "home":
  //     buttonTextOne = "SEARCH LISTINGS";
  //     buttonTextTwo = "LIST YOUR HOUSE";
  //     break;
  //   case "singlePage":
  //     buttonTextOne = "TALK TO AN AGENT";
  //     buttonTextTwo = "SET UP A VIEWING";
  //     break;
  //   default:
  //     buttonTextOne = "SEARCH NOW";
  // }

  const handleButtonHover = () => {
    setIsHovered(true);
  };

  const handleButtonLeave = () => {
    setIsHovered(false);
  };

  return (
    <Container>
      <div className={`cta-component ${isHovered ? "hovered" : ""}`}>
        <div className="content-wrapper">
          <h2>Your Perfect Home Awaits</h2>
          <span className="cta-span">
            Find Your Dream Home, Build Your Portfolio, and Trust Us to List
            Your House.
          </span>
          <div className="row-wrapper">
            <div
              className="btn-cta"
              onMouseEnter={handleButtonHover}
              onMouseLeave={handleButtonLeave}
            >
              <span>SEACH LISTINGS</span>
            </div>
            <div
              className="btn-cta-second"
              onMouseEnter={handleButtonHover}
              onMouseLeave={handleButtonLeave}
            >
              <span>LIST YOUR HOUSE</span>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default CTA;

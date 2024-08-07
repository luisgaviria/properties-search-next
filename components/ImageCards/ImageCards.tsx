//@ts-nocheck
"use client";
import styles from "./ImageCards.module.scss";
import { Container } from "@/app/client-react-boostrap";
import Image from "@/node_modules/next/image";
import Link from "@/node_modules/next/link";
import { Popup } from "reactjs-popup";
import PopupFormListYourHomes from "../PopupFormListYourHomes/PopupFormListYourHomes";
import PopupFormApplyToday from "../PopupFormApplyToday/PopupFormApplyToday";

const ImageCards = () => {
  return (
    <Container>
      <div className={styles["flex-container"]}>
        <div className={styles["card-home-one"]}>
          <Image
            className={styles["card-image"]}
            width={500}
            height={300}
            src="/house29.webp"
            alt="house icon"
          />
          <div className={styles["card-info-wrapper"]}>
            <div className={styles["title-wrapper-cards"]}>
              <h2>Search Massachusetts Homes!</h2>
            </div>
            <div className={styles["card-description"]}>
              <p>Browse MLS Home Listings</p>
            </div>
            {/* <span class="hover-text">
          Random new text added when hovering on card
        </span> */}
            <div className={styles["apply-btn"]}>
              <Link href={"/search"}>
                <div
                  className={styles["btn-cards"]}
                  // onClick={() => {
                  //   // return navigate("/buy");
                  // }}
                >
                  <span>SEARCH MLS</span>
                </div>
              </Link>
            </div>
          </div>
        </div>
        {}
        <Popup
          position="right center"
          modal
          trigger={(open) => (
            <div className={styles["card-home-two"]}>
              <Image
                className={styles["card-image"]}
                width={500}
                height={300}
                src="/house28-v1.webp"
                alt="house icon"
              />
              <div className={styles["card-info-wrapper"]}>
                <div className={styles["title-wrapper-cards"]}>
                  <h2>List Your Home!</h2>
                </div>
                <div className={styles["card-description"]}>
                  <p>Effortless Home Selling Experience</p>
                </div>
                <div className={styles["apply-btn"]}>
                  <div className={styles["btn-cards"]}>
                    <span>LIST YOUR HOME</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        >
          {(close: any) => (
            <>
              <span style={{ cursor: "pointer" }} onClick={close}>
                &times;
              </span>
              <PopupFormListYourHomes />
            </>
          )}
        </Popup>

        {}
        <Popup
          position="right center"
          modal
          trigger={(open) => (
            <div className={styles["card-home-three"]}>
              <Image
                className={styles["card-image"]}
                width={500}
                height={300}
                src="/house32.webp"
                alt="house icon"
              />
              <div className={styles["card-info-wrapper"]}>
                <div className={styles["title-wrapper-cards"]}>
                  <h2>We're Hiring!</h2>
                </div>
                <div className={styles["card-description"]}>
                  <p>Unlock Your Real Estate Potential</p>
                </div>
                <div className={styles["apply-btn"]}>
                  <div className={styles["btn-cards"]}>
                    <span>APPLY TODAY</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        >
          {(close: any) => (
            <>
              <span style={{ cursor: "pointer" }} onClick={close}>
                &times;
              </span>
              <PopupFormApplyToday />
            </>
          )}
        </Popup>
      </div>
    </Container>
  );
};

export default ImageCards;

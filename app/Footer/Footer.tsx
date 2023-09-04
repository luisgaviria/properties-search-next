'use client'
import styles from "./Footer.module.scss";
import React, { useState, useEffect } from "react";

const Footer = () => {
  const [showFooter, setShowFooter] = useState(false);
  useEffect(() => {
    const handleLoad = () => {
      setShowFooter(true);
    };

    window.addEventListener("load", handleLoad);

    return () => {
      window.removeEventListener("load", handleLoad);
    };
  }, []);
  return (
    <footer id="colophon" className={styles["container site-footer"]}>
      <div className={styles["top"]} />
      <hr />
      <div className={styles["left-right"]}>
        <div className={styles["left text-footer-links"]}>
          <div id="block-7" className={styles["menu widget_block"]}>
            <div className={styles["menu-title"]}>Social</div>

            <ul>
              <li>
                <a href="#" target="_blank" rel="noreferrer noopener">
                  Instagram
                </a>
              </li>
              <li>
                <a href="#" target="_blank" rel="noreferrer noopener">
                  Twitter
                </a>
              </li>
              <li>
                <a href="#" target="_blank" rel="noreferrer noopener">
                  LinkedIn
                </a>
              </li>
              <li>
                <a href="#" target="_blank" rel="noreferrer noopener">
                  Facebook
                </a>
              </li>
            </ul>
          </div>
          <div id="block-8" className={styles["menu widget_block"]}>
            <div className={styles["menu-title"]}>Info</div>
            <div className={styles["wp-widget-group__inner-blocks"]}>
              <ul>
                <li>
                  <a href="#">About</a>
                </li>
                <li>
                  <a href="#" data-type="URL" data-id="/about/">
                    Resources
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className={styles["right text-footer-links"]}>
          <div id="block-9" className={styles["menu widget_block"]}>
            <div className={styles["menu-title-phone"]}>Phone Number</div>
            <div className={styles["wp-widget-group__inner-blocks"]}>
              <a href="tel:+1(978)-319-8751" className={styles["text-footer-links"]}>
                305-462-4463
              </a>
              <br />
              <a
                href="mailto: HarwoodHouses@gmail.com"
                style={{ color: "#151515" }}
              >
                Email
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
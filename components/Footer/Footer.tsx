"use client";
import styles from "./Footer.module.scss";
import React, { useState, useEffect } from "react";
import Container from "@/node_modules/react-bootstrap/esm/Container";

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
    <Container>
      <footer id="colophon" className={styles["container site-footer"]}>
        <div className={styles["top"]} />
        <hr />
        <div className={styles["left-right"]}>
          <div className={`${styles["left"]} ${styles["text-footer-links"]}`}>
            <div id="block-7" className={styles["menu widget_block"]}>
              <div className={styles["menu-title"]}>Social</div>
              <ul>
                <li>
                  <a href="#" className="text-gray-900 dark:text-white" target="_blank" rel="noreferrer noopener">
                    Instagram
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-900 dark:text-white" target="_blank" rel="noreferrer noopener">
                    Twitter
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-900 dark:text-white" target="_blank" rel="noreferrer noopener">
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-900 dark:text-white" target="_blank" rel="noreferrer noopener">
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
                    <a href="#" className="text-gray-900 dark:text-white">About</a>
                  </li>
                  <li>
                    <a className="text-gray-900 dark:text-white" href="#" data-type="URL" data-id="/about/">
                      Resources
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className={`${styles["right"]} ${styles["text-footer-links"]}`}>
            <div
              id="block-9"
              className={`${styles["menu"]} ${styles["widget_block"]}`}
            >
              <div className={styles["menu-title-phone"]}>Contact</div>
              <div className={styles["wp-widget-group__inner-blocks"]}>
                <a
                  href="tel:+1(508)-762-7639"
                  className={styles["text-footer-links"]}
                >
                  508-762-7639
                </a>
                <br />
                <a
                  href="mailto: luis.aptx@gmail.com"
                >
                  Email
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </Container>
  );
};

export default Footer;

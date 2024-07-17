"use client";
import styles from "./PopupFormListYourHomes.module.scss";
import axios from "axios";
import { useState } from "react";

const PopupFormListYourHomes = () => {
  const [listYourHomeState, setListYourHomeState] = useState({
    firstName: "",
    lastName: "",
    telephoneNumber: "",
    email: "",
    message: "",
  });
  const handleInput = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    setListYourHomeState((prevState) => {
      return {
        ...prevState,
        [event.target.name]: event.target.value,
      };
    });
  };
  const onFormSubmit = async (name: string) => {
    switch (name) {
      case "List Your Home State": {
        await axios.post(
          "/api/message",
          { ...listYourHomeState },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        break;
      }
      case "Apply Today": {
        break;
      }
    }
  };

  const onClickX = () => {};

  return (
    <>
      <div className={styles.rowWrapper}>
        <div className={styles.columnLeft}>
          <h1 className={styles.columnLeftH1}>
            Get Started with Your Home Listing
          </h1>
          <p className={styles.mktP}>
            Fill out the details below to list your home and reach potential
            buyers quickly and easily.
          </p>
          <div className={styles.theForm}>
            <div className={styles.formWrapper}>
              <div className={styles.titleWrap}>
                <span className={styles.titleWrapSpan}></span>
              </div>
              <form
                className={styles.mktForm}
                onSubmit={(event) => {
                  event.preventDefault();
                  onFormSubmit("List Your Home State");
                }}
              >
                <div className={styles.mktFormRow}>
                  <div className={styles.mktFormCol}>
                    <div className={styles.mktFieldWrap}>
                      <input
                        name="firstName"
                        onChange={handleInput}
                        value={listYourHomeState.firstName}
                        id="FirstName"
                        placeholder="First Name"
                        className={styles.mktInputText}
                        // style={{ width: "166px" }}
                      />
                    </div>
                  </div>
                  <div className={styles.mktFormCol}>
                    <div className={styles.mktFieldWrap}>
                      <input
                        name="lastName"
                        onChange={handleInput}
                        value={listYourHomeState.lastName}
                        id="LastName"
                        placeholder="Last Name"
                        className={styles.mktInputText}
                        // style={{ width: "166px" }}
                      />
                    </div>
                  </div>
                </div>
                <div className={styles.mktFormRow}>
                  <div className={styles.mktFormCol}>
                    <div className={styles.mktFieldWrap}>
                      <input
                        name="telephoneNumber"
                        type="number"
                        onChange={handleInput}
                        value={listYourHomeState.telephoneNumber}
                        id="TelephoneNumber"
                        placeholder="Telephone Number"
                        className={styles.mktInputText}
                        // style={{ width: "166px" }}
                      />
                    </div>
                  </div>
                  <div className={styles.mktFormCol}>
                    <div className={styles.mktFieldWrap}>
                      <input
                        name="email"
                        id="Email"
                        value={listYourHomeState.email}
                        onChange={handleInput}
                        placeholder="Email"
                        className={styles.mktInputText}
                        // style={{ width: "166px" }}
                      />
                    </div>
                  </div>
                </div>
                <div className={styles.mktFormRowSingle}>
                  <div className={styles.mktFormCol}>
                    <div className={styles.mktFieldWrap}>
                      <textarea
                        name="message"
                        onChange={handleInput}
                        id="Message"
                        placeholder="Message"
                        className={styles.mktInputTextArea}
                        // style={{ width: "286px" }}
                      />
                    </div>
                  </div>
                </div>
                <div className={styles.mktButtonRow}>
                  <span className={styles.mktButtonSpan}>
                    <button type="submit" className={styles.mktButton}>
                      Submit
                    </button>
                  </span>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PopupFormListYourHomes;

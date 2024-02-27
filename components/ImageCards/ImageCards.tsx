"use client"
import styles from "./ImageCards.module.scss";
import { Container } from "@/app/client-react-boostrap";
import Image from "@/node_modules/next/image";
import Link from "@/node_modules/next/link";
import {Popup} from "reactjs-popup";
import stylesPopup from "./Popup.module.scss"; 
import { useState } from "react";
import axios from "axios";

const ImageCards = () => {
  const [listYourHomeState,setListYourHomeState] = useState({
    firstName: "",
    lastName: "",
    telephoneNumber: "",
    email: "",
    message: ""
  });
   
  const handleInput = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void=>{  
    setListYourHomeState(prevState=>{ 
      return {
        ...prevState,
        [event.target.name]: event.target.value
      }
    });
  };

  const onFormSubmit = async (name: string)=>{  
    switch(name) { 
      case "List Your Home State": {
        await axios.post("/api/message",{...listYourHomeState},{ 
          headers: {
            "Content-Type": "application/json"
          }
        });
        break;
      }
      case "Apply Today":{
        break;
      }
    }
  }; 
  
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
              <p>Browse MLS home listings now.</p>
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
                  <span>ADVANCED SEARCH</span>
                </div>
              </Link>
            </div>
          </div>
        </div>
        {
          
        }
        <Popup   
          position="right center"
          modal
          trigger={open=>
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
        }>
            <div className={stylesPopup.rowWrapper}>
                <div className={stylesPopup.columnLeft}>
                    <h1 className={stylesPopup.columnLeftH1}>Are You interested in more information?</h1>
                    <p className={stylesPopup.mktP}>Hello</p>
                    <div className={stylesPopup.theForm}>
                        <div className={stylesPopup.formWrapper}>
                            <div className={stylesPopup.titleWrap}>
                                <span className={stylesPopup.titleWrapSpan}></span>
                            </div>
                            <form className={stylesPopup.mktForm} onSubmit={(event)=>{
                              event.preventDefault();
                              onFormSubmit("List Your Home State");
                              }}>
                                <div className={stylesPopup.mktFormRow}>
                                    <div className={stylesPopup.mktFormCol}>
                                        <div className={stylesPopup.mktFieldWrap}>
                                            <input name="firstName" onChange={handleInput} value={listYourHomeState.firstName} id="FirstName" placeholder="First Name" className={stylesPopup.mktInputText} style={{width: '166px'}}/>
                                       </div>
                                    </div>
                                    <div className={stylesPopup.mktFormCol}>
                                            <div className={stylesPopup.mktFieldWrap}>
                                                <input name="lastName" onChange={handleInput} value={listYourHomeState.lastName} id="LastName" placeholder="Last Name" className={stylesPopup.mktInputText}  style={{width: '166px'}}/>
                                            </div>
                                    </div>
                                </div>
                                <div className={stylesPopup.mktFormRow}>
                                    <div className={stylesPopup.mktFormCol}>
                                            <div className={stylesPopup.mktFieldWrap}>
                                                <input name="telephoneNumber" type="number" onChange={handleInput} value={listYourHomeState.telephoneNumber} id="TelephoneNumber" placeholder="Telephone Number" className={stylesPopup.mktInputText} style={{width: '166px'}}/>
                                            </div>
                                    </div>
                                    <div className={stylesPopup.mktFormCol}>
                                            <div className={stylesPopup.mktFieldWrap}>
                                                <input name="email" id="Email" value={listYourHomeState.email}  onChange={handleInput}  placeholder="Email" className={stylesPopup.mktInputText}  style={{width: '166px'}}/>
                                            </div> 
                                    </div>
                                </div>
                                <div className={stylesPopup.mktFormRowSingle}>
                                    <div className={stylesPopup.mktFormCol}>
                                        <div className={stylesPopup.mktFieldWrap}>
                                            <textarea name="message" onChange={handleInput}  id="Message" placeholder="Message" className={stylesPopup.mktInputTextArea}   style={{width: "286px"}}/>
                                        </div>
                                    </div>
                                </div>
                                <div className={stylesPopup.mktButtonRow}>
                                    <span className={stylesPopup.mktButtonSpan}>
                                        <button type="submit" className={stylesPopup.mktButton}>
                                            Submit
                                        </button>
                                    </span>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

        </Popup>
       
        {

        }
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
      </div>
    </Container>
  );
};

export default ImageCards;

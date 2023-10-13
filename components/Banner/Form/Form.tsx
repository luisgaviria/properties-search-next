"use client";

// import { useState } from "react";
import { atom, useAtom } from "jotai";
import { useHydrateAtoms } from "jotai/utils";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";

import Image from "@/node_modules/next/image";
import styles from "./Form.module.scss";

import magGlass from "../../../public/mag-glass.png";
import { useRouter } from "next/navigation";

import { Container } from "@/app/client-react-boostrap";
import Script from "next/script";

// Define Jotai atoms for state
const activeButtonsAtom = atom<string[]>([]);
const stateAtom = atom<{ selectOption: string; input: string }>({
  selectOption: "0",
  input: "",
});

export default function Form() {
  const router = useRouter();
  //State
  // const [activeButtons, setActiveButtons] = useState<string[]>([]);

  const [activeButtons, setActiveButtons] = useAtom(activeButtonsAtom);
  const [state, setState] = useAtom(stateAtom);

  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      /* Define search scope here */
    },
    debounce: 300,
  });

  const onInputAddressChange = (e: any) => {
    // Update the autocomplete input value
    setValue(e.target.value);
  };

  //   const navigate = useNavigate();
  //State
  // const [state, setState] = useState({
  //   selectOption: 0,
  //   input: "",
  // });

  const onSelectSuggestion = (suggestion: any) => () => {
    // When user selects a suggestion, update the input value and clear suggestions
    setValue(suggestion.description, false);
    // changeInput(suggestion.description); localstorage
    clearSuggestions();

    // Get latitude and longitude via utility functions
    getGeocode({ address: suggestion.description }).then((results) => {
      const { lat, lng } = getLatLng(results[0]);
      // Update your state with lat and lng
    });
  };

  const onSelectClick = (option: string) => {
    console.log("BTN OPTION", option);
    let updatedActiveButtons = [...activeButtons]; // Create a copy of activeButtons

    // Check if the clicked option is already active
    if (updatedActiveButtons.includes(option)) {
      // If active, remove it from the updatedActiveButtons array
      updatedActiveButtons = updatedActiveButtons.filter(
        (name) => name !== option
      );
    } else {
      // If not active, add it to the updatedActiveButtons array
      updatedActiveButtons.push(option);
    }

    let selectedOption = "";

    // Determine the selected option based on the updatedActiveButtons array
    if (updatedActiveButtons.length === 0) {
      selectedOption = "none"; // Neither button is selected
    } else if (updatedActiveButtons.length === 1) {
      selectedOption = updatedActiveButtons[0]; // One button is selected
    } else {
      selectedOption = "both"; // Both buttons are selected
    }

    // console.log(selectedOption);

    setActiveButtons(updatedActiveButtons);
    setState((prevState: any) => ({
      ...prevState,
      selectOption: selectedOption,
    }));
  };

  const submitInput = async()=>{ 
    let BuyOrRent = "";
    if(state.selectOption == "Buy"){
      BuyOrRent = "Residential,Residential Income";
    }
    else if(state.selectOption == "Rent"){
      BuyOrRent = "Residential Lease";
    }
    let query = `page=1&near=${value}`;
    if (BuyOrRent) {
      query += `&PropertyType=${BuyOrRent}`;
    }

    router.push(`/search?${query}`);
  };

  const renderAutocompleteSuggestions = () =>
    data.map((suggestion) => (
      <p
        key={suggestion.place_id}
        style={{ border: "1px solid black" }}
        onClick={onSelectSuggestion(suggestion)}
      >
        <strong>{suggestion.structured_formatting.main_text}</strong>{" "}
        <small>{suggestion.structured_formatting.secondary_text}</small>
      </p>
    ));

  return (
    <>
      <Container>
        <div className={styles["the-form"]}>
          {/* <div className="form-title">
      <h4>Quick Search</h4>
    </div> */}

          <div className={styles["btn-wrapper-search"]}>
            <div
              onClick={() => {
                onSelectClick("Buy");
              }}
              className={
                styles[
                  `btn-search-banner ${
                    activeButtons.includes("Buy") ? "active" : ""
                  }`
                ]
              }
            >
              <span>BUY</span>
            </div>
            <div
              onClick={() => {
                onSelectClick("Rent");
              }}
              className={
                styles[
                  `btn-search-banner ${
                    activeButtons.includes("Rent") ? "active" : ""
                  }`
                ]
              }
            >
              <span>RENT</span>
            </div>
          </div>

          <div className={styles["form-wrapper"]}>
            <div className={styles["mktFormCol"]}>
              <div className={styles["mktFieldWrap"]}>
                <input
                  autoComplete="off"
                  name="Location"
                  id="Location"
                  placeholder="Enter a city, an address, a neighborhood or a ZIP code"
                  className={styles["mktInputText"]}
                  onChange={onInputAddressChange}
                  value={value} // Use the autocomplete value
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      submitInput(); // Call the submitInput function when Enter key is pressed
                    }
                  }}
                />
                <Image
                  className={styles["icon-mag"]}
                  src={magGlass}
                  onClick={submitInput}
                  alt="magnifying glass icon"
                />
                {status === "OK" && (
          <div className={styles["autocomplete-suggestions"]}>
            {renderAutocompleteSuggestions()}
          </div>
        )}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}

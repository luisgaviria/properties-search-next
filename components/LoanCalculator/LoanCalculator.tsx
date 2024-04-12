"use client"
import { atom, useAtom } from "jotai";
import { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import {Loan} from "loanjs";
import { formatPrice } from "@/utils/formatPrice";
import styles from "./LoanCalculator.module.scss";
import { useAtomValue } from "jotai";
import { StateAtom } from "../SinglePropertySearchBody/SinglePropertySearchBody";

interface loanState {
    amount: number; 
    rate: number; 
    termYears: number; 
    isCalculatorVisible: boolean;
}

// const stateAtom = atom<loanState>({
//     amount: 0,
//     rate: 7.2,
//     termYears: 30,
//     result: 0,
//     isCalculatorVisible: true
// });

interface loanProps {
    initialAmount: number;
    associationFee: number;
    yearlyTaxes: number;
}

export const LoanCalculator = ( ) =>{
    const initData = useAtomValue(StateAtom);
    // initData.yearl
    // initData.yearlyTaxes = yearlyTaxes / 12;
    const [state,setState] = useState<loanState>({
      amount: 0,
      rate: 7.2,
      termYears: 30,
      isCalculatorVisible: true
    });

    const onChange = (event:React.ChangeEvent<HTMLInputElement> )=>{ 
        const {name,value} = event.target;
         
        if (name === "amount") { 
            setState(prevState=>{
                return {
                    ...prevState,
                    amount: parseFloat(value),
                    isCalculatorVisible: true
                }
            });
        } else if (name === "rate") {
            setState(prevState=>{
                return {
                    ...prevState,
                    rate: parseFloat(value),
                    isCalculatorVisible: true
                }
            });
        } else if (name === "termYears") {
            setState(prevState=>{
                return {
                    ...prevState,
                    termYears: parseFloat(value),
                    isCalculatorVisible: true
                }
            });
        }
    };

    const calculateLoan = () :  {result: number;amount:number}=>{
      if (state.amount && state.termYears && state.rate) {
        try {
          
            const loan = Loan(initData.ListPrice,(state.termYears*12),state.rate,'annuity');
            return {
                  result: loan.sum/(state.termYears*12),
                  amount: state.amount
            }
        } catch (err) {
          return {
            result: 0,
            amount: 0
          }
        }
      }
      else {
        return {
          result: 0, 
          amount: 0 
        }
      }
    };

    useEffect(()=>{
      if(!state.amount){
        setState(prevState=>{
          return {
            ...prevState,
            amount: initData.ListPrice
          }
        });
      }
      else{
      setState(prevState=>{
        return {
          ...prevState,
          ...calculateLoan()
        }
      });
      calculateLoan();
      }
    },[state.amount,state.rate,state.termYears]);


    const toggleCalculatorVisibility = ()=>{ 
        setState(prevState=>{
            return {
                ...prevState,
                isCalculatorVisible: !prevState.isCalculatorVisible
            }
        });
    };
    return (
        <div className={styles["loan-calculator-container"]}>
          <div className={styles["calculator-header"]} onClick={toggleCalculatorVisibility}>
            {state.isCalculatorVisible ? (
              <>
                <div className={styles["property-detail-table-title"]}>
                  <span>Mortgage Calculator</span>
                </div>
                <div className={styles["arrow-wrapper"]}>
                  <img src="/arrow-up.svg" alt="Up Arrow" />
                </div>
              </>
            ) : (
              <>
                <div className={styles["property-detail-table-title"]}>
                  <span>View Mortgage Calculator</span>
                </div>
                <img className={styles["arrow-wrapper"]} src="/arrow-down.svg" alt="Down Arrow" />
              </>
            )}
          </div>
          {state.isCalculatorVisible && (
            <Form>
              <table className={styles["calculator-table"]}>
                <tbody>
                  <tr>
                    <th>Loan Amount:</th>
                    <td>
                      <Form.Control
                        type="number"
                        step="1000"
                        min="0"
                        value={initData.ListPrice}
                        onChange={onChange}
                        name="amount"
                      />
                    </td>
                    <td>{formatPrice(initData.ListPrice)}</td>
                  </tr>
                  <tr>
                    <th>Interest Rate:</th>
                    <td>
                      <Form.Control
                        type="number"
                        step="0.01"
                        min="0"
                        max="20"
                        value={state.rate}
                        onChange={onChange}
                        name="rate"
                      />
                    </td>
                    <td>{state.rate.toLocaleString("en-us")}%</td>
                  </tr>
                  <tr>
                    <th>Loan Term:</th>
                    <td>
                      <Form.Control
                        type="number"
                        step="1"
                        min="0"
                        max="30"
                        value={state.termYears}
                        onChange={onChange}
                        name="termYears"
                      />
                    </td>
                    <td>{state.termYears} Years</td>
                  </tr>
                  <tr>
                    <th>Mortgage Payment:</th>
                    <td>{formatPrice(calculateLoan().result)}</td>
                    <td></td>
                  </tr>
                  {initData.AssociationFee && (
                    <tr>
                      <th>HOA:</th>
                      <td>{formatPrice(initData.AssociationFee)}</td>
                      <td></td>
                    </tr>
                  )}
    
                  <tr>
                    <th>Taxes by month:</th>
                    <td>{formatPrice(initData.TaxAnnualAmount/12)}</td>
                    <td>{initData.TaxAnnualAmount/12 == 0 ? "Unkown" : null}</td>
                  </tr>
                  <tr>
                    <th>Total Monthly Payment:</th>
                    <td>
                      {`${formatPrice((calculateLoan().result as number + initData.AssociationFee + initData.TaxAnnualAmount/12))} `}
                    </td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
    
              {/* <Form.Group style={{ display: "flex", alignItems: "center" }}>
                <Form.Label>Mortgage Payment {formatPrice(result)}</Form.Label>
              </Form.Group> */}
              {/* {associationFee && (
                <Form.Group style={{ display: "flex", alignItems: "center" }}>
                  <Form.Label>HOA: {formatPrice(associationFee)}</Form.Label>
                </Form.Group>
              )} */}
              {/* <Form.Group style={{ display: "flex", alignItems: "center" }}>
                <Form.Label>Taxes by month: {formatPrice(yearlyTaxes)}</Form.Label>
              </Form.Group> */}
              {/* <Form.Group style={{ display: "flex", alignItems: "center" }}>
                <Form.Label style={{ marginRight: "10px" }}>
                  Total Monthly Payment:{" "}
                  {`${formatPrice(result + associationFee + yearlyTaxes)} `}
                </Form.Label>
              </Form.Group> */}
            </Form>
          )}
        </div>
      );
};
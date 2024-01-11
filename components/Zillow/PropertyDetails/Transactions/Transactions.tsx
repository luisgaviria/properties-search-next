import { TransactionInt,Parcel } from "../atoms/TransactionsAtom";
import Table from "react-bootstrap/Table";

export default function Transactions({transactions}:{transactions: TransactionInt[]}){
    const returnTable= (transaction: TransactionInt, index:number)=>{
        const keys = Object.keys(transaction);
        const trs = [];
        trs.push(
            <tr>
                <td>Transaction number: {index+1}</td>
            </tr>
        );
        for(const key of keys){
            if(typeof transaction[key as keyof TransactionInt] === 'object'){
                switch(key){ 
                    case 'parcels':{
                        transaction.parcels.forEach((parcel)=>{
                            Object.keys(parcel).forEach((key: string)=> {
                                if(!parcel[key as keyof Parcel]){
                                    delete parcel[key as keyof Parcel];
                                }
                            });
                        });
                        trs.push(
                            <tr>
                                <td>parcels</td>
                                <td>{transaction.parcels.map(parcel=>{
                                    return (
                                        <>{JSON.stringify(parcel).replaceAll('{',"").replaceAll('}',"").replaceAll('"',"").replaceAll(","," ")}</>
                                    )
                                })}</td>
                            </tr>
                        )
                        break; 
                    }
                    case 'lenderName':{
                        trs.push(
                            <tr>
                                <td>lender names</td>
                                <td>
                                    {transaction.lenderName?.map(lenderName=>{
                                        return lenderName+",";
                                    })}
                                </td>
                            </tr>
                        )
                        break;
                    }
                }
            }
            else{
                if(transaction[key as keyof TransactionInt]?.toString().length){
                    trs.push(
                        <tr>
                            <td>{key.toString()}</td>
                            <td>{transaction[key as keyof TransactionInt]?.toString()}</td>
                        </tr>
                    )
                }
            }
        }
        return trs;
    };

    return (
        <div>
            <h1>Transactions data</h1>
            <Table>
                <tbody>
                    {transactions.map((transaction,index)=>{
                        return returnTable(transaction,index);
                    })}
                </tbody>
            </Table>  
        </div>
    )
};
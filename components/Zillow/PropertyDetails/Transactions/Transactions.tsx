import { TransactionInt,Parcel } from "../atoms/TransactionsAtom";
import Table from "react-bootstrap/Table";
import { useTheme } from "next-themes";

export default function Transactions({transactions}:{transactions: TransactionInt[]}){
    const {theme} = useTheme();
    const returnTable= (transaction: TransactionInt)=>{
        const keys = Object.keys(transaction);
        const trs = [];
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
                        for(let i=0; i<transaction.parcels.length; i++){
                            const parcel = transaction.parcels[i];
                            const keys = Object.keys(parcel);
                            trs.push(
                                <tr>
                                    <td>
                                        parcel {i+1}
                                    </td>
                                    {keys.map(key=>{
                                        return (
                                            <td>{key}: {parcel[key as keyof Parcel]}</td>
                                        );
                                    })}
                                </tr>
                            );
                        }
                        break; 
                    }
                    case 'lenderName':{
                        if(transaction.lenderName?.length == 1  || !transaction.lenderName?.length){
                            trs.push(
                                <tr>
                                    <td>lender names</td>
                                    {transaction.lenderName?.map(lenderNameSingle=>{
                                        return (<td colSpan={100}>{lenderNameSingle}</td>);
                                    })}
                                </tr>
                            );
                        }
                        else {
                            trs.push(
                                <tr>
                                    <td>lender names</td>
                                    {transaction.lenderName?.map(lenderNameSingle=>{
                                        return (<td>{lenderNameSingle}</td>);
                                    })}
                                </tr>
                            );
                        }
                        break;
                    }
                }
            }
            else{
                if(transaction[key as keyof TransactionInt]?.toString().length){
                    trs.push(
                        <tr>
                            <td>{key.toString()}</td>
                            <td colSpan={100}>{transaction[key as keyof TransactionInt]?.toString()}</td>
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
            {transactions.map((transaction,index)=>{
                return (
                    <>
                        <h2>Transaction Number: {index+1}</h2>
                        <Table striped bordered hover responsive="sm" variant={theme}>
                            <tbody>
                                {returnTable(transaction)}
                            </tbody>
                        </Table>
                    </>
                ); 
            })}
  
        </div>
    )
};
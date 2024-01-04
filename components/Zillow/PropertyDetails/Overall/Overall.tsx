import { OverallInt } from "../atoms/OverallAtom";
import Table from "react-bootstrap/Table";
export default function Overall({overall}:{overall: OverallInt}){
    
    const returnTable = ()=>{
        const keys = Object.keys(overall);
        const trs = []; 
        for(const key of keys){
            trs.push(
                <tr>
                    <td>{key.toString()}</td>
                    <td>{overall[key as keyof OverallInt]?.toString()}</td>
                </tr>
            );
        } 
        return trs.map((tr: any)=>{return tr;});
    };

    return(
        <div>
            <Table bordered hover responsive>
                <tbody>
                    {returnTable()}
                </tbody>
            </Table>
            {/* <h1>Full: {overall.address.full}</h1> 
            <h2></h2> */}
        </div>
    )

};
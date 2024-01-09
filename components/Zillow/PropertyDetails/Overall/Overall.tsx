import { OverallInt, Legal, Area, Building,Garage } from "../atoms/OverallAtom";
import Table from "react-bootstrap/Table";
export default function Overall({overall}:{overall: OverallInt}){
    
    const returnTable = ()=>{
        const keys = Object.keys(overall);
        const trs = []; 
        for(const key of keys){ 
            if(typeof overall[key as keyof OverallInt] === 'object'){
                switch(key){
                    case 'address': {
                        trs.push(
                        <tr>
                            <td>{key.toString()}</td>
                            <td>{overall.address.full}</td>
                        </tr>);
                        break;
                    }
                    case 'legal': {
                        Object.keys(overall.legal).forEach((key: string)=> { 
                            if(!overall.legal[key as keyof Legal]){
                                delete overall.legal[key as keyof Legal];
                            }
                        }); 
                        trs.push(
                            <tr>
                                <td>{key.toString()}</td>
                                <td>{JSON.stringify(overall.legal).replaceAll('{',"").replaceAll("}","").replaceAll('"',"").replaceAll(","," ")}</td>
                            </tr>
                        );
                        console.log(overall.legal);
                        break;
                    }
                    case 'pools': { 
                        trs.push(
                            <tr>
                                <td>{key.toString()}</td>
                                <td>{JSON.stringify(overall.pools)}</td>
                            </tr>
                        );
                        break;
                    }
                    case 'areas':{  
                        trs.push(
                            <tr>
                                <td>areas</td>
                                <td>
                                {overall.areas.map((area: Area)=>{ 
                                    return (
                                    <> Area Square Feet: {area.areaSquareFeet} Type: {area.type} |</>
                                    );
                                })}
                                </td>
                            </tr>
                        ); 
                        break;
                    }
                    case 'building': {
                        overall.building.forEach((building)=>{ 
                            Object.keys(building).forEach((key: string)=> {
                                if(!building[key as keyof Building]){
                                    delete building[key as keyof Building];
                                }
                            });
                        });
                        trs.push(
                            <tr>
                                <td>buildings</td>
                                <td>{overall.building.map(building=>{
                                    return (
                                        <>{JSON.stringify(building).replaceAll('{',"").replaceAll("}","").replaceAll('"',"").replaceAll(","," ")} |</>
                                    );
                                })}</td>
                            </tr>
                        );
                        break;
                    }
                    case 'ownerName':{
                        trs.push(
                            <tr>
                                <td>owner names</td>
                                <td>
                                    {overall.ownerName.map(ownerName=>{
                                        return ownerName+",";
                                    })}
                                </td>
                            </tr>
                        );
                        break;
                    }
                    case 'garages':{
                        overall.garages.forEach((garage)=>{ 
                            Object.keys(garage).forEach((key: string)=> {
                                if(!garage[key as keyof Garage]){
                                    delete garage[key as keyof Garage];
                                }
                            });
                        });
                        trs.push(
                            <tr>
                                <td>garages</td>
                                <td>{overall.garages.map(garage=>{
                                    return (
                                        <>{JSON.stringify(garage).replaceAll('{',"").replaceAll("}","").replaceAll('"',"").replaceAll(","," ")} |</>
                                    );
                                })}</td>
                            </tr>
                        );
                        break;
                    };
                }


            } 
            else {
                if(overall[key as keyof OverallInt]?.toString().length){
                    trs.push(
                        <tr>
                            <td>{key.toString()}</td>
                            <td>{overall[key as keyof OverallInt]?.toString()}</td>
                        </tr>
                    );
                }
            }
        } 
        return trs.map((tr: any)=>{return tr;});
    };

    return(
        <div>
            <h1>Overall data</h1>
            <Table bordered hover responsive>
                <tbody>
                    {returnTable()}
                </tbody>
            </Table>
        </div>
    )

};
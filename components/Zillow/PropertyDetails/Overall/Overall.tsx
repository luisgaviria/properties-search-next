import { OverallInt, Legal, Area, Building,Garage } from "../atoms/OverallAtom";
import Table from "react-bootstrap/Table";
import {useTheme} from "next-themes";
export default function Overall({overall}:{overall: OverallInt}){
    const {theme} = useTheme();
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
                            <td colSpan={100}>{overall.address.full}</td>
                        </tr>);
                        break;
                    }
                    case 'legal': {
                        Object.keys(overall.legal).forEach((key: string)=> { 
                            if(!overall.legal[key as keyof Legal]){
                                delete overall.legal[key as keyof Legal];
                            }
                        }); 
                        const keys = Object.keys(overall.legal);
                        if(keys.length == 1){ 
                            trs.push(
                            <tr>
                                <td>{key.toString()}</td>
                                {keys.map((key:string)=>{
                                    return (
                                        <td colSpan={100}>
                                            {key}:{overall.legal[key as keyof Legal]}
                                        </td>
                                    )
                                })}
                            </tr>);
                        }
                        else {
                            trs.push(
                                <tr>
                                    <td>{key.toString()}</td>
                                    {keys.map((key: string)=> { 
                                        return (<td>{key}:{overall.legal[key as keyof Legal]}</td>);
                                    })}
                                    {/* <td>{JSON.stringify(overall.legal).replaceAll('{',"").replaceAll("}","").replaceAll('"',"").replaceAll(","," ")}</td> */}
                                </tr>
                            );
                        }

                        break;
                    }
                    case 'pools': { 
                         if(overall.pools.length){
                            trs.push(
                                <tr>
                                    <td>{key.toString()}</td>
                                    <td>{JSON.stringify(overall.pools)}</td>
                                </tr>
                            );
                         }
                         else{ 
                            trs.push(
                                <tr>
                                    <td>{key.toString()}</td>
                                    <td colSpan={100}>no pools</td>
                                </tr>
                            );
                         }
                         break;
                    }
                    case 'areas':{   
                        overall.areas.map((area: Area,index: number)=>{
                            trs.push(
                                <tr>
                                    <td>area {index+1}</td>
                                    <td colSpan={4}>Area Square Feet: {area.areaSquareFeet}</td>
                                    <td colSpan={100}>Type: {area.type}</td>
                                </tr>
                            )
                        });
                        // trs.push(
                        //     <tr>
                        //         <td>areas</td>
                        //         {overall.areas.map((area: Area)=>{ 
                        //             return (
                        //             <td> Area Square Feet: {area.areaSquareFeet} Type: {area.type} |</td>
                        //             );
                        //         })}
                        //     </tr>
                        // ); 
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
                        overall.building.map((building: Building,index: number)=>{
                            trs.push(
                                <tr>
                                    <td>building {index+1}</td>
                                    {Object.keys(building).map((key: string)=> { 
                                    return (<td>{key}:{building[key as keyof Building]}</td>);
                                })}
                                </tr>
                            ); 
                        });
                        // trs.push(
                        //     <tr>
                        //         <td>building {1}</td>
                        //         {overall.building.map(building=>{
                        //             return (
                        //                 <>{JSON.stringify(building).replaceAll('{',"").replaceAll("}","").replaceAll('"',"").replaceAll(","," ")} |</>
                        //             );
                        //         })}
                        //     </tr>
                        // );
                        break;
                    }
                    case 'ownerName':{
                        if(overall.ownerName.length == 1 || !overall.ownerName.length) {
                            trs.push(
                                <tr>
                                    <td>owner names</td>
                                    {overall.ownerName.map(ownerName=>{
                                        return (<td colSpan={100}>{ownerName}</td>);
                                    })}
                                </tr>
                            );
                        }
                        else {
                            trs.push(
                                <tr>
                                    <td>owner names</td>
                                        {overall.ownerName.map(ownerName=>{
                                            return (<td>{ownerName}</td>);
                                        })}
                                </tr>
                            );
                        }
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
                         
                        overall.garages.map((garage,index)=>{
                            const keys = Object.keys(garage);

                            trs.push(
                            <tr>
                                <td>garage {index+1}</td>
                                {keys.map((key,index)=>{
                                    if(index ==0){
                                        return (
                                            <td colSpan={4}>{key}: {garage[key as keyof Garage]}</td>
                                        )
                                    }
                                    else{
                                        return (
                                            <td colSpan={100}>{key}: {garage[key as keyof Garage]}</td>
                                        )
                                    }

                                })}
                            </tr>
                            );
                        });

                        break;
                    };
                }


            } 
            else {
                if(overall[key as keyof OverallInt]?.toString().length){
                    trs.push(
                        <tr>
                            <td>{key.toString()}</td>
                            <td colSpan={100}>{overall[key as keyof OverallInt]?.toString()}</td>
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
            {
                overall.url ?             <Table striped bordered hover responsive="sm" variant={theme} >
                <tbody>
                    {returnTable()}
                </tbody>
            </Table> : null
            }
        </div>
    )

};
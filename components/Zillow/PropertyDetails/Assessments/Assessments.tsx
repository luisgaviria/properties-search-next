import { AssessmentInt,Legal,Building,Area,Garage } from "../atoms/AssessmentsAtom";
import Table from "react-bootstrap/Table";
import { useTheme } from "next-themes";

export default function Assessments({assessments}: {assessments: AssessmentInt[]}){
    const {theme} = useTheme();
    const returnTable = (assessment: AssessmentInt) => {
        const keys = Object.keys(assessment);
        const trs = [];
        for(const key of keys){
            if(typeof assessment[key as keyof AssessmentInt] === 'object'){
                switch(key){
                    case 'address': {
                        trs.push(
                        <tr>
                            <td>{key.toString()}</td>
                            <td colSpan={100}>{assessment.address.full}</td>
                        </tr>);
                        break;
                    }
                    case 'legal': {
                        Object.keys(assessment.legal).forEach((key: string)=> { 
                            if(!assessment.legal[key as keyof Legal]){
                                delete assessment.legal[key as keyof Legal];
                            }
                        }); 
                        const keys = Object.keys(assessment.legal);
                        if(keys.length == 1){ 
                            trs.push(
                            <tr>
                                <td>{key.toString()}</td>
                                {keys.map((key:string)=>{
                                    return (
                                        <td colSpan={100}>
                                            {key}:{assessment.legal[key as keyof Legal]}
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
                                        return (<td>{key}:{assessment.legal[key as keyof Legal]}</td>);
                                    })}
                                    {/* <td>{JSON.stringify(assessment.legal).replaceAll('{',"").replaceAll("}","").replaceAll('"',"").replaceAll(","," ")}</td> */}
                                </tr>
                            );
                        }

                        break;
                    }
                    case 'pools': { 
                         if(assessment.pools.length){
                            trs.push(
                                <tr>
                                    <td>{key.toString()}</td>
                                    <td>{JSON.stringify(assessment.pools)}</td>
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
                        assessment.areas.map((area: Area,index: number)=>{
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
                        //         {assessment.areas.map((area: Area)=>{ 
                        //             return (
                        //             <td> Area Square Feet: {area.areaSquareFeet} Type: {area.type} |</td>
                        //             );
                        //         })}
                        //     </tr>
                        // ); 
                        break;
                    }
                    case 'building': {
                        assessment.building.forEach((building)=>{ 
                            Object.keys(building).forEach((key: string)=> {
                                if(!building[key as keyof Building]){
                                    delete building[key as keyof Building];
                                }
                            });
                        });
                        assessment.building.map((building: Building,index: number)=>{
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
                        //         {assessment.building.map(building=>{
                        //             return (
                        //                 <>{JSON.stringify(building).replaceAll('{',"").replaceAll("}","").replaceAll('"',"").replaceAll(","," ")} |</>
                        //             );
                        //         })}
                        //     </tr>
                        // );
                        break;
                    }
                    case 'ownerName':{
                        if(assessment.ownerName.length == 1 || !assessment.ownerName.length) {
                            trs.push(
                                <tr>
                                    <td>owner names</td>
                                    {assessment.ownerName.map(ownerName=>{
                                        return (<td colSpan={100}>{ownerName}</td>);
                                    })}
                                </tr>
                            );
                        }
                        else {
                            trs.push(
                                <tr>
                                    <td>owner names</td>
                                        {assessment.ownerName.map(ownerName=>{
                                            return (<td>{ownerName}</td>);
                                        })}
                                </tr>
                            );
                        }
                        break;
                    }
                    case 'garages':{
                        assessment.garages.forEach((garage)=>{ 
                            Object.keys(garage).forEach((key: string)=> {
                                if(!garage[key as keyof Garage]){
                                    delete garage[key as keyof Garage];
                                }
                            });
                        });
                         
                        assessment.garages.map((garage,index)=>{
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
                if(assessment[key as keyof AssessmentInt]?.toString().length){
                    trs.push(
                        <tr>
                            <td>{key.toString()}</td>
                            <td colSpan={100}>{assessment[key as keyof AssessmentInt]?.toString()}</td>
                        </tr>
                    );
                }
            }
        };

        return trs;
    };

    return (
        <div>
            <h1>Assessments data</h1>
            {assessments.map((assessment,index)=>{
                return (
                    <>
                        <h2>Assessment number: {index+1}</h2>
                        <Table striped bordered hover responsive="sm" variant={theme}>
                            <tbody>
                            {returnTable(assessment)}
                            </tbody>
                        </Table>
                    </>
                
                )
            })}
        </div>
    );
}
import { AssessmentInt,Legal,Building,Area,Garage } from "../atoms/AssessmentsAtom";
import Table from "react-bootstrap/Table";

export default function Assessments({assessments}: {assessments: AssessmentInt[]}){
    const returnTable = (assessment: AssessmentInt,index: number) => {
        const keys = Object.keys(assessment);
        const trs = [];
        trs.push(<tr>
            <td>Assessment number: {index+1}</td>
        </tr>);
        for(const key of keys){
            if(typeof assessment[key as keyof AssessmentInt] === 'object'){
                switch(key){
                    case 'address': {
                        trs.push(
                        <tr>
                            <td>{key.toString()}</td>
                            <td>{assessment.address.full}</td>
                        </tr>);
                        break;
                    }
                    case 'legal': {
                        Object.keys(assessment.legal).forEach((key: string)=> { 
                            if(!assessment.legal[key as keyof Legal]){
                                delete assessment.legal[key as keyof Legal];
                            }
                        }); 
                        trs.push(
                            <tr>
                                <td>{key.toString()}</td>
                                <td>{JSON.stringify(assessment.legal).replaceAll('{',"").replaceAll("}","").replaceAll('"',"").replaceAll(","," ")}</td>
                            </tr>
                        );
                        console.log(assessment.legal);
                        break;
                    }
                    case 'pools': { 
                        trs.push(
                            <tr>
                                <td>{key.toString()}</td>
                                <td>{JSON.stringify(assessment.pools)}</td>
                            </tr>
                        );
                        break;
                    }
                    case 'areas':{  
                        trs.push(
                            <tr>
                                <td>areas</td>
                                <td>
                                {assessment.areas.map((area: Area)=>{ 
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
                        assessment.building.forEach((building)=>{ 
                            Object.keys(building).forEach((key: string)=> {
                                if(!building[key as keyof Building]){
                                    delete building[key as keyof Building];
                                }
                            });
                        });
                        trs.push(
                            <tr>
                                <td>buildings</td>
                                <td>{assessment.building.map(building=>{
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
                                    {assessment.ownerName.map(ownerName=>{
                                        return ownerName+",";
                                    })}
                                </td>
                            </tr>
                        );
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
                        trs.push(
                            <tr>
                                <td>garages</td>
                                <td>{assessment.garages.map(garage=>{
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
                if(assessment[key as keyof AssessmentInt]?.toString().length){
                    trs.push(
                        <tr>
                            <td>{key.toString()}</td>
                            <td>{assessment[key as keyof AssessmentInt]?.toString()}</td>
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
            <Table>
                <tbody>
                    {assessments.map((assessment,index)=>{
                        return returnTable(assessment,index);
                    })}
                </tbody>
            </Table>
        </div>
    );
}
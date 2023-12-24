"use client"
import {atom,useAtom} from "jotai";
import { useEffect } from "react";
import PropertySearchList from "../PropertySearchList/PropertySearchList";
import { createPagination } from "@/utils/createPagination";
import { Pagination } from "react-bootstrap";
const propertiesAtom = atom<any>([]);
propertiesAtom.debugLabel="Properties Atom";
const pagesAtom = atom({
    actualPage: 1, 
    pages: 0    
});
pagesAtom.debugLabel ="Pages Atom";

export default function Filters(){ 
    const [properties,setProperties] = useAtom(propertiesAtom);
    const [pageObj,setPageObj] = useAtom(pagesAtom);  
    const getData = async(page_num: number)=>{ 
        const res = await fetch(`/api/search/zillow?page=${page_num}`,{
            cache: "no-store"
        }).then((res1)=>res1.json());
        setPageObj({actualPage: page_num,pages:res.pages});
        setProperties(res.properties);
    }
    useEffect(()=>{ 
        getData(1);
    },[]);
     
    return (
        <>
            <PropertySearchList properties={properties} onClick={()=>{}}/>
            <Pagination>
                {createPagination(pageObj.pages,pageObj.actualPage,getData)}
            </Pagination>
        </>
    )
};
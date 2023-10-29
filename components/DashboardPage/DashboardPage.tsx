"use client"
import { useEffect } from "react"
import { useSession } from "next-auth/react"

export default function DashboardPage(){
    const {data,status} = useSession();
    useEffect(()=>{
        console.log(data);
        console.log(status);
    });
    return ( 
        <div>
            Dashboard
        </div>
    )
}
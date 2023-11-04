"use client"
import { useEffect } from "react"
import { useSession } from "next-auth/react"

export default function ProfileComponent(){
    const {data,status}: {data:{
    user: { 
        id: number; 
        email: string;
        username: string;
        phoneNumber: string;
    }
    },status: string} = useSession();

    useEffect(()=>{
        console.log(data?.user);
        console.log(status);
    });

    return ( 
        <div>
            Dashboard
            <h1>{data?.user.email}</h1>
            <h1>{data?.user.id}</h1>
            <h1>{data?.user.username}</h1> 
            <h1>{data?.user.phoneNumber}</h1>
        </div>
    )
}
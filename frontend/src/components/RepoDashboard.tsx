"use client"
import React from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { Button } from './ui/button'


const RepoDashboard:React.FC = () =>{    
  return (
    <div><Card>
  <CardHeader>
    <CardTitle>Decentralized Github</CardTitle>
    <CardDescription>It is a decntralized version of github built on top of educhain and Solidity</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Creator Address</p>
  </CardContent>
  <CardFooter>
  <Button onClick={()=>{  location.href="/Repo/1";
}}>Link</Button>
  </CardFooter>
</Card>
</div>
  )
}

export default RepoDashboard
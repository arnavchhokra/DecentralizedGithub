"use client"
import RepoDashboard from '@/components/RepoDashboard'
import React from 'react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
function page() {
  return (
    <div style={{display:"flex", flexDirection:'column', alignItems:"center", padding:"100px"}}>
      <div style={{display:"flex",justifyContent:"space-between",width:"80%"}}>
        <span style={{fontSize:"25px",fontWeight:"600"}}>Your Repositories</span>
        <Button onClick={()=>{location.href='Repo/add'}}>New Repository</Button>
      </div>
      <div style={{width:"80%",marginTop:"30px"}}>
      <RepoDashboard/>
      </div>
      <div style={{width:"80%",marginTop:"30px"}}>
      <RepoDashboard/>
      </div>
      <div style={{width:"80%",marginTop:"30px"}}>
      <RepoDashboard/>
      </div>
    </div>
  )
}

export default page
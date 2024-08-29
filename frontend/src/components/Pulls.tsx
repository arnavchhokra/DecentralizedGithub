import React from 'react'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
  import { Badge } from "@/components/ui/badge"
  import { Button } from '@/components/ui/button'


const Pulls:React.FC = async() => {
  return (
    <div style={{display:"flex", flexDirection:"column",  paddingLeft:"10%", paddingRight:"10%", marginTop:"30px",alignItems:"center"}}>
    <div style={{display:"flex", justifyContent:"flex-start", width:"80%", marginBottom:"20px"}}>
    <Button>+ PR</Button>
    </div>
    <div style={{width:"80%", border:"1px solid grey", borderRadius:"5px"}}>
       <Table>
  <TableHeader>
    <TableRow>
    <TableHead className="w-[100px]">ID</TableHead>
      <TableHead className="w-[100px]">Asignee</TableHead>
      <TableHead className="text-center">Merge Status</TableHead>
      <TableHead className="text-right">Time-Stamp</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow >
    <TableCell className="font-medium">15DE4</TableCell>
      <TableCell className="font-medium">Arnav</TableCell>
      <TableCell className='text-center'>FALSE</TableCell>
      <TableCell className="text-right">$250.00</TableCell>
    </TableRow>
  </TableBody>
</Table>
    </div>
    </div>
  )
}

export default Pulls
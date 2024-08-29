"use client"
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
  import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover"
  import { useState } from 'react'


const Repository:React.FC =() => {
  const [files, setFiles] = useState<File[]>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    setFiles(selectedFiles);
  };

  const handleFileUpload = async () => {
    if (files.length === 0) {
      alert('Please select files or directories first!');
      return;
    }

    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });
  }


  return (
    <div style={{display:"flex", flexDirection:"column",  paddingLeft:"10%", paddingRight:"10%", marginTop:"30px"}}>
    <div style={{display:"flex", alignItems:"center", justifyContent:"Center",gap:"20px"}}>
    <div style={{width:"80%",}}>
    <div style={{display:"flex", alignItems:"center", justifyContent:"space-between",marginBottom:"30px"}}>
    <div style={{display:"flex", alignItems:"center", gap:"10px",}}>
    <button style={{width:"30px",height:"30px",borderRadius:"50%",background:"red", }}></button>
    <p>Repository Name</p>
    <Badge variant="outline">Private</Badge>
    </div>
    <div style={{gap:"10px", display:"flex"}}>
    <Popover>
  <PopoverTrigger style={{background:"white", color:"Black", borderRadius:"5px", paddingTop:"2px", paddingBottom:"2px", paddingLeft:"5px", paddingRight:"5px", fontSize:'14px', fontWeight:'500'}}>Add files</PopoverTrigger>
  <PopoverContent> <div style={{ padding: "10px", width: "200px" }}>
  <input 
                      type="file" 
                      multiple 
                      onChange={handleFileChange} 
                    />
                                        
                      <Button style={{ marginTop: "10px" }} onClick={handleFileUpload}>
                      Upload
                    </Button>
                  </div></PopoverContent>
</Popover>
    <Button variant="outline">Zip</Button>
    <Button>Fork</Button>
    </div>
    </div>
    <div style={{border:"1px solid grey", borderRadius:"5px"}}>
       <Table>
  <TableHeader>
    <TableRow>
      <TableHead className="w-[100px]">User</TableHead>
      <TableHead className="text-center"></TableHead>
      <TableHead className="text-right">Time-Stamp</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow >
      <TableCell className="font-medium">INV001</TableCell>
      <TableCell className='text-center'>Credit Card</TableCell>
      <TableCell className="text-right">$250.00</TableCell>
    </TableRow>
  </TableBody>
</Table>
</div>

    </div>
    <div style={{display:"flex", flexDirection:"column", marginTop:"50px"}}>
      <h2>ABOUT</h2>
      <p style={{marginTop:"20px"}}>No description, website, or topics provided.</p>

    </div>

    </div>
    </div>
  )
}

export default Repository
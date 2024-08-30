"use client";
import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { pinFileToIPFS } from "@/utils/pinata";
import { get } from "https";
import axios from "axios";


const Repository: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleUpload = async () => {
    if (!selectedFile) return;
    if (selectedFile.type !== "application/zip") {
      alert("Please upload a ZIP file.");
      return;
    }
  
    const formData = new FormData();
    formData.append("file", selectedFile);
  
    try {
      const response = await fetch("http://localhost:5000/api/upload", {
        method: "POST",
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error(`Failed to upload ${selectedFile.name}`);
      }
  
      const result = await response.json();
      console.log(`File ${selectedFile.name} uploaded successfully:`, result.ipfsHash);
      // Handle the result as needed (e.g., storing IPFS hash)
    } catch (error) {
      console.error(error instanceof Error ? error.message : 'An unknown error occurred');
    }
  };

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
    }
  };

  const retrieval = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/retrieve/QmSfUzc1bhqPrb4pKhPn63K2iFk3wf8xrGAhEKENvrVJCw',{
        method:'GET'
      })
      console.log(response)
    } catch (error: any) {
      console.error("Error retrieving:", error.message);
    }
  };
  
  useEffect(() => {
    retrieval();
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", paddingLeft: "10%", paddingRight: "10%", marginTop: "30px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "Center", gap: "20px" }}>
        <div style={{ width: "80%" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "30px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <button style={{ width: "30px", height: "30px", borderRadius: "50%", background: "red" }}></button>
              <p>Repository Name</p>
              <Badge variant="outline">Private</Badge>
            </div>
            <div style={{ gap: "10px", display: "flex" }}>
              <Popover>
                <PopoverTrigger style={{ background: "white", color: "Black", borderRadius: "5px", padding: "2px 5px", fontSize: '14px', fontWeight: '500' }}>Add files</PopoverTrigger>
                <PopoverContent>
                  <div style={{ padding: "10px", width: "200px" }}>
                    <input 
                      type="file" 
                      onChange={onFileChange} 
                    />
                    <Button style={{ marginTop: "10px" }} onClick={handleUpload}>
                      Upload
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
              <Button variant="outline">Zip</Button>
              <Button>Fork</Button>
            </div>
          </div>
          <div style={{ border: "1px solid grey", borderRadius: "5px" }}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">User</TableHead>
                  <TableHead className="text-center"></TableHead>
                  <TableHead className="text-right">Time-Stamp</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">INV001</TableCell>
                  <TableCell className='text-center'>Credit Card</TableCell>
                  <TableCell className="text-right">$250.00</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", marginTop: "50px" }}>
        <h2>ABOUT</h2>
        <p style={{ marginTop: "20px" }}>No description, website, or topics provided.</p>
      </div>
    </div>
  );
};

export default Repository;
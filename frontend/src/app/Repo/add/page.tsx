"use client"; // Ensure this is present for client-side rendering

import { Button } from '@/components/ui/button';
import React, { useState } from 'react'; // Import useState
import axios from 'axios';
import Web3 from 'web3';
import contractABI from '@/components/contractABI';


function Page() { // Component name should start with an uppercase letter
    const [nameu, setNamu] = useState(""); // Declare state

    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const web3 = new Web3((window as any).ethereum);
    const contractAddress = "0xddEc11C12559a6cBCb1A2c845FF14530818129A4";
    const contract = new web3.eth.Contract(contractABI, contractAddress);

    const handleUpload = async () => {
        const accounts = await web3.eth.requestAccounts();
        const account = accounts[0];

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
        // Handle the result as needssed (e.g., storing IPFS hash)
        try {
            await contract.methods.createRepository(nameu, result.ipfsHash).send({ from: account });
            alert(" Repository created successfully");
        } catch (error) {
            console.error("Error creating Repository:", error);
        }
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

    return (
        <div style={{display:"flex", flexDirection:"column",padding:"20%"}}>
            <input placeholder='Only Zip' type='file' style={{border:'1px solid grey', }}                       
            onChange={onFileChange} 
            ></input>
            <input placeholder='name' type='text' onChange={(e) => setNamu(e.target.value)}></input>
            <Button onClick={handleUpload}style={{width:"80px"}}>Create</Button>
        </div>
    );
}

export default Page; // Export the component with the corrected name

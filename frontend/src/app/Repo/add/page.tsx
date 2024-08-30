"use client";

import { Button } from '@/components/ui/button';
import React, { useState } from 'react';
import Web3 from 'web3';
import contractABI from '@/components/contractABI';

function Page() {
    const [nameu, setNamu] = useState("");
    const [ipfsCid, setIpfsCid] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    // Initialize Web3
    const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");

    // Contract Address
    const contractAddress = "0xddEc11C12559a6cBCb1A2c845FF14530818129A4";
    const contract = new web3.eth.Contract(contractABI, contractAddress);

    const handleUpload = async () => {
        if (!nameu || !ipfsCid) {
            alert("Repository name or IPFS CID is missing");
            return;
        }

        try {
            const accounts = await web3.eth.requestAccounts();
            const account = accounts[0];

            // Call the createRepository function in the smart contract
            const repoId = await contract.methods.createRepository(nameu, ipfsCid).send({ from: account });
            console.log("Repository created successfully with ID:", repoId);
        } catch (error) {
            console.error("Error creating repository:", error);
        }
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", padding: "20%" }}>
            <input
                placeholder="Repository Name"
                type="text"
                value={nameu}
                onChange={(e) => setNamu(e.target.value)}
                style={{ marginBottom: "10px", padding: "10px", border: "1px solid grey" }}
            />
            <input
                placeholder="IPFS CID"
                type="text"
                value={ipfsCid}
                onChange={(e) => setIpfsCid(e.target.value)}
                style={{ marginBottom: "10px", padding: "10px", border: "1px solid grey" }}
            />
            <Button onClick={handleUpload} style={{ width: "100px" }}>Create</Button>
        </div>
    );
}

export default Page;

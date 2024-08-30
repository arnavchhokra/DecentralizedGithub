"use client"; // Ensure this is present for client-side rendering

import { Button } from '@/components/ui/button';
import React, { useState } from 'react';
import Web3 from 'web3';
import contractABI from '@/components/contractABI';

function Page() {
    const [repoId, setRepoId] = useState(""); // Repository ID
    const [sourceCommitHash, setSourceCommitHash] = useState(""); // Source Commit Hash
    const [targetCommitHash, setTargetCommitHash] = useState(""); // Target Commit Hash
    const [prDescription, setPrDescription] = useState(""); // Pull Request Description
    const [selectedFile, setSelectedFile] = useState<File | null>(null); // File

    // Initialize Web3
    const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");

    // Contract Address
    const contractAddress = "0xddEc11C12559a6cBCb1A2c845FF14530818129A4";
    const contract = new web3.eth.Contract(contractABI, contractAddress);

    const handleUpload = async () => {
        if (!selectedFile) {
            alert("No file selected");
            return;
        }
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

            // Call the createPullRequest function in the smart contract
            const accounts = await web3.eth.requestAccounts();
            const account = accounts[0];

            try {
                await contract.methods.createPullRequest(repoId, sourceCommitHash, targetCommitHash, result.ipfsHash).send({ from: account });
                console.log("Pull request created successfully");
            } catch (error) {
                console.error("Error creating pull request:", error);
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
        <div style={{ display: "flex", flexDirection: "column", padding: "20%" }}>
            <input
                placeholder='Only Zip'
                type='file'
                style={{ border: '1px solid grey' }}
                onChange={onFileChange}
            />
            <input
                placeholder='REPO ID'
                type='text'
                onChange={(e) => setRepoId(e.target.value)}
                style={{ marginBottom: "10px", padding: "10px", border: "1px solid grey" }}
            />
            <input
                placeholder='Source Commit Hash'
                type='text'
                onChange={(e) => setSourceCommitHash(e.target.value)}
                style={{ marginBottom: "10px", padding: "10px", border: "1px solid grey" }}
            />
            <input
                placeholder='Target Commit Hash'
                type='text'
                onChange={(e) => setTargetCommitHash(e.target.value)}
                style={{ marginBottom: "10px", padding: "10px", border: "1px solid grey" }}
            />
            <input
                placeholder='Pull Request Description'
                type='text'
                onChange={(e) => setPrDescription(e.target.value)}
                style={{ marginBottom: "10px", padding: "10px", border: "1px solid grey" }}
            />
            <Button onClick={handleUpload} style={{ width: "80px" }}>Create</Button>
        </div>
    );
}

export default Page;

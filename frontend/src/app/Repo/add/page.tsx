"use client"
import {useState } from 'react';
import Web3 from 'web3';
import type { NextPage } from 'next';
import Moralis  from 'moralis';
import CryptoJS from 'crypto-js';

const App: NextPage =()=> {
const [web3, setWeb3] = useState<Web3 | null>(null);
const [account, setAccount] = useState<string>("");
const [selectedFile, setSelectedFile] = useState<File[]>([]);
const [ceramic, setCeramic] = useState<any>(null);
const [uri,setUri] = useState<string>("");


const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
const [isUploading, setIsUploading] = useState(false);
const [uploadError, setUploadError] = useState<string | null>(null);
const [uploadResult, setUploadResult] = useState<any>(null);

const sendToMoralis = async (event: React.ChangeEvent<HTMLInputElement>) => {
  try {
    setIsUploading(true);
    setUploadError(null);

    const files = event.target.files;
    if (!files || files.length === 0) {
      throw new Error('No files selected');
    }

    const abi = [];
    const fileHash = [];

    for (const file of Array.from(files)) {
      const content = await file.text();
      const path = file.webkitRelativePath || file.name;
      const shaHash = CryptoJS.SHA256(content).toString(CryptoJS.enc.Hex);

      abi.push({
        path,
        content: btoa(content),
        shaHash,
      });
      fileHash.push(shaHash);
    }

    const response = await fetch('/api/uploadToMoralis', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ abi }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    setUploadResult(data);

    console.log('Upload successful:', data);

  } catch (error) {
    console.error('Upload error:', error);
    setUploadError(error instanceof Error ? error.message : 'An unknown error occurred');
  } finally {
    setIsUploading(false);
  }
};

  return (
<div style={{ display: "flex", flexDirection: "column", padding: "20%" }}>

      <input
        placeholder="name"
        type="text"

      />
     <input
        type="file"
     {...({ webkitdirectory: "true" })}
        multiple
        {...({ mozdirectory : "true" })}
        {...({ directory: "true" })}
        onChange={sendToMoralis}
        {...({} as React.InputHTMLAttributes<HTMLInputElement>)}

        style={{ border: '1px solid grey' }}
      />

      <button style={{ width: "80px" }}>
        Create
      </button>
    </div>
 )
}

export default App

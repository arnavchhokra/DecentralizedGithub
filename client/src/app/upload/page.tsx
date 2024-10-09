"use client"

import { useEffect, useState } from 'react';
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


  useEffect(() => {

    if (typeof global === 'undefined') {
      window.global = window;
    }

    if (typeof process === 'undefined') {
        (window as any).process = {
        env: {
          NODE_ENV: 'development',
        },
      };
    }



    const loadCeramic = async () => {
      const { CeramicClient } = await import('@ceramicnetwork/http-client');
      const { ThreeIdConnect, EthereumAuthProvider } = await import( '@3id/connect');
      const { DID } = await import('dids'); // Import DID
      const { getResolver } = await import('@ceramicnetwork/3id-did-resolver'); // Import DID resolver


      const ceramic = new CeramicClient("https://ceramic-clay.3boxlabs.com");
      if(account == "")
      {
        console.log("Wait")
        return;
      }
      const authProvider = new EthereumAuthProvider((window as any).ethereum, account);
      const threeIdConnect = new ThreeIdConnect();
      await threeIdConnect.connect(authProvider);


      const did = new DID({
        provider: threeIdConnect.getDidProvider(),
        resolver: getResolver(ceramic)
      });

      await did.authenticate();
      ceramic.setDID(did);
      console.log(did," is DID Provider");

      console.log(authProvider," is auth provider")

      console.log("ThreeID Initialted")
      setCeramic(ceramic)
    };

    const connectWallet = async () => {
      if ((window as any).ethereum) {
        try {
          // Request account access
          const accounts = await (window as any).ethereum.request({ method: "eth_requestAccounts" });
          const web3 = new Web3((window as any).ethereum);
          setWeb3(web3);
          setAccount(accounts[0]);
          console.log(accounts[0]);
        } catch (error) {
          console.error("User denied account access or there was an error connecting:", error);
        }
      } else {
        alert("MetaMask is not installed!");
      }
    };

    connectWallet();
    loadCeramic();
  },[account]);

  const sendToDB = async()=>{

  }


  const uploadToCeramic = async (response: any, fileHashes: string[], fileAbi: any[]) => {
    const { TileDocument } = await  import('@ceramicnetwork/stream-tile'); // Import TileDocument
    if (!ceramic) {
      alert('Ceramic instance not initialized');
      return;
    }
    const docIds = [];
    try {
      for(var i=0 ; i<response.result.length ; i++) {
        const ceramicEntry = {
          path: fileAbi[i].path, // File path from ABI
          fileHash: fileHashes[i], // File hash
          ipfs: response?.result[i].path.split('/ipfs/')[1].split('/')[0], // CID from Moralis response
        };
        const doc = await TileDocument.create(ceramic, ceramicEntry, {
          controllers: [ceramic.did.id],
      });
      docIds.push(doc.id.toString());
      console.log('Document created with ID:', doc.id);
    }

    } catch (error) {
      console.error('Error creating document on Ceramic:', error);
    }
    return docIds;
  };

  const handleUpload = async () => {
    /*
    if (!ceramic) {
      alert("Please wait, Ceramic is still initializing.");
      return;
    }

    if (!selectedFile.length) return;

    try {

      const fileData = {
        file_path: "12131",
        fileType: "EXE",
        hash: "1223131312"
      };
      await uploadToCeramic(fileData);



    for await (const file of response) {
        console.log(file);
    }

        console.log(response);
        alert(response);
      alert("File(s) uploaded to Ceramic");
    } catch (e:any) {
      alert(`Error during file upload: ${e.message}`);
    }*/
  };



  const sendToMoralis = async(event: React.ChangeEvent<HTMLInputElement>) =>{
    try {
      // Get the files from the input event
      const files = event.target.files;
      const abi = [];
      const fileHash =[];
      if (!files) return;

      for (const file of files) {
        const content = await file.text(); // Read the file content as text (base64 for images)
        const path = file.webkitRelativePath || file.name; // Use relative path or just the filename
        const shaHash:string = CryptoJS.SHA256(content).toString(CryptoJS.enc.Hex);
        abi.push({
          path,
          content: btoa(content), // Encode to base64 for file content
        });
        fileHash.push(shaHash)
      }

    await Moralis.start({
        apiKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6IjcwYzYyZmRhLWVlNGYtNGViNC1hZjhiLWZmZTRhNjA2MDAyMiIsIm9yZ0lkIjoiMjcwMjA0IiwidXNlcklkIjoiMjc1MTM1IiwidHlwZUlkIjoiZWVjZWI1ZjEtZjlhNy00NmJkLTgzZGEtMjBhODc3ZTY3ZGU3IiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3MjI5ODQyNjcsImV4cCI6NDg3ODc0NDI2N30.ctfDaAz-5cLh83nDOivI3A3QQtq86fMjuuECMUHTMWk',
    });

    const response = await Moralis.EvmApi.ipfs.uploadFolder({
        abi
    });



    console.log(response?.toJSON());

    for(var i=0;i<response?.result.length;i++){
        console.log("ELement ",i," is ",response?.result[i].path,"and abi is", abi[i].path.split("/")[1]);
    }
   const docids = await uploadToCeramic(response,fileHash,abi);

} catch (e) {
    console.error(e);
}

  }


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

      <button onClick={handleUpload}  style={{ width: "80px" }}>
        Create
      </button>
    </div>
 )
}

export default App

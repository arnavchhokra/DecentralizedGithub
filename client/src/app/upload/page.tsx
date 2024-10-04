"use client"

import { useEffect, useState } from 'react';
import Web3 from 'web3';
//import {useStorageUpload} from '@thirdweb-dev/react';
import type { NextPage } from 'next';
import { client } from '../client';
import { upload } from "thirdweb/storage";



const App: NextPage =()=> {
const [web3, setWeb3] = useState<Web3 | null>(null);
const [account, setAccount] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File[]>([]);
  const [ceramic, setCeramic] = useState<any>(null);
  //const {mutateAsync: upload} = useStorageUpload();



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
      //ceramic.did = did
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


  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const files = event.target.files;
      if (files && files.length > 0) {
        const fileArray = Array.from(files);
        setSelectedFile(fileArray);
      }
      alert("File selected");
    } catch (e:any) {
      alert(`Error selecting file: ${e.message}`);
    }
  };


  const uploadToCeramic = async (fileData:any) => {
    const { TileDocument } = await  import('@ceramicnetwork/stream-tile'); // Import TileDocument

    if (!ceramic) {
      alert('Ceramic instance not initialized');
      return;
    }
    try {
      const doc = await TileDocument.create(ceramic, fileData, {
        controllers: [ceramic.did.id]
      });
      console.log('Document created with ID:', doc.id);
    } catch (error) {
      console.error('Error creating document on Ceramic:', error);
    }
  };

  const handleUpload = async () => {
    if (!ceramic) {
      alert("Please wait, Ceramic is still initializing.");
      return;
    }

    if (!selectedFile.length) return;
    const formData = new FormData();
        selectedFile.forEach(file => {
        formData.append('files', file);
    });

    try {
      /*
      for (const file of selectedFile) {

        const fileHash = await computeSHA1Hash(file);
        const fileData = {
          file_path: file.webkitRelativePath,
          fileType: file.type,
          hash: fileHash
        };
        await uploadToCeramic(fileData);
      }
        */
      const fileData = {
        file_path: "12131",
        fileType: "EXE",
        hash: "1223131312"
      };
      await uploadToCeramic(fileData);
      /*
      const response = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        body: formData,
    });*/
    const fileDataArray = selectedFile.map(file => ({
      path: file.webkitRelativePath, // Retain the folder structure
      file: file
  }));

        const response  = await upload({client, files: fileDataArray.map(item => item.file), uploadWithoutDirectory:false});
        console.log(response);
        alert(response);


      alert("File(s) uploaded to Ceramic");

    } catch (e:any) {
      alert(`Error during file upload: ${e.message}`);
    }
  };

  return (
<div style={{ display: "flex", flexDirection: "column", padding: "20%" }}>
      <input
        type="file"
        {...({ webkitdirectory: "true" })}
        multiple
        onChange={onFileChange}
        style={{ border: '1px solid grey' }}
      />
      <input
        placeholder="name"
        type="text"

      />
      <button onClick={handleUpload}  style={{ width: "80px" }}>
        Create
      </button>
    </div>
 )
}

export default App
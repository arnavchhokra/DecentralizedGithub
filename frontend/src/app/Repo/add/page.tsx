"use client"
import { Button } from '@/components/ui/button';
import React, { useEffect, useState } from 'react';
const Ceramic = require("@ceramicnetwork/http-client").default;
import Web3 from 'web3';
import { ThreeIdConnect, EthereumAuthProvider } from '@3id/connect';

const CERAMIC_URL = "https://ceramic-clay.3boxlabs.com";
const threeIdConnect = new ThreeIdConnect();

const Page = () => {
  interface WindowWithEthereum extends Window {
    ethereum?: any;
  }

  const [nameu, setNamu] = useState("");
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [selectedFile, setSelectedFile] = useState<File[]>([]);
  const [ceramic, setCeramic] = useState<any>(null);
  const [isCeramicInitialized, setIsCeramicInitialized] = useState(false);
  const [account, setAccount] = useState<string | null>(null);

  useEffect(()=>{
    const win = window as WindowWithEthereum;

    const loadCeramic = async () => {
      const { CeramicClient } = await import('@ceramicnetwork/http-client');
      const { ThreeIdConnect, EthereumAuthProvider } = await import( '@3id/connect');
      const { DID } = await import('dids'); // Import DID
      const { getResolver } = await import('@ceramicnetwork/3id-did-resolver'); // Import DID resolver


      const ceramic = new CeramicClient("https://ceramic-clay.3boxlabs.com");
      const authProvider = new EthereumAuthProvider(win.ethereum, account);
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
    const win = window as WindowWithEthereum;
    if (win.ethereum) {
      await win.ethereum.enable();
      const web3 = new Web3(win.ethereum);
      setWeb3(web3);
      const accounts = await web3.eth.getAccounts();
      setAccount(accounts[0]);
      console.log(accounts[0])
    }
  }

  connectWallet();
  loadCeramic();
},[account]);

  const initCeramic = async () => {
    try {
      console.log("Ceramic Started")
      const win = window as WindowWithEthereum;
      await win.ethereum.enable();
      const web3 = new Web3(win.ethereum);
      setWeb3(web3);
      const accounts = await web3.eth.getAccounts();
      const authProvider = new EthereumAuthProvider(win.ethereum, accounts[0]);
      console.log(authProvider," is auth provider")
      await threeIdConnect.connect(authProvider); // Breakpoint
      console.log("Ceramic Mid 1")
      const didProvider = await threeIdConnect.getDidProvider();
      const ceramicInstance = new Ceramic(CERAMIC_URL);
      await ceramicInstance.setDIDProvider(didProvider);
      setCeramic(ceramicInstance);
      setIsCeramicInitialized(true); // Ceramic is now initialized
      console.log("Hi3")
    } catch (error) {
      console.error('Error setting up Ceramic:', error);
      alert('Failed to initialize Ceramic');
    }
  };

  const handleUpload = async () => {
    if (!ceramic) {
      alert("Please wait, Ceramic is still initializing.");
      return;
    }

    if (!selectedFile.length) return;

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

      alert("File(s) uploaded to Ceramic");

    } catch (e:any) {
      alert(`Error during file upload: ${e.message}`);
    }
  };

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const files = event.target.files;
      if (files && files.length > 0) {
        const fileArray = Array.from(files);
        setSelectedFile(fileArray);
      }
      alert("File selected");
    } catch (e: any) {
      alert(`Error selecting file: ${e.message}`);
    }
  };

  const computeSHA1Hash = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-1', arrayBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
  };

  const uploadToCeramic = async (fileData: { file_path: string, fileType: string, hash: string }) => {
    if (!ceramic) {
      alert('Ceramic instance not initialized');
      return;
    }

    try {
      const doc = await ceramic.createDocument('tile', {
        content: fileData,
        metadata: { controllers: [(window as any).ethereum.selectedAddress] }
      });
      console.log('Document created with ID:', doc.id);
    } catch (error) {
      console.error('Error creating document on Ceramic:', error);
    }
  };

  const createRepository = async () => {
    try {
      await initCeramic();
      await handleUpload();
    } catch (error: any) {
      console.error('Error creating repository:', error);
      alert('Error making repository');
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", padding: "20%" }}>
      <input
        type="file"
        {...({ webkitdirectory: "true" } as any)}
        multiple
        style={{ border: '1px solid grey' }}
        onChange={onFileChange}
      />
      <input
        placeholder="name"
        type="text"
        onChange={(e) => setNamu(e.target.value)}
      />
      <Button onClick={createRepository} style={{ width: "80px" }}>
        Create
      </Button>
    </div>
  );
};

export default Page;

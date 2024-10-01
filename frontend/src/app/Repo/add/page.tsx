"use client"
import { Button } from '@/components/ui/button';
import React, { useEffect, useState } from 'react'; 
const Ceramic = require("@ceramicnetwork/http-client").default;
import Web3 from 'web3';
import { ThreeIdConnect, EthereumAuthProvider } from '@3id/connect';





const CERAMIC_URL = "https://ceramic-clay.3boxlabs.com";
const threeIdConnect = new ThreeIdConnect();



const Page =() => { 
    const [nameu, setNamu] = useState(""); 
    const [selectedFile, setSelectedFile] = useState<File[]>([]);
    const web3 = new Web3((window as any).ethereum);
    const [ceramic, setCeramic] = useState<any>(null);


    useEffect(() => {
      const initCeramic = async () => {
        try {
          const web3 = new Web3((window as any).ethereum);
          const accounts = await web3.eth.requestAccounts();
          const authProvider = new EthereumAuthProvider((window as any).ethereum, accounts[0]);
          await threeIdConnect.connect(authProvider);
          const didProvider = await threeIdConnect.getDidProvider();
          
          const ceramicInstance = new Ceramic(CERAMIC_URL);
          await ceramicInstance.setDIDProvider(didProvider);
          setCeramic(ceramicInstance);
        } catch (error) {
          console.error('Error setting up Ceramic:', error);
        }
      };
      initCeramic();
    }, []);


    const handleUpload =() => {
      if (!selectedFile.length) return;
      const formData = new FormData();
      selectedFile.forEach((file) => {
        formData.append("files", file, file.webkitRelativePath); // Preserve file structure
      });

    };
  

     const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const fileArray = Array.from(files); 
      setSelectedFile(fileArray);
    }
  };




    const uploadToCeramic =() =>{
     // const exis_doc = await ceramic.loadDocument(props.drawingProps.location.canvasProps.hash);
    }

    const createRepository =() =>{
      try{
        handleUpload()
        uploadToCeramic()

      }catch(e:any)
      {
        alert(`Error making repository`);
        console.log(e.message)
      }
    }



    return (
        <div style={{display:"flex", flexDirection:"column",padding:"20%"}}>
            <input type="file"         {...({ webkitdirectory: "true" } as any)}
  multiple  style={{border:'1px solid grey', }}                       
            onChange={onFileChange} 
            ></input>
            <input placeholder='name' type='text' onChange={(e) => setNamu(e.target.value)}></input>
            <Button onClick={createRepository}style={{width:"80px"}}>Create</Button>
        </div>
    );
}

export default Page;

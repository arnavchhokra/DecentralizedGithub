import { useEffect, useState } from 'react';
import Web3 from 'web3';


const App =()=> {

  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [selectedFile, setSelectedFile] = useState([]);
  const [ceramic, setCeramic] = useState(null);

  useEffect(() => {

    if (typeof global === 'undefined') {
      window.global = window;
    }

    if (typeof process === 'undefined') {
      window.process = {
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
      const authProvider = new EthereumAuthProvider(window.ethereum, account);
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
      if (window.ethereum) {
        await window.ethereum.enable();
        const web3 = new Web3(window.ethereum);
        setWeb3(web3);
        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]);
        console.log(accounts[0])
      }
    }

    connectWallet();
    loadCeramic();
  },[account]);


  const onFileChange = (event) => {
    try {
      const files = event.target.files;
      if (files && files.length > 0) {
        const fileArray = Array.from(files);
        setSelectedFile(fileArray);
      }
      alert("File selected");
    } catch (e) {
      alert(`Error selecting file: ${e.message}`);
    }
  };


  const uploadToCeramic = async (fileData) => {
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

      const response = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        body: formData,
    });
        if (response.ok) {
          alert("File(s) uploaded successfully");
        } else {
            alert("Failed to upload file");
        }

      alert("File(s) uploaded to Ceramic");

    } catch (e) {
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
    </div>  )
}

export default App
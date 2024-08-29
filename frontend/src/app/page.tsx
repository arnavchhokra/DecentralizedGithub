"use client"
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import MetamaskConnect from "@/components/MetamaskConnect";

export default function Home() {
  const [account, setAccount] = useState<string | null>(null);
  const [networkId, setNetworkId] = useState<number | null>(null);
  const [text,setText] = useState("Connect");


  const handleConnect = async () => {
    const { account, networkId } = await MetamaskConnect();
    setAccount(account);
    setNetworkId(networkId);
    if(account) 
      {
        setText(account.slice(0,5));
        location.href = "/Dashboard";
      }
  };

  return (
    <main style={{display:"flex",flexDirection:"column", justifyContent:"center", alignItems:"center", alignContent:"center",height:"100vh"}}>
     <h1>
      Decentralized Github
     </h1>
     <button  style={{background:"darkblue",color:"white", padding:"10px"}} onClick={handleConnect}>
      {text}
     </button>
     {account && <p>Connected account: {account}</p>}
     {networkId && <p>Network ID: {networkId}</p>}
    </main>
  );
}

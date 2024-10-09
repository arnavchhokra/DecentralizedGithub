"use client"
import { useState, useEffect } from "react";
import { useWallet } from "@/components/WalletContextProvider";
import { MoveRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";

// You'll need to import your IDL and set up your program ID
interface PhantomWindow extends Window {
  solana?: {
    connect(): Promise<{ publicKey: string }>;
    disconnect(): Promise<void>;
    signTransaction(transaction: any): Promise<any>;
    signAllTransactions(transactions: any[]): Promise<any[]>;
    signMessage(message: Uint8Array): Promise<{ signature: Uint8Array }>;
    isPhantom?: boolean;
    publicKey?: { toBuffer(): Buffer };
  } & anchor.Wallet;
}
declare const window: PhantomWindow;

import idl from "../components/idl.json"; // Update with your actual path
import { idlts } from "./idlts";
const PROGRAM_ID = new PublicKey("68fSFQ3smXjrpBXdhxMNTo4V9Awsr3PKCn4WGbjqHip5");

export default function Hero() {
  const [account, setAccount] = useState<string | null>(null);
  const [text, setText] = useState("Connect");
  const [loading, setLoading] = useState(false);
  const { walletAddress, connectWallet } = useWallet();

  const handleConnect = async () => {
    setLoading(true);
    try {
      await connectWallet();
      await createUserAccount();
      location.href='/Dashboard'

    } catch (error) {
      console.error("Failed to connect wallet:", error);
    } finally {
      setLoading(false);
    }
  };

  const createUserAccount = async () => {
    if (!walletAddress) return;

    try {
      setLoading(true);
      setText("Creating Account...");

      const connection = new anchor.web3.Connection("http://localhost:8899", "confirmed");
      const wallet = window.solana;
      if(!wallet) return;

      const provider = new anchor.AnchorProvider(
        connection,
        wallet,
        { commitment: "confirmed" }
      );

      const program = new Program(idl as any, PROGRAM_ID, provider) as Program<idlts>;

      const [userPDA] = await PublicKey.findProgramAddress(
        [
          Buffer.from("user"),
          provider.wallet.publicKey.toBuffer(),
        ],
        program.programId
      );

      const username = "User" + Math.floor(Math.random() * 1000); // Generate a random username

      const tx = await program.methods
        .initUser(username)
        .accounts({
          userAccount: userPDA,
          authority: provider.wallet.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();

      console.log("User account created! Transaction signature:", tx);
      setText("Account Created!");

      // Redirect to dashboard
      location.href = "/Dashboard";
    } catch (error) {
      console.error("Error creating user account:", error);
      setText("Error - Try Again");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (walletAddress) {
      setAccount(walletAddress);
      setText(walletAddress.slice(0, 5));
      createUserAccount(); // Automatically try to create user account when wallet connects
    }
  }, [walletAddress]);

  return (
    <div className="w-full py-20 lg:py-40">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 gap-8 items-center lg:grid-cols-2">
          <div className="flex gap-4 flex-col">
            <div>
              <Badge variant="outline">We&apos;re live!</Badge>
            </div>
            <div className="flex gap-4 flex-col">
              <h1 className="text-5xl md:text-7xl max-w-lg tracking-tighter text-left font-regular">
                This is the start of something!
              </h1>
              <p className="text-xl leading-relaxed tracking-tight text-muted-foreground max-w-md text-left">
                Managing a small business today is already tough. Avoid further
                complications by ditching outdated, tedious trade methods. Our
                goal is to streamline SMB trade, making it easier and faster than
                ever.
              </p>
            </div>
            <div className="flex flex-row gap-4">
              <Button
                onClick={handleConnect}
                size="lg"
                className="gap-4"
                disabled={loading}
              >
                {text}
                <MoveRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <div className="bg-muted rounded-md aspect-square"></div>
        </div>
      </div>
    </div>
  );
}
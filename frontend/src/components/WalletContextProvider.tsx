// src/components/WalletContextProvider.tsx
"use client"
import { createContext, FC, ReactNode, useContext, useEffect, useState } from "react";
import { Connection, PublicKey, clusterApiUrl, Transaction, SystemProgram } from "@solana/web3.js";

// Define the context type
interface WalletContextType {
  walletAddress: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  sendTransaction: (recipient: string, amount: number) => Promise<void>;
}

// Create a default context
const WalletContext = createContext<WalletContextType | undefined>(undefined);

interface WalletContextProviderProps {
  children: ReactNode;
}

// WalletContextProvider component
export const WalletContextProvider: FC<WalletContextProviderProps> = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [connection, setConnection] = useState<Connection | null>(null);

  // Check if Phantom is installed
  const isPhantomInstalled = () => {
    return typeof window !== "undefined" && (window as any).solana?.isPhantom;
  };

  // Connect to Phantom Wallet
  const connectWallet = async () => {
    try {
      if (isPhantomInstalled()) {
        const solana = (window as any).solana;
        const response = await solana.connect();
        setWalletAddress(response.publicKey.toString());

        // Set up the Solana connection
        const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
        setConnection(connection);
      } else {
        alert("Phantom Wallet is not installed");
      }
    } catch (err) {
      console.error("Failed to connect wallet", err);
    }
  };

  // Disconnect from Phantom Wallet
  const disconnectWallet = () => {
    setWalletAddress(null);
    setConnection(null);
  };

  // Send a transaction
  const sendTransaction = async (recipient: string, amount: number) => {
    if (!walletAddress || !connection) return;

    try {
      const senderPublicKey = new PublicKey(walletAddress);
      const recipientPublicKey = new PublicKey(recipient);

      // Create a transaction
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: senderPublicKey,
          toPubkey: recipientPublicKey,
          lamports: amount * 1e9, // Convert SOL to lamports
        })
      );

      const { solana } = window as any;
      const { signature } = await solana.signAndSendTransaction(transaction);
      await connection.confirmTransaction(signature, "confirmed");
      console.log("Transaction successful", signature);
    } catch (err) {
      console.error("Failed to send transaction", err);
    }
  };

  return (
    <WalletContext.Provider
      value={{
        walletAddress,
        connectWallet,
        disconnectWallet,
        sendTransaction,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

// Custom hook to use the Wallet context
export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within a WalletContextProvider");
  }
  return context;
};

export default WalletContextProvider;

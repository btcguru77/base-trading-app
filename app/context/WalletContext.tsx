"use client";

import React, { createContext, useContext, useState } from "react";

type WalletContextType = {
  wallet: string | null;
  connectWallet: (wallet: string) => void;
  disconnectWallet: () => void;
};

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
  const [wallet, setWallet] = useState<string | null>(null);

  const connectWallet = (wallet: string) => {
    setWallet(wallet);
  };

  const disconnectWallet = () => {
    setWallet(null);
  };

  return (
    <WalletContext.Provider value={{ wallet, connectWallet, disconnectWallet }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWalletContext = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWalletContext must be used within a WalletProvider");
  }
  return context;
};

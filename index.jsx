"use client";

import React, { useEffect, useState } from "react";
import { WagmiConfig, createClient, configureChains, mainnet, useAccount, useSigner } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { getDefaultWallets, RainbowKitProvider, ConnectButton } from "@rainbow-me/rainbowkit";
import { ethers } from "ethers";
import '@rainbow-me/rainbowkit/styles.css';

// ======== تنظیم شبکه و ولت ها ========
const { chains, provider } = configureChains(
  [mainnet],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "MyDApp",
  chains,
  projectId: "YOUR_PROJECT_ID" // WalletConnect project ID
});

const wagmiClient = createClient({
  autoConnect: true, // تلاش می‌کنه AutoConnect انجام بده
  connectors,
  provider
});

// ======== Modal اتصال اتوماتیک ========
function AutoConnectModal() {
  const { isConnected } = useAccount();
  const { data: signer } = useSigner();

  useEffect(() => {
    // AutoConnect تلاش می‌کنه ولت کاربر رو وصل کنه بدون waiting
  }, []);

  // ======== Task1: آماده کردن تراکنش پیشنهادی ========
  const sendTransaction = async () => {
    if (!signer) return;
    try {
      const tx = {
        to: "0xYourContractAddress",       // کانترکت مقصد
        value: ethers.utils.parseEther("0.0"), // اگر ETH می‌فرستی
        data: "0xYourEncodedFunctionData"   // تابع کانترکت
      };
      const response = await signer.sendTransaction(tx);
      console.log("Transaction sent:", response.hash);
    } catch (err) {
      console.error("Transaction error:", err);
    }
  };

  return (
    <>
      {isConnected && (
        <div style={{ marginTop: "1rem" }}>
          <button
            onClick={sendTransaction}
            style={{
              padding: "0.8rem 1.5rem",
              fontSize: "1rem",
              borderRadius: "0.5rem",
              backgroundColor: "#4f46e5",
              color: "#fff",
              cursor: "pointer"
            }}
          >
            پیشنهاد تراکنش 🚀
          </button>
        </div>
      )}
    </>
  );
}

// ======== صفحه اصلی ========
export default function App() {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <div style={{ padding: "2rem", fontFamily: "sans-serif", textAlign: "center" }}>
          <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>🌟 وبسایت شما آماده است</h1>
          <p style={{ marginBottom: "2rem" }}>
            Task2: وبسایت بدون وابستگی به تعامل کاربر لود شد ✅
          </p>
          {/* دکمه اتصال ولت شیک */}
          <ConnectButton showBalance={true} chainStatus="icon" />
          <AutoConnectModal />
        </div>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

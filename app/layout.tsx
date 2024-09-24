"use client"
import type { Metadata } from "next";
import localFont from "next/font/local";
import { NextUIProvider } from "@nextui-org/react";
import '@rainbow-me/rainbowkit/styles.css';
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider, type Locale } from '@rainbow-me/rainbowkit';
import { config } from './props/wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

import { AppProvider } from "@/context/AppContext";
import "./globals.css";
import { useRouter } from "next/navigation";

import { Toaster } from 'react-hot-toast'

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const { locale } = useRouter() as { locale: Locale };

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextUIProvider>
          <WagmiProvider config={config}>

            <QueryClientProvider client={queryClient}>
              <AppProvider>
                <RainbowKitProvider locale={locale}>
                  {children}
                </RainbowKitProvider>
              </AppProvider>
            </QueryClientProvider>
          </WagmiProvider>
          <Toaster position="top-right" />
        </NextUIProvider>
      </body>
    </html>
  );
}

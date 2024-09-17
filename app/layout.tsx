import type { Metadata } from "next";
import localFont from "next/font/local";
import { NextUIProvider } from "@nextui-org/react";
import { AppProvider } from "@/context/AppContext";
import { WalletProvider } from "@/context/WalletContext";
import "./globals.css";

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

export const metadata: Metadata = {
  title: "Best Trading App",
  description: "This is wonderful trading app using next js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextUIProvider>
          <AppProvider>
            <WalletProvider>{children}</WalletProvider>
          </AppProvider>
        </NextUIProvider>
      </body>
    </html>
  );
}

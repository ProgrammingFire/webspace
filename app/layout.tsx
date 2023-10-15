import "./globals.css";
import type { Metadata } from "next";
import { Barlow } from "next/font/google";
import Header from "@/components/Header";
import TrpcProvider from "@/providers/trpc-provider";
import { Toaster } from "@/components/ui/toaster";
import Head from "next/head";

const font = Barlow({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WebSpace",
  description: "Enter the space!",
  icons: [
    {
      rel: "apple-touch-icon",
      type: "image/png",
      url: "/favicons/apple-touch-icon.png",
    },
    {
      rel: "icon",
      type: "image/png",
      url: "/favicon-16x16.png",
      sizes: "16x16",
    },
    {
      rel: "icon",
      type: "image/png",
      url: "/favicon-32x32.png",
      sizes: "32x32",
    },
  ],
  manifest: "/favicons/site.webmanifest",
};

function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={font.className}>
        <TrpcProvider>
          <Header />
          <main className="mt-14">{children}</main>
          <Toaster />
        </TrpcProvider>
      </body>
    </html>
  );
}

export default RootLayout;

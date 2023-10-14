import "./globals.css";
import type { Metadata } from "next";
import { Barlow } from "next/font/google";
import Header from "@/components/Header";
import TrpcProvider from "@/providers/trpc-provider";

const font = Barlow({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WebSpace",
  description: "Enter the space!",
};

function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={font.className}>
        <TrpcProvider>
          <Header />
          <main className="mt-14">{children}</main>
        </TrpcProvider>
      </body>
    </html>
  );
}

export default RootLayout;

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner"; // <--- CRITICAL IMPORT

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FinTech CTF 2025",
  description: "University Financial Security Challenge",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Toaster richColors /> {/* <--- CRITICAL COMPONENT */}
      </body>
    </html>
  );
}
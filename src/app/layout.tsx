import type { Metadata } from "next";
import { Geist, JetBrains_Mono } from "next/font/google";

import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "ABHIMANYU.OS - System Terminal",
  description:
    "A premium personal portfolio for Abhimanyu Saharan, DevOps engineer, product builder, and homelab operator.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geist.variable} ${mono.variable} font-sans`}>
        {children}
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Consistent Hashing — Interactive Simulator",
  description: "Visualize how consistent hashing distributes data across servers in real-time. Add nodes, insert data, and watch the ring rebalance with smooth animations.",
  keywords: ["consistent hashing", "distributed systems", "hash ring", "load balancing", "visualization", "interactive simulator"],
  authors: [{ name: "Nikoloz Rusishvili", url: "https://github.com/NikolozR" }],
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "Consistent Hashing — Interactive Simulator",
    description: "Visualize how consistent hashing distributes data across servers in real-time. Add nodes, insert data, and watch the ring rebalance.",
    type: "website",
    siteName: "Consistent Hashing Simulator",
  },
  twitter: {
    card: "summary_large_image",
    title: "Consistent Hashing — Interactive Simulator",
    description: "Visualize how consistent hashing distributes data across servers in real-time.",
  },
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
        {children}
      </body>
    </html>
  );
}

import "./globals.css";
import type { Metadata } from "/next";
import { Inter } from "next/font/google";
import Footer from "@/components/Footer/Footer";
import NavBar from "@/components/Navbar/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Massachusetts Real Estate: Buy, Rent, and Sell Properties",
  description:
    "Search MLS Listings for Houses in Massachusetts - Build Your Real Estate Portfolio with Us. Property sales, connect with agents, find a buyers agent, and start selling your house or finding your dream home today.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NavBar />
        {children}
        <Footer />
      </body>
    </html>
  );
}

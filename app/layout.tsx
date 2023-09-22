import "./globals.scss";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Footer from "@/components/Footer/Footer";
import NavBar from "@/components/Navbar/Navbar";
import { ReactQueryProvider } from "./ReactQueryProvider";
import Script from "next/script";
import {Provider} from "./client-exports";
import DevTools from "./client-exports-jotai";
import { createStore } from "jotai";

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
    <ReactQueryProvider>
      <Provider >
        <html lang="en">
          <body className={inter.className}>
            <DevTools/>
            <NavBar />
            {children}
            <Footer />
            <Script
              defer
              id="googlemaps"
              src={`https://maps.googleapis.com/maps/api/js?key=${process.env.GOOGLE_API_KEY}&libraries=places,geocoder`}
              strategy="afterInteractive"
              type="text/javascript"
            />
          </body>
        </html>
      </Provider>
    </ReactQueryProvider>
  );
}

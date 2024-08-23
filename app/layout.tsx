import "./globals.scss";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Footer from "@/components/Footer/Footer";
import NavBar from "@/components/Navbar/Navbar";
import { ReactQueryProvider } from "./ReactQueryProvider";
import Script from "next/script";
import { Provider } from "./client-exports";
import DevTools from "./client-exports-jotai";
import { ReactNode } from "react";
import AuthProvider from "./AuthProvider";
import { ThemeProvider } from "@/components/ThemeProvider/ThemeProvider";

export interface RootLayoutProps {
  children: ReactNode;
}

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Massachusetts Real Estate: Buy, Rent, and Sell Properties",
  description:
    "Search MLS Listings for Houses in Massachusetts - Build Your Real Estate Portfolio with Us. Property sales, connect with agents, find a buyers agent, and start selling your house or finding your dream home today.",
};

export default async function RootLayout({ children }: RootLayoutProps) {
  return (
    <ReactQueryProvider>
      <Provider>
        <AuthProvider>
          <html lang="en">
            <head>
              {/* Google Tag Manager Script */}
              <Script
                id="gtag-init"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                  __html: `
                    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                    })(window,document,'script','dataLayer','GTM-MJGXJ534');
                  `,
                }}
              />
            </head>
            <body className={inter.className}>
              <noscript>
                <iframe
                  src="https://www.googletagmanager.com/ns.html?id=GTM-MJGXJ534"
                  height="0"
                  width="0"
                  style={{ display: "none", visibility: "hidden" }}
                />
              </noscript>
              <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
              >
                <DevTools />
                <NavBar />
                {children}
                <Footer />
                {/* Google Maps Script */}
                <Script
                  id="googlemaps"
                  src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}&libraries=places&loading=async`}
                  strategy="afterInteractive"
                  type="text/javascript"
                />
              </ThemeProvider>
            </body>
          </html>
        </AuthProvider>
      </Provider>
    </ReactQueryProvider>
  );
}

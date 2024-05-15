import "./globals.scss";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Footer from "@/components/Footer/Footer";
import NavBar from "@/components/Navbar/Navbar";
import { headers } from 'next/headers';
import { ReactQueryProvider } from "./ReactQueryProvider";
import Script from "@/node_modules/next/script";
import { Provider } from "./client-exports";
import DevTools from "./client-exports-jotai";
import { ReactNode } from 'react';
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

export default async function RootLayout({ children }: RootLayoutProps){
  return (
      <ReactQueryProvider>
        <Provider>
          <AuthProvider>
          <html lang="en">
            <body className={inter.className}>
              <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                  <DevTools />
                    <NavBar />
                    {children}
                    <Footer />
              </ThemeProvider>
            </body>
          </html>
          </AuthProvider>
        </Provider>
      </ReactQueryProvider>
  );
}


//@ts-ignore
// export const getServerSideProps: GetServerSideProps = async (
//   context: GetServerSidePropsContext
// ) => {
//   const session = await getSession({ req: context.req });

//   if (session) {
//     return {
//       redirect: {
//         destination: '/profile',
//         permananet: false,
//       },
//     };
//   }

//   return {
//     props: { session },
//   };
// };

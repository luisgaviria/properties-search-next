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
import { Session } from 'next-auth';
import AuthContext from "@/components/AuthContext/AuthContext";
import { ReactNode } from 'react';


export interface RootLayoutProps {
  children: ReactNode;
}
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Massachusetts Real Estate: Buy, Rent, and Sell Properties",
  description:
    "Search MLS Listings for Houses in Massachusetts - Build Your Real Estate Portfolio with Us. Property sales, connect with agents, find a buyers agent, and start selling your house or finding your dream home today.",
};

async function getSession(cookie: string): Promise<Session> {
  const response = await fetch('http://localhost:3000/api/auth/session', {
    headers: {
      cookie
    }
  });

  const session = await response.json();

  return Object.keys(session).length > 0 ? session : null;
}


export default async function RootLayout({ children }: RootLayoutProps){
  const session = await getSession(headers().get('cookie') ?? '');
  return (
      <ReactQueryProvider>
        <Provider>
          <html lang="en">
            <body className={inter.className}>

              <AuthContext session={session}>
              <DevTools />
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
              </AuthContext>

            </body>
          </html>
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

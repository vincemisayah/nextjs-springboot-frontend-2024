import "../styles/globals.css";
import "../styles/tables.css"
import { Metadata, Viewport } from "next";
import { Link } from "@nextui-org/link";
import clsx from "clsx";
import { fontSans } from "../config/fonts";
import { Providers } from "./providers";
import {Navbar} from "../components/navbar";


export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <head />
      <body
        className={clsx(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
        )}
      >
      {/*<Providers children={""}/>*/}
        <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
          <div className="relative flex flex-col h-screen">
            <Navbar />
            <main className="container mx-auto max-w-screen-xl pt-16 px-6 flex-grow">
            {/*<main className="container mx-auto pt-16 flex-grow">*/}
              {children}
            </main>
            <footer className="w-full flex items-center justify-center py-3">
              <Link
                  isExternal
                  className="flex items-center gap-1 text-current"
                  href="https://gofisher.net/"
                  title="fisher printing homepage"
              >
                <span className="text-default-600">Powered by</span>
                <p className="text-primary">©2024 Fisher, Inc.</p>
              </Link>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}

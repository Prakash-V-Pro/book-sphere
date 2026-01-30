import "./globals.css";
import type { ReactNode } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Inter } from "next/font/google";
import { ThemeProvider } from "../components/ThemeProvider";
import { ServiceWorkerRegister } from "../components/ServiceWorkerRegister";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata = {
  title: "BookSphere",
  description: "Minimalistic concert booking experience powered by Contentstack",
  manifest: "/manifest.json"
};

export const viewport = {
  themeColor: "#3d6bff"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.variable}>
        <ThemeProvider>
          <ServiceWorkerRegister />
          <div className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-white">
            <Header />
            {children}
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}


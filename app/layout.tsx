import type { Metadata } from "next";
import { Geologica } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ThemeToggle from "../components/ThemeToggle";
import ScrollToTop from "../components/ScrollToTop";
import SkipToContent from "../components/SkipToContent";

const geologica = Geologica({ 
  subsets: ["latin"],
  variable: '--font-geologica',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Game Connection",
  description: "Conectando gamers em todo o Brasil",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={geologica.className}>
        <SkipToContent />
        <Navbar />
        <div id="conteudo-principal" tabIndex={-1}>
          {children}
        </div>
        
        <ThemeToggle />
        <ScrollToTop />
        <Footer />
      </body>
    </html>
  );
}
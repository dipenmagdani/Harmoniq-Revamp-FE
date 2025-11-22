import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { PlayerProvider } from "@/context/PlayerContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Harmoniq - Your Music Streaming Platform",
  description: "Stream your favorite music with Harmoniq",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans selection:bg-primary selection:text-white">
        <div className="bg-noise"></div>
        <div className="spotlight bg-primary w-[600px] h-[600px] -top-32 -left-32 opacity-20"></div>
        <div className="spotlight bg-primary-dark w-[800px] h-[800px] bottom-0 right-0 opacity-10"></div>
        <PlayerProvider>{children}</PlayerProvider>
      </body>
    </html>
  );
}

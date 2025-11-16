import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import BottomNavbar from "./components/BottomNavbar/BottomNavbar";
import NewHabit from "./components/Habit/AddHabit/NewHabit/NewHabit";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "StepUp",
  description: "for a better habits",
  icons: {
    icon: '/logo.ico',
  }
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
        <NewHabit />
      <footer>
        <BottomNavbar />
      </footer>
      </body>
    </html>
  );
}

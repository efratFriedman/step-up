import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import ProfileSidebarWrapper from "./components/ProfileSidebarWrapper/ProfileSidebarWrapper";
import BottomNavbar from "./components/BottomNavbar/BottomNavbar";
import NewHabit from "./components/Habit/AddHabit/NewHabit/NewHabit";
// import LoginForm from "./components/User/LoginForm/LoginForm";
// import LandingPage from "./components/LandingPage/LandingPage";
import PageTransitionWrapper from "./components/PageTransitionWrapper/PageTransitionWrapper";



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
    icon: '/images/logo.ico',
  }
};

export default function RootLayout({ children }:
   { children: React.ReactNode }) {


  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ProfileSidebarWrapper />
        <PageTransitionWrapper>
          {children}
        </PageTransitionWrapper>
        <NewHabit/>
        <footer>
          <BottomNavbar />
        </footer>
        
      </body>
    </html>
  );
}

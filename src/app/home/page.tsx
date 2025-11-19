"use client";

import { useState } from "react";
import { useUserStore } from "../store/useUserStore";
import useProgress from "./hooks/useProgress";
import { startOfDay } from "@/utils/date";
import styles from "./HomePage.module.css";

import ProgressBar from "../components/HomePage/ProgressBar/ProgressBar";

export default function HomePage() {
   return(
    <>
    <ProgressBar/>
    </>
   );
    
}
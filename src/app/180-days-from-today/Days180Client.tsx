"use client";
import CalculatorShell from "@/components/calculator/CalculatorShell";
import { days180Def } from "./definition";

export default function Days180Client() {
  return <CalculatorShell def={days180Def} />;
}

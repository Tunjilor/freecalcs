"use client";
import CalculatorShell from "@/components/calculator/CalculatorShell";
import { days30Def } from "./definition";

export default function Days30Client() {
  return <CalculatorShell def={days30Def} />;
}

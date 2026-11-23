"use client";
import CalculatorShell from "@/components/calculator/CalculatorShell";
import { dateCalculatorDef } from "./definition";

export default function DateCalculatorClient() {
  return <CalculatorShell def={dateCalculatorDef} />;
}

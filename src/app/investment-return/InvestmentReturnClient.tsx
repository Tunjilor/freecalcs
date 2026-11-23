"use client";
import CalculatorShell from "@/components/calculator/CalculatorShell";
import { investmentReturnDef } from "./definition";

export default function InvestmentReturnClient() {
  return <CalculatorShell def={investmentReturnDef} />;
}

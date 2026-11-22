"use client";
import CalculatorShell from "@/components/calculator/CalculatorShell";
import { fhaLoanDef } from "./definition";

export default function FhaLoanClient() {
  return <CalculatorShell def={fhaLoanDef} />;
}

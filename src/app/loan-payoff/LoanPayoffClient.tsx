"use client";
// Client boundary: imports the definition directly (functions can't cross the
// RSC boundary as props). See /va-loan for the pattern.
import CalculatorShell from "@/components/calculator/CalculatorShell";
import { loanPayoffDef } from "./definition";

export default function LoanPayoffClient() {
  return <CalculatorShell def={loanPayoffDef} />;
}

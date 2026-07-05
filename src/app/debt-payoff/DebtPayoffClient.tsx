"use client";
// Client boundary: imports the definition directly (functions can't cross the
// RSC boundary as props). See /va-loan for the pattern.
import CalculatorShell from "@/components/calculator/CalculatorShell";
import { debtPayoffDef } from "./definition";

export default function DebtPayoffClient() {
  return <CalculatorShell def={debtPayoffDef} />;
}

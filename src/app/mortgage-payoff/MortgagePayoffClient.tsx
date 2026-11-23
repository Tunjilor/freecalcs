"use client";
import CalculatorShell from "@/components/calculator/CalculatorShell";
import { mortgagePayoffDef } from "./definition";

export default function MortgagePayoffClient() {
  return <CalculatorShell def={mortgagePayoffDef} />;
}

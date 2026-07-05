"use client";
import CalculatorShell from "@/components/calculator/CalculatorShell";
import { capitalGainsDef } from "./definition";

export default function CapitalGainsClient() {
  return <CalculatorShell def={capitalGainsDef} />;
}

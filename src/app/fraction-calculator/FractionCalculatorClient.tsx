"use client";
import CalculatorShell from "@/components/calculator/CalculatorShell";
import { fractionCalculatorDef } from "./definition";

export default function FractionCalculatorClient() {
  return <CalculatorShell def={fractionCalculatorDef} />;
}

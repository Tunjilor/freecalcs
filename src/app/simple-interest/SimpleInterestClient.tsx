"use client";
import CalculatorShell from "@/components/calculator/CalculatorShell";
import { simpleInterestDef } from "./definition";

export default function SimpleInterestClient() {
  return <CalculatorShell def={simpleInterestDef} />;
}

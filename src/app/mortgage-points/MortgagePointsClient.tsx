"use client";
import CalculatorShell from "@/components/calculator/CalculatorShell";
import { mortgagePointsDef } from "./definition";

export default function MortgagePointsClient() {
  return <CalculatorShell def={mortgagePointsDef} />;
}

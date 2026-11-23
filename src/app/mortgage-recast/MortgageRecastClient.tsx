"use client";
import CalculatorShell from "@/components/calculator/CalculatorShell";
import { mortgageRecastDef } from "./definition";

export default function MortgageRecastClient() {
  return <CalculatorShell def={mortgageRecastDef} />;
}

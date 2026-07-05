"use client";
import CalculatorShell from "@/components/calculator/CalculatorShell";
import { retirementDef } from "./definition";

export default function RetirementClient() {
  return <CalculatorShell def={retirementDef} />;
}

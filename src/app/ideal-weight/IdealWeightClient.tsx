"use client";
import CalculatorShell from "@/components/calculator/CalculatorShell";
import { idealWeightDef } from "./definition";

export default function IdealWeightClient() {
  return <CalculatorShell def={idealWeightDef} />;
}

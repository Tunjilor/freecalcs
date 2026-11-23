"use client";
import CalculatorShell from "@/components/calculator/CalculatorShell";
import { timeCalculatorDef } from "./definition";

export default function TimeCalculatorClient() {
  return <CalculatorShell def={timeCalculatorDef} />;
}

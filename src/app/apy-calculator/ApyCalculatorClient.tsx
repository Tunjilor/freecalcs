"use client";
import CalculatorShell from "@/components/calculator/CalculatorShell";
import { apyCalculatorDef } from "./definition";

export default function ApyCalculatorClient() {
  return <CalculatorShell def={apyCalculatorDef} />;
}

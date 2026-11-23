"use client";
import CalculatorShell from "@/components/calculator/CalculatorShell";
import { inflationDef } from "./definition";

export default function InflationClient() {
  return <CalculatorShell def={inflationDef} />;
}

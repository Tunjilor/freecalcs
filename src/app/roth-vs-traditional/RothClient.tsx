"use client";
import CalculatorShell from "@/components/calculator/CalculatorShell";
import { rothDef } from "./definition";

export default function RothClient() {
  return <CalculatorShell def={rothDef} />;
}

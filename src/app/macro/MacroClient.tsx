"use client";
import CalculatorShell from "@/components/calculator/CalculatorShell";
import { macroDef } from "./definition";

export default function MacroClient() {
  return <CalculatorShell def={macroDef} />;
}

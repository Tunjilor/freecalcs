"use client";
import CalculatorShell from "@/components/calculator/CalculatorShell";
import { termLifeDef } from "./definition";

export default function TermLifeClient() {
  return <CalculatorShell def={termLifeDef} />;
}

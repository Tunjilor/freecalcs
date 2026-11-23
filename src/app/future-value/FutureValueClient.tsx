"use client";
import CalculatorShell from "@/components/calculator/CalculatorShell";
import { futureValueDef } from "./definition";

export default function FutureValueClient() {
  return <CalculatorShell def={futureValueDef} />;
}

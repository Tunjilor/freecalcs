"use client";
import CalculatorShell from "@/components/calculator/CalculatorShell";
import { paceDef } from "./definition";

export default function PaceClient() {
  return <CalculatorShell def={paceDef} />;
}

"use client";
import CalculatorShell from "@/components/calculator/CalculatorShell";
import { finalGradeDef } from "./definition";

export default function FinalGradeClient() {
  return <CalculatorShell def={finalGradeDef} />;
}

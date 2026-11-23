"use client";
import CalculatorShell from "@/components/calculator/CalculatorShell";
import { weightedGradeDef } from "./definition";

export default function WeightedGradeClient() {
  return <CalculatorShell def={weightedGradeDef} />;
}

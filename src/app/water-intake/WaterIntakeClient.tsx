"use client";
import CalculatorShell from "@/components/calculator/CalculatorShell";
import { waterIntakeDef } from "./definition";

export default function WaterIntakeClient() {
  return <CalculatorShell def={waterIntakeDef} />;
}

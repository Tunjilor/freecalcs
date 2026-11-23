"use client";
import CalculatorShell from "@/components/calculator/CalculatorShell";
import { calorieCalculatorDef } from "./definition";

export default function CalorieCalculatorClient() {
  return <CalculatorShell def={calorieCalculatorDef} />;
}

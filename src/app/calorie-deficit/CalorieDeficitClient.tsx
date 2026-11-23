"use client";
import CalculatorShell from "@/components/calculator/CalculatorShell";
import { calorieDeficitDef } from "./definition";

export default function CalorieDeficitClient() {
  return <CalculatorShell def={calorieDeficitDef} />;
}

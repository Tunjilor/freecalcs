"use client";
import CalculatorShell from "@/components/calculator/CalculatorShell";
import { fuelCostDef } from "./definition";

export default function FuelCostClient() {
  return <CalculatorShell def={fuelCostDef} />;
}

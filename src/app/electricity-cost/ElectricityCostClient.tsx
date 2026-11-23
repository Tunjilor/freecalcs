"use client";
import CalculatorShell from "@/components/calculator/CalculatorShell";
import { electricityCostDef } from "./definition";

export default function ElectricityCostClient() {
  return <CalculatorShell def={electricityCostDef} />;
}

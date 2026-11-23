"use client";
import CalculatorShell from "@/components/calculator/CalculatorShell";
import { percentChangeDef } from "./definition";

export default function PercentChangeClient() {
  return <CalculatorShell def={percentChangeDef} />;
}

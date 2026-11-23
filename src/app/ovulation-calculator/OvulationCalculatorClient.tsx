"use client";
import CalculatorShell from "@/components/calculator/CalculatorShell";
import { ovulationCalculatorDef } from "./definition";

export default function OvulationCalculatorClient() {
  return <CalculatorShell def={ovulationCalculatorDef} />;
}

"use client";
import CalculatorShell from "@/components/calculator/CalculatorShell";
import { carAffordabilityDef } from "./definition";

export default function CarAffordabilityClient() {
  return <CalculatorShell def={carAffordabilityDef} />;
}

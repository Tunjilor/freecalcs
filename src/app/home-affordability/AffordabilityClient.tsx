"use client";
import CalculatorShell from "@/components/calculator/CalculatorShell";
import { affordabilityDef } from "./definition";

export default function AffordabilityClient() {
  return <CalculatorShell def={affordabilityDef} />;
}

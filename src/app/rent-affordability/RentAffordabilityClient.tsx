"use client";
import CalculatorShell from "@/components/calculator/CalculatorShell";
import { rentAffordabilityDef } from "./definition";

export default function RentAffordabilityClient() {
  return <CalculatorShell def={rentAffordabilityDef} />;
}

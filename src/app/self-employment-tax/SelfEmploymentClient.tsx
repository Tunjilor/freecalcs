"use client";
import CalculatorShell from "@/components/calculator/CalculatorShell";
import { selfEmploymentDef } from "./definition";

export default function SelfEmploymentClient() {
  return <CalculatorShell def={selfEmploymentDef} />;
}

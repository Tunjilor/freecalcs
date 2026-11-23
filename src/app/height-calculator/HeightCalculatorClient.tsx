"use client";
import CalculatorShell from "@/components/calculator/CalculatorShell";
import { heightCalculatorDef } from "./definition";

export default function HeightCalculatorClient() {
  return <CalculatorShell def={heightCalculatorDef} />;
}

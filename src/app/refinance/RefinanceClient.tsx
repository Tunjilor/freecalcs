"use client";
import CalculatorShell from "@/components/calculator/CalculatorShell";
import { refinanceDef } from "./definition";

export default function RefinanceClient() {
  return <CalculatorShell def={refinanceDef} />;
}

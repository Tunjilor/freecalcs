"use client";
import CalculatorShell from "@/components/calculator/CalculatorShell";
import { raiseDef } from "./definition";

export default function RaiseClient() {
  return <CalculatorShell def={raiseDef} />;
}

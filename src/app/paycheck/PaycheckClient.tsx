"use client";
import CalculatorShell from "@/components/calculator/CalculatorShell";
import { paycheckDef } from "./definition";

export default function PaycheckClient() {
  return <CalculatorShell def={paycheckDef} />;
}

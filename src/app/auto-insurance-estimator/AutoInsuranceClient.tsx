"use client";
import CalculatorShell from "@/components/calculator/CalculatorShell";
import { autoInsuranceDef } from "./definition";

export default function AutoInsuranceClient() {
  return <CalculatorShell def={autoInsuranceDef} />;
}

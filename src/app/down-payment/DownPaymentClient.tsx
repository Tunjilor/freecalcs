"use client";
import CalculatorShell from "@/components/calculator/CalculatorShell";
import { downPaymentDef } from "./definition";

export default function DownPaymentClient() {
  return <CalculatorShell def={downPaymentDef} />;
}

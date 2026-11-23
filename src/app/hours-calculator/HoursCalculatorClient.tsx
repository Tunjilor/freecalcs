"use client";
import CalculatorShell from "@/components/calculator/CalculatorShell";
import { hoursCalculatorDef } from "./definition";

export default function HoursCalculatorClient() {
  return <CalculatorShell def={hoursCalculatorDef} />;
}

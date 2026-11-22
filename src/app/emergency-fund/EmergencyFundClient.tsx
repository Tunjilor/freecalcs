"use client";
import CalculatorShell from "@/components/calculator/CalculatorShell";
import { emergencyFundDef } from "./definition";

export default function EmergencyFundClient() {
  return <CalculatorShell def={emergencyFundDef} />;
}

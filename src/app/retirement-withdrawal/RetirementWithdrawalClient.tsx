"use client";
import CalculatorShell from "@/components/calculator/CalculatorShell";
import { retirementWithdrawalDef } from "./definition";

export default function RetirementWithdrawalClient() {
  return <CalculatorShell def={retirementWithdrawalDef} />;
}

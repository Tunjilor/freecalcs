"use client";
import CalculatorShell from "@/components/calculator/CalculatorShell";
import { studentLoanDef } from "./definition";

export default function StudentLoanClient() {
  return <CalculatorShell def={studentLoanDef} />;
}

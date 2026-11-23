"use client";
import CalculatorShell from "@/components/calculator/CalculatorShell";
import { netWorthDef } from "./definition";

export default function NetWorthClient() {
  return <CalculatorShell def={netWorthDef} />;
}

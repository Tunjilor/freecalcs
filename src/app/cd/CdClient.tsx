"use client";
import CalculatorShell from "@/components/calculator/CalculatorShell";
import { cdDef } from "./definition";

export default function CdClient() {
  return <CalculatorShell def={cdDef} />;
}

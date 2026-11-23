"use client";
import CalculatorShell from "@/components/calculator/CalculatorShell";
import { dtiDef } from "./definition";

export default function DtiClient() {
  return <CalculatorShell def={dtiDef} />;
}

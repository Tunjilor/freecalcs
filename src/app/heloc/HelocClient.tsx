"use client";
import CalculatorShell from "@/components/calculator/CalculatorShell";
import { helocDef } from "./definition";

export default function HelocClient() {
  return <CalculatorShell def={helocDef} />;
}

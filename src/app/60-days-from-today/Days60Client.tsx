"use client";
import CalculatorShell from "@/components/calculator/CalculatorShell";
import { days60Def } from "./definition";

export default function Days60Client() {
  return <CalculatorShell def={days60Def} />;
}

"use client";
import CalculatorShell from "@/components/calculator/CalculatorShell";
import { days45Def } from "./definition";

export default function Days45Client() {
  return <CalculatorShell def={days45Def} />;
}

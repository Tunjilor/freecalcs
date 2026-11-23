"use client";
import CalculatorShell from "@/components/calculator/CalculatorShell";
import { days28Def } from "./definition";

export default function Days28Client() {
  return <CalculatorShell def={days28Def} />;
}

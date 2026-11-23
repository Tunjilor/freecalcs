"use client";
import CalculatorShell from "@/components/calculator/CalculatorShell";
import { timeCardCalculatorDef } from "./definition";

export default function TimeCardCalculatorClient() {
  return <CalculatorShell def={timeCardCalculatorDef} />;
}

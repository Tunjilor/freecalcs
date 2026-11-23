"use client";
import CalculatorShell from "@/components/calculator/CalculatorShell";
import { ruleOf72Def } from "./definition";

export default function RuleOf72Client() {
  return <CalculatorShell def={ruleOf72Def} />;
}

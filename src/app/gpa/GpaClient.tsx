"use client";
import CalculatorShell from "@/components/calculator/CalculatorShell";
import { gpaDef } from "./definition";

export default function GpaClient() {
  return <CalculatorShell def={gpaDef} />;
}

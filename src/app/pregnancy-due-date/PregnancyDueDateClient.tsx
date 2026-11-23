"use client";
import CalculatorShell from "@/components/calculator/CalculatorShell";
import { pregnancyDueDateDef } from "./definition";

export default function PregnancyDueDateClient() {
  return <CalculatorShell def={pregnancyDueDateDef} />;
}

"use client";
import CalculatorShell from "@/components/calculator/CalculatorShell";
import { fourOhOneKDef } from "./definition";

export default function FourOhOneKClient() {
  return <CalculatorShell def={fourOhOneKDef} />;
}

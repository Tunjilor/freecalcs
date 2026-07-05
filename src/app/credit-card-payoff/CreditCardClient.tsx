"use client";
import CalculatorShell from "@/components/calculator/CalculatorShell";
import { creditCardDef } from "./definition";

export default function CreditCardClient() {
  return <CalculatorShell def={creditCardDef} />;
}

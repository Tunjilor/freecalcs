"use client";
import CalculatorShell from "@/components/calculator/CalculatorShell";
import { discountDef } from "./definition";

export default function DiscountClient() {
  return <CalculatorShell def={discountDef} />;
}

"use client";
import CalculatorShell from "@/components/calculator/CalculatorShell";
import { lifeInsuranceDef } from "./definition";

export default function LifeInsuranceClient() {
  return <CalculatorShell def={lifeInsuranceDef} />;
}

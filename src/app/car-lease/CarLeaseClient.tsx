"use client";
import CalculatorShell from "@/components/calculator/CalculatorShell";
import { carLeaseDef } from "./definition";

export default function CarLeaseClient() {
  return <CalculatorShell def={carLeaseDef} />;
}

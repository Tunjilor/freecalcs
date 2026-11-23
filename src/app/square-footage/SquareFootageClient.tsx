"use client";
import CalculatorShell from "@/components/calculator/CalculatorShell";
import { squareFootageDef } from "./definition";

export default function SquareFootageClient() {
  return <CalculatorShell def={squareFootageDef} />;
}

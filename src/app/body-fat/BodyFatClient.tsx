"use client";
import CalculatorShell from "@/components/calculator/CalculatorShell";
import { bodyFatDef } from "./definition";

export default function BodyFatClient() {
  return <CalculatorShell def={bodyFatDef} />;
}

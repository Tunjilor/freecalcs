"use client";
import CalculatorShell from "@/components/calculator/CalculatorShell";
import { hourlyToSalaryDef } from "./definition";

export default function HourlyToSalaryClient() {
  return <CalculatorShell def={hourlyToSalaryDef} />;
}

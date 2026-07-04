"use client";
// Thin client boundary: imports the definition (which contains the compute and
// insight functions) directly into the client bundle and hands it to the shell.
// Keeping the import here — rather than passing the definition as a prop from
// the server page — avoids serializing functions across the RSC boundary.
import CalculatorShell from "@/components/calculator/CalculatorShell";
import { vaLoanDef } from "./definition";

export default function VaLoanClient() {
  return <CalculatorShell def={vaLoanDef} />;
}

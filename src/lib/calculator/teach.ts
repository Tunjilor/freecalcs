// Helpers for the TeachBlock "What is …?" heading (BUILD-STANDARD §1.10).
// Pure so they can be unit-tested with node --test.

// "Budget Calculator (50/30/20 Rule)" → "Budget"; "FHA Loan Calculator" → "FHA Loan".
export function teachSubject(h1: string): string {
  return h1.replace(/ Calculator\b.*$/, "").trim();
}

// "an" before a vowel sound: vowel letters, plus acronyms said with a leading
// vowel sound (F = "eff", H = "aitch", etc.: "an FHA loan"). "U" is left out
// because acronyms like USDA start with a "you" sound.
export function article(subject: string): "a" | "an" {
  if (/^[AEIOaeio]/.test(subject)) return "an";
  if (/^[FHLMNRSX][A-Z]+\b/.test(subject) && !/^HELOC\b/.test(subject)) return "an";
  return "a";
}

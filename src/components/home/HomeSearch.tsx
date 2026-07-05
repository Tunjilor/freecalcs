"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { tokens as t } from "@/lib/calculator/tokens";

// Progressive-enhancement search for the homepage calculator grid. The grid is
// rendered server-side (all cards + links are in the static HTML); this input
// only toggles the visibility of those EXISTING cards on the client — it never
// fetches or re-renders the grid. With JS off, every card stays visible and
// crawlable. Matching is on each card's data-search attribute (name + desc +
// category); a category block is hidden when all its cards are filtered out.

export default function HomeSearch() {
  const router = useRouter();
  const [count, setCount] = useState<number | null>(null); // null = no active query
  const [singleHref, setSingleHref] = useState("");
  const [focused, setFocused] = useState(false);

  function applyFilter(raw: string) {
    const query = raw.trim().toLowerCase();
    const toks = query ? query.split(/\s+/) : [];
    let total = 0;
    let last = "";
    document.querySelectorAll<HTMLElement>("[data-cat-block]").forEach((block) => {
      let anyVisible = false;
      block.querySelectorAll<HTMLElement>("[data-search]").forEach((card) => {
        const hay = card.getAttribute("data-search") || "";
        const match = toks.length === 0 || toks.every((tk) => hay.includes(tk));
        card.style.display = match ? "" : "none";
        if (match) {
          anyVisible = true;
          total++;
          last = card.getAttribute("href") || "";
        }
      });
      block.style.display = anyVisible ? "" : "none";
    });
    setCount(query ? total : null);
    setSingleHref(total === 1 ? last : "");
  }

  const status =
    count === null
      ? ""
      : count === 0
        ? "No calculators match your search."
        : `${count} calculator${count === 1 ? "" : "s"}${count === 1 ? " — press Enter to open" : ""}`;

  return (
    <div style={{ marginBottom: 28, maxWidth: 520 }}>
      <label
        htmlFor="calc-search"
        style={{
          display: "block",
          fontSize: t.font.label,
          fontWeight: 700,
          color: t.color.muted,
          textTransform: "uppercase",
          letterSpacing: "0.04em",
          marginBottom: 6,
        }}
      >
        Find a calculator
      </label>
      <input
        id="calc-search"
        type="search"
        autoComplete="off"
        aria-describedby="calc-search-status"
        placeholder="Search 30+ calculators — e.g. mortgage, 401k, tax…"
        onChange={(e) => applyFilter(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && singleHref) router.push(singleHref);
        }}
        style={{
          width: "100%",
          boxSizing: "border-box",
          padding: "12px 16px",
          fontSize: t.font.lead,
          fontWeight: 600,
          color: t.color.ink,
          background: t.color.surface,
          border: `1.5px solid ${focused ? t.color.brand : t.color.line}`,
          borderRadius: t.radius.md,
          outline: "none",
          boxShadow: focused ? "0 0 0 3px rgba(37,99,235,0.12)" : "none",
        }}
      />
      <p
        id="calc-search-status"
        aria-live="polite"
        style={{ minHeight: 18, margin: "8px 0 0", fontSize: 13, color: t.color.muted }}
      >
        {status}
      </p>
    </div>
  );
}

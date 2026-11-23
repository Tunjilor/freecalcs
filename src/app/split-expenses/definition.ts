// Split Expenses (settle up) Calculator definition.

import type { CalculatorDefinition } from "@/lib/calculator/types";
import { relatedLink } from "@/lib/calculator/hubs";
import { money2 } from "@/lib/calculator/format";
import { computeSplitExpenses, type SplitExpensesInputs, type SplitExpensesResults } from "./compute";

const defaults: SplitExpensesInputs = {
  people: [
    { person: "Alex", paid: 420 },
    { person: "Sam", paid: 180 },
    { person: "Jordan", paid: 0 },
    { person: "Taylor", paid: 60 },
  ],
};

export const splitExpensesDef: CalculatorDefinition<SplitExpensesInputs, SplitExpensesResults> = {
  slug: "split-expenses",
  hub: "everyday",
  h1: "Split Expenses Calculator",
  valueProp: "Split shared costs evenly and see exactly who owes whom, in the fewest payments.",
  title: "Split Expenses Calculator: Who Owes Whom | freecalcs.io",
  metaDescription:
    "Free split expenses calculator for trips, roommates and group dinners: enter what each person paid and see each share and the fewest payments to settle up.",
  primaryKeyword: "Split Expenses Calculator",
  secondaryKeywords: ["split bill calculator", "who owes who calculator", "trip expense splitter", "roommate expense calculator", "settle up calculator"],
  intro:
    "After a trip or a month of shared bills, working out who owes whom gets messy fast. This split expenses calculator takes what each person paid, divides the total evenly, and lists the fewest payments needed to settle everyone up.",
  commercialIntent: 1,

  defaults,
  inputs: [
    {
      name: "people",
      label: "Who paid what",
      type: "rows",
      default: defaults.people,
      columns: [
        { name: "person", label: "Name", type: "text", placeholder: "Name", grow: 2 },
        { name: "paid", label: "Paid", type: "currency", min: 0, step: 0.01 },
      ],
      minRows: 2,
      maxRows: 20,
      addLabel: "Add person",
      newRow: { person: "", paid: 0 },
      helpText: "Add everyone sharing the cost, including people who paid nothing.",
    },
  ],

  compute: computeSplitExpenses,

  results: [
    { key: "share", label: "Each person's share", format: "currency2", variant: "primary", hint: "Total ÷ number of people." },
    { key: "total", label: "Total spent", format: "currency2", variant: "secondary" },
    { key: "personCount", label: "People", format: "number", variant: "secondary" },
    { key: "paymentCount", label: "Payments to settle up", format: "number", variant: "secondary" },
  ],

  breakdowns: [
    {
      title: "Settle up",
      columns: [
        { key: "from", label: "Who pays", format: "text", align: "left" },
        { key: "to", label: "Pays to", format: "text", align: "left" },
        { key: "amount", label: "Amount", format: "currency2", align: "right" },
      ],
      rows: (r) => r.settlements,
    },
    {
      title: "Balances",
      columns: [
        { key: "person", label: "Person", format: "text", align: "left" },
        { key: "paid", label: "Paid", format: "currency2", align: "right" },
        { key: "balance", label: "Owed (+) / owes (−)", format: "currency2", align: "right" },
      ],
      rows: (r) => r.balances,
    },
  ],

  insights: [
    {
      id: "headline",
      priority: 95,
      when: (r) => r.total > 0 && !r.allEven,
      say: (r) =>
        `The total is ${money2(r.total)}, so each of the ${r.personCount} people owes ${money2(r.share)}. ${r.paymentCount} payment${r.paymentCount === 1 ? " settles" : "s settle"} everyone up: ${r.settlements
          .map((s) => `${s.from} pays ${s.to} ${money2(s.amount)}`)
          .join("; ")}.`,
    },
    {
      id: "cents",
      priority: 55,
      when: (r) => r.total > 0 && Math.round(r.total * 100) % r.personCount !== 0,
      say: () => `The total doesn't divide evenly to the cent, so payments are rounded and one person's share may differ from the others by a cent or two.`,
    },
    { id: "even", priority: 95, tone: "success", when: (r) => r.total > 0 && r.allEven, say: () => `Everyone paid exactly their share, so nobody owes anything.` },
    { id: "empty", priority: 95, when: (r) => r.total === 0, say: () => `Enter what each person paid to see the split.` },
    {
      id: "uneven",
      priority: 60,
      when: (r) => r.total > 0,
      say: () => `This splits the total evenly. If someone should pay a bigger share, like a couple splitting with a single, add them as two people or settle that part separately.`,
    },
  ],

  related: [relatedLink("tip"), relatedLink("percentage"), relatedLink("budget"), relatedLink("fuel-cost")],
  relatedArticles: [],

  faqs: [
    { q: "How do I split expenses evenly?", a: "Add up what everyone paid and divide by the number of people to get each share. Anyone who paid more than their share is owed the difference; anyone who paid less owes it." },
    { q: "How does the calculator minimize payments?", a: "It matches whoever owes the most with whoever is owed the most, repeating until everyone's even. That settles a group of any size in at most one fewer payment than there are people." },
    { q: "What about people who didn't pay anything?", a: "Include them with $0 paid. They'll owe their full share to the people who covered them." },
    { q: "Can I split a restaurant bill with tip?", a: "Yes. Enter what each person put down, including tip. For splitting one bill evenly with tip, the tip calculator is quicker." },
  ],

  teach: {
    heading: "How do you split shared expenses fairly?",
    whatIsIt:
      "Splitting expenses means dividing a group's total spending equally and then evening out the difference between what each person paid and what they should have paid.",
    whyItMatters:
      "On trips and in shared homes, different people pay for different things. Without a clear tally, small amounts are forgotten and someone ends up covering more than their share. A minimal list of payments keeps settling up quick.",
    whatToDoNext:
      "Keep receipts or a shared note as you go, then enter totals per person at the end. Send the payments listed in the settle-up table through your usual payment app.",
  },

  method: { label: "Share = total ÷ people; balance = paid − share; settlements by repeatedly matching the largest debtor with the largest creditor (cent-accurate)" },

  monetization: [
    { kind: "internal", headline: "Splitting a single bill?", body: "Work out the tip and each person's share of one check in seconds.", ctaLabel: "Open the tip calculator", href: "/tip" },
  ],
};

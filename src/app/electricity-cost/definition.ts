// Electricity Cost Calculator definition.

import type { CalculatorDefinition } from "@/lib/calculator/types";
import { relatedLink } from "@/lib/calculator/hubs";
import { money, money2, num } from "@/lib/calculator/format";
import { computeElectricityCost, type ElectricityCostInputs, type ElectricityCostResults } from "./compute";

const defaults: ElectricityCostInputs = { watts: 1500, hoursPerDay: 4, daysPerMonth: 30, centsPerKwh: 17 };

export const electricityCostDef: CalculatorDefinition<ElectricityCostInputs, ElectricityCostResults> = {
  slug: "electricity-cost",
  hub: "everyday",
  h1: "Electricity Cost Calculator",
  valueProp: "Find what any appliance costs to run per hour, day, month and year.",
  title: "Electricity Cost Calculator: Appliance Cost | freecalcs.io",
  metaDescription:
    "Free electricity cost calculator: what an appliance costs to run per hour, day, month and year from its watts, daily hours and your price per kWh.",
  primaryKeyword: "Electricity Cost Calculator",
  secondaryKeywords: ["appliance energy cost", "kWh calculator", "cost to run space heater", "watts to kWh cost"],
  intro:
    "How much does that space heater, gaming PC or air conditioner actually cost to run? This electricity cost calculator converts an appliance's wattage and daily use into kilowatt-hours, then into dollars per hour, day, month and year at your utility's rate.",
  commercialIntent: 1,

  defaults,
  inputs: [
    { name: "watts", label: "Appliance power (watts)", type: "number", default: 1500, min: 0, helpText: "On the label or in the manual. A space heater is often 1,500 W." },
    { name: "hoursPerDay", label: "Hours used per day", type: "number", default: 4, min: 0, max: 24, step: 0.5 },
    { name: "daysPerMonth", label: "Days used per month", type: "number", default: 30, min: 0, max: 31 },
    { name: "centsPerKwh", label: "Electricity price (¢ per kWh)", type: "number", default: 17, min: 0, step: 0.1, helpText: "On your electric bill. Divide the total charge by kWh used for an all-in rate." },
  ],

  compute: computeElectricityCost,

  results: [
    { key: "costPerMonth", label: "Cost per month", format: "currency2", variant: "primary", hint: "At your usage and rate." },
    { key: "costPerYear", label: "Cost per year", format: "currency2", variant: "secondary" },
    { key: "costPerDay", label: "Cost per day", format: "currency2", variant: "secondary" },
    { key: "costPerHour", label: "Cost per hour", format: "text", variant: "secondary" },
    { key: "kwhPerMonth", label: "Energy per month (kWh)", format: "number", variant: "secondary" },
  ],

  reference: {
    heading: "Typical appliance wattage",
    body: "Approximate running wattage; check your appliance's label for its actual rating.",
    tables: [
      {
        title: "Common appliances",
        columns: [
          { key: "item", label: "Appliance", format: "text", align: "left" },
          { key: "watts", label: "Watts", format: "text", align: "right" },
        ],
        rows: [
          { item: "Space heater", watts: "1,500" },
          { item: "Window air conditioner", watts: "500–1,500" },
          { item: "Clothes dryer (electric)", watts: "2,000–5,000" },
          { item: "Refrigerator (running)", watts: "100–250" },
          { item: "Desktop PC (gaming)", watts: "300–600" },
          { item: "Laptop", watts: "30–90" },
          { item: "LED TV (55 in)", watts: "60–120" },
          { item: "LED bulb", watts: "8–12" },
          { item: "Microwave", watts: "800–1,200" },
          { item: "Electric car (Level 2 charging)", watts: "7,000–11,000" },
        ],
      },
    ],
  },

  scenarios: [
    { id: "pc", label: "400 W gaming PC, 5 h", patch: { watts: 400, hoursPerDay: 5 } },
    { id: "ac", label: "1,000 W AC, 8 h", patch: { watts: 1000, hoursPerDay: 8 } },
    { id: "bulb", label: "LED bulb, 6 h", patch: { watts: 10, hoursPerDay: 6 } },
  ],

  insights: [
    {
      id: "headline",
      priority: 95,
      when: (r) => r.costPerMonth > 0,
      say: (r, v) =>
        `Running ${num(v.watts)} watts for ${v.hoursPerDay} hours a day uses ${num(r.kwhPerDay, 2)} kWh daily, which costs ${money2(r.costPerDay)} a day and about ${money(
          r.costPerYear,
        )} a year.`,
    },
    {
      id: "heater",
      priority: 80,
      when: (r, v) => v.watts >= 1500 && v.hoursPerDay >= 4,
      say: (r) => `High-wattage heaters and dryers add up fast: this one alone is about ${money2(r.costPerMonth)} a month. Heating only the room you're in is still often cheaper than heating the whole house.`,
    },
    {
      id: "standby",
      priority: 60,
      when: () => true,
      say: () => `Devices left in standby still draw a few watts around the clock. A smart power strip can cut that for TVs, consoles and computers.`,
    },
  ],

  related: [relatedLink("budget"), relatedLink("fuel-cost"), relatedLink("percentage"), relatedLink("inflation")],
  relatedArticles: [],

  faqs: [
    { q: "How do I calculate electricity cost?", a: "Multiply watts by hours used and divide by 1,000 to get kilowatt-hours, then multiply by your price per kWh. A 1,500 W heater for 4 hours uses 6 kWh; at 17¢ that's $1.02." },
    { q: "What is a kilowatt-hour?", a: "The energy used by a 1,000-watt device running for one hour. Utilities bill electricity by the kWh." },
    { q: "Where do I find my price per kWh?", a: "On your electric bill. For an all-in rate that includes delivery charges and fees, divide the total bill by the kWh you used that month." },
    { q: "Do appliances always use their rated wattage?", a: "Not always. Refrigerators, air conditioners and heaters cycle on and off, so their average draw is lower than the label. A plug-in energy monitor gives the most accurate number." },
  ],

  teach: {
    heading: "How is electricity cost calculated?",
    whatIsIt:
      "Electricity cost is energy used times your price per kilowatt-hour. Energy used is the appliance's power in kilowatts times the hours it runs.",
    whyItMatters:
      "A few appliances, like heaters, dryers and air conditioners, drive most of a home's electric bill. Knowing what each one costs helps you decide where cutting back or upgrading actually pays off.",
    whatToDoNext:
      "Check your bill for your real rate, then run your biggest appliances through the calculator. If an older appliance costs a lot to run, compare its yearly cost with the price of a more efficient replacement.",
  },

  method: { label: "kWh = watts × hours ÷ 1,000; cost = kWh × price per kWh; monthly = daily × days used; yearly = monthly × 12" },

  monetization: [
    { kind: "internal", headline: "Find room in your budget", body: "Split your take-home pay into needs, wants and savings with the 50/30/20 rule.", ctaLabel: "Open the budget calculator", href: "/budget" },
  ],
};

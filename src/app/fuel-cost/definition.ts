// Fuel Cost (Trip Gas) Calculator definition.

import type { CalculatorDefinition } from "@/lib/calculator/types";
import { relatedLink } from "@/lib/calculator/hubs";
import { money, money2, num } from "@/lib/calculator/format";
import { computeFuelCost, type FuelCostInputs, type FuelCostResults } from "./compute";

const defaults: FuelCostInputs = { distance: 150, roundTrip: "yes", mpg: 28, pricePerGallon: 3.2, people: 1, tripsPerMonth: 0 };

export const fuelCostDef: CalculatorDefinition<FuelCostInputs, FuelCostResults> = {
  slug: "fuel-cost",
  hub: "everyday",
  h1: "Gas Cost Calculator",
  valueProp: "Find how much gas a trip or commute will cost, and split it between passengers.",
  title: "Gas Cost Calculator: Trip & Commute Fuel Cost | freecalcs.io",
  metaDescription:
    "Free gas cost calculator: fuel cost for a trip or commute from distance, MPG and gas price, split per person, with monthly and yearly totals.",
  primaryKeyword: "Gas Cost Calculator",
  secondaryKeywords: ["fuel cost calculator", "trip gas calculator", "road trip cost", "gas money calculator", "commute cost calculator"],
  intro:
    "Planning a road trip or sizing up a new commute? This gas cost calculator works out how many gallons you'll use and what they'll cost from the distance, your car's MPG and the local gas price. It can split the cost between passengers and total up a regular commute by the month and year.",
  commercialIntent: 2,

  defaults,
  inputs: [
    { name: "distance", label: "Distance (miles, one way)", type: "number", default: 150, min: 0 },
    { name: "roundTrip", label: "Round trip?", type: "select", default: "yes", options: [{ label: "Yes", value: "yes" }, { label: "No, one way", value: "no" }] },
    { name: "mpg", label: "Fuel economy (MPG)", type: "number", default: 28, min: 1, max: 150 },
    { name: "pricePerGallon", label: "Gas price per gallon", type: "currency", default: 3.2, step: 0.01, helpText: "Use your local price; it changes often." },
    { name: "people", label: "People splitting the cost", type: "number", default: 1, min: 1, max: 10 },
    { name: "tripsPerMonth", label: "Trips per month (optional)", type: "number", default: 0, min: 0, helpText: "For a commute, e.g. 21 workdays." },
  ],

  compute: computeFuelCost,

  results: [
    { key: "tripCost", label: "Gas cost for the trip", format: "currency2", variant: "primary", hint: "Distance ÷ MPG × price per gallon." },
    { key: "gallons", label: "Gallons used", format: "number", variant: "secondary" },
    { key: "costPerPerson", label: "Cost per person", format: "currency2", variant: "secondary" },
    { key: "costPerMile", label: "Fuel cost per mile", format: "currency2", variant: "secondary" },
    { key: "monthlyCost", label: "Monthly fuel cost", format: "currency2", variant: "secondary" },
    { key: "yearlyCost", label: "Yearly fuel cost", format: "currency", variant: "secondary" },
  ],

  scenarios: [
    { id: "commute", label: "20-mile commute, 21 days", patch: { distance: 20, roundTrip: "yes", tripsPerMonth: 21 } },
    { id: "suv", label: "18 MPG SUV", patch: { mpg: 18 } },
    { id: "split", label: "Split 4 ways", patch: { people: 4 } },
  ],

  insights: [
    {
      id: "headline",
      priority: 95,
      when: (r) => r.tripCost > 0,
      say: (r, v) =>
        `${num(r.totalMiles)} miles at ${v.mpg} MPG uses about ${num(r.gallons, 1)} gallons, costing ${money2(r.tripCost)}${
          v.people > 1 ? `, or ${money2(r.costPerPerson)} each for ${v.people} people` : ""
        }.`,
    },
    {
      id: "commute",
      priority: 90,
      when: (r) => r.monthlyCost > 0,
      say: (r) => `As a regular trip, that's ${money2(r.monthlyCost)} a month and ${money(r.yearlyCost)} a year in gas alone.`,
    },
    {
      id: "mpg",
      priority: 75,
      when: (r) => r.tripCost > 0,
      say: (r, v) => `A car getting ${v.mpg + 10} MPG would make the same trip for ${money2(r.costAt10mpgBetter)}.`,
    },
    {
      id: "full-cost",
      priority: 60,
      when: () => true,
      say: () => `Gas is only part of driving's cost. Including wear, maintenance and depreciation, the IRS 2026 business mileage rate is a useful benchmark for the full per-mile cost.`,
    },
  ],

  related: [relatedLink("car-affordability"), relatedLink("auto-loan"), relatedLink("electricity-cost"), relatedLink("budget"), relatedLink("tip")],
  relatedArticles: [],

  faqs: [
    { q: "How do I calculate gas cost for a trip?", a: "Divide the distance by your car's MPG to get gallons, then multiply by the price per gallon. 300 miles at 30 MPG uses 10 gallons; at $3.20 a gallon that's $32." },
    { q: "How do I split gas money fairly?", a: "Divide the trip's fuel cost by the number of people. Some groups also share tolls and parking, or give the driver a share for wear on the car." },
    { q: "What MPG should I use?", a: "Use your car's real-world average from the trip computer or fill-up records. EPA highway ratings are a good estimate for road trips; city driving is usually lower." },
    { q: "Does this include tolls or wear and tear?", a: "No, only fuel. Tolls, parking, maintenance and depreciation add to the true cost of a drive." },
  ],

  teach: {
    heading: "How is gas cost calculated?",
    whatIsIt:
      "Fuel cost is gallons used times the price per gallon, and gallons used is distance divided by miles per gallon. This calculator does that math and adds splits and monthly totals.",
    whyItMatters:
      "Small differences add up over a year. A 20-mile commute each way in a car getting 25 MPG instead of 35 can cost a few hundred dollars more annually, which matters when choosing a car, a job or where to live.",
    whatToDoNext:
      "Compare the cost of driving with alternatives like transit or carpooling. If you're shopping for a car, factor fuel costs into the total with the car affordability calculator.",
  },

  method: { label: "Gallons = miles ÷ MPG; cost = gallons × price per gallon; per person = cost ÷ people; monthly = trip cost × trips per month" },

  monetization: [
    { kind: "internal", headline: "Shopping for a car?", body: "See what car price your budget supports once fuel and insurance are counted.", ctaLabel: "Open the car affordability calculator", href: "/car-affordability" },
  ],
};

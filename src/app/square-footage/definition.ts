// Square Footage Calculator definition.

import type { CalculatorDefinition } from "@/lib/calculator/types";
import { relatedLink } from "@/lib/calculator/hubs";
import { num, numFlex, money2 } from "@/lib/calculator/format";
import { computeSquareFootage, type SquareFootageInputs, type SquareFootageResults } from "./compute";

const defaults: SquareFootageInputs = {
  areas: [
    { area: "Living room", length: 18, width: 15 },
    { area: "Bedroom", length: 12, width: 11.5 },
    { area: "Hallway", length: 10, width: 3.5 },
  ],
  wastePct: 10,
  pricePerSqFt: 0,
};

export const squareFootageDef: CalculatorDefinition<SquareFootageInputs, SquareFootageResults> = {
  slug: "square-footage",
  hub: "mortgage",
  h1: "Square Footage Calculator",
  valueProp: "Add up the square feet of rooms or any area, with a materials and cost estimate.",
  title: "Square Footage Calculator: Rooms & Floors | freecalcs.io",
  metaDescription:
    "Free square footage calculator: add the length and width of each room for total square feet, yards and meters, plus flooring with waste and an estimated cost.",
  primaryKeyword: "Square Footage Calculator",
  secondaryKeywords: ["square feet calculator", "sq ft calculator", "room square footage", "flooring calculator", "how to calculate square feet"],
  intro:
    "Square footage is length times width, added up across every room or section. This square footage calculator totals as many areas as you need, converts to square yards and meters, adds a waste allowance for flooring, tile or sod, and estimates the cost at your price per square foot.",
  commercialIntent: 2,

  defaults,
  inputs: [
    {
      name: "areas",
      label: "Rooms or areas",
      type: "rows",
      default: defaults.areas,
      columns: [
        { name: "area", label: "Area", type: "text", placeholder: "e.g. Kitchen", grow: 2 },
        { name: "length", label: "Length (ft)", type: "number", min: 0, step: 0.5 },
        { name: "width", label: "Width (ft)", type: "number", min: 0, step: 0.5 },
      ],
      minRows: 1,
      maxRows: 30,
      addLabel: "Add area",
      newRow: { area: "", length: 10, width: 10 },
      helpText: "For an L-shaped room, split it into two rectangles. Convert inches to feet: 6 in = 0.5 ft, 9 in = 0.75 ft.",
    },
    { name: "wastePct", label: "Waste allowance (%)", type: "percent", default: 10, min: 0, max: 50, step: 1, helpText: "Extra for cuts and mistakes: ~10% for flooring, 10–15% for tile on a diagonal." },
    { name: "pricePerSqFt", label: "Price per sq ft (optional)", type: "currency", default: 0, helpText: "Materials or installed price, to estimate the cost." },
  ],

  compute: computeSquareFootage,

  results: [
    { key: "totalSqFt", label: "Total square feet", format: "number", variant: "primary", hint: "Sum of every area." },
    { key: "withWaste", label: "Sq ft to buy (with waste)", format: "number", variant: "secondary" },
    { key: "sqYd", label: "Square yards", format: "number", variant: "secondary" },
    { key: "sqM", label: "Square meters", format: "number", variant: "secondary" },
    { key: "cost", label: "Estimated cost", format: "currency2", variant: "secondary" },
  ],

  breakdowns: [
    {
      title: "Each area",
      columns: [
        { key: "area", label: "Area", format: "text", align: "left" },
        { key: "dims", label: "Size", format: "text", align: "right" },
        { key: "sqft", label: "Sq ft", format: "number", align: "right" },
        { key: "share", label: "Share", format: "text", align: "right" },
      ],
      rows: (r) => r.rows,
    },
  ],

  scenarios: [
    { id: "tile", label: "Tile at $6/sq ft, 15% waste", patch: { wastePct: 15, pricePerSqFt: 6 } },
    { id: "carpet", label: "Carpet at $3.50/sq ft", patch: { wastePct: 10, pricePerSqFt: 3.5 } },
  ],

  insights: [
    {
      id: "headline",
      priority: 95,
      when: (r) => r.totalSqFt > 0,
      say: (r) => `The ${r.areaCount} area${r.areaCount === 1 ? "" : "s"} add up to ${numFlex(r.totalSqFt)} square feet (${numFlex(r.sqYd, 1)} sq yd or ${numFlex(r.sqM, 1)} m²).`,
    },
    {
      id: "waste",
      priority: 88,
      when: (r, v) => r.totalSqFt > 0 && v.wastePct > 0,
      say: (r, v) => `With a ${v.wastePct}% waste allowance, buy about ${num(r.withWaste)} sq ft of material. Flooring is often sold by the box, so round up to whole boxes.`,
    },
    {
      id: "cost",
      priority: 85,
      when: (r) => r.cost > 0,
      say: (r, v) => `At ${money2(v.pricePerSqFt)} per square foot, that comes to about ${money2(r.cost)}.`,
    },
    {
      id: "carpet",
      priority: 70,
      when: (r) => r.totalSqFt > 0,
      say: () => `Carpet and sod are often priced per square yard: divide square feet by 9 to convert.`,
    },
    {
      id: "home",
      priority: 60,
      when: (r) => r.totalSqFt > 500,
      say: () => `For a home's listed square footage, appraisers measure exterior walls and count only finished, heated space, so room-by-room totals usually come in lower.`,
    },
    { id: "empty", priority: 95, when: (r) => r.totalSqFt === 0, say: () => `Enter the length and width of at least one area to see the square footage.` },
  ],

  related: [relatedLink("home-affordability"), relatedLink("mortgage"), relatedLink("closing-costs"), relatedLink("electricity-cost"), relatedLink("rent-affordability")],
  relatedArticles: [],

  faqs: [
    { q: "How do I calculate square footage?", a: "Multiply length by width in feet. A 12 ft by 15 ft room is 180 sq ft. For several rooms, work out each one and add them together." },
    { q: "How do I measure an L-shaped or irregular room?", a: "Split it into rectangles, measure each one, and add them up. For a triangle, multiply base by height and divide by 2." },
    { q: "How do I convert inches to feet?", a: "Divide by 12. A wall that's 10 ft 6 in is 10.5 ft; 10 ft 9 in is 10.75 ft." },
    { q: "How much extra flooring should I buy?", a: "About 10% extra for most flooring, 15% for tile laid diagonally or rooms with many corners, and 5% for simple rectangular rooms." },
    { q: "How many square feet are in a square yard or an acre?", a: "A square yard is 9 sq ft. An acre is 43,560 sq ft, and a square meter is about 10.76 sq ft." },
  ],

  teach: {
    heading: "How do you calculate square feet?",
    whatIsIt:
      "Square footage measures the area of a flat surface in square feet. For a rectangle it's length × width; larger or irregular spaces are broken into rectangles and added up.",
    whyItMatters:
      "Flooring, paint, tile, sod and many contractor quotes are priced by the square foot, and home prices are compared per square foot. An accurate number keeps you from buying too little or paying for too much.",
    whatToDoNext:
      "Measure each area at its widest points, round up to the nearest half foot, and keep your list. Get quotes on the waste-adjusted total, and check materials are from the same batch.",
  },

  method: { label: "Area = Σ(length × width) in feet; 1 sq yd = 9 sq ft; 1 m² = 10.7639 sq ft; 1 acre = 43,560 sq ft" },

  monetization: [
    { kind: "internal", headline: "Shopping for a home?", body: "See how much house you can afford on your income.", ctaLabel: "Open the home affordability calculator", href: "/home-affordability" },
  ],
};

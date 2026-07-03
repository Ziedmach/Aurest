import assert from "node:assert/strict";
import test from "node:test";

function scoreProperty(buyer, property) {
  let score = 0;
  const midpoint = (buyer.budgetMin + buyer.budgetMax) / 2;
  const budgetDistance = Math.abs(property.price - midpoint) / Math.max(midpoint, 1);
  score += property.price >= buyer.budgetMin && property.price <= buyer.budgetMax ? 36 : Math.max(0, 28 - Math.round(budgetDistance * 40));
  score += buyer.areas.some((area) => area.toLowerCase() === property.area.toLowerCase()) ? 28 : 8;
  const difference = Math.abs(property.bedrooms - buyer.bedrooms);
  score += difference === 0 ? 20 : difference === 1 ? 10 : 0;
  score += buyer.objective.toLowerCase().includes("yield") && property.yield >= 6 ? 16 : 8;
  return Math.min(100, score);
}

const buyer = { budgetMin: 2_000_000, budgetMax: 3_000_000, areas: ["Dubai Marina"], bedrooms: 2, objective: "Rental yield" };

test("an exact, in-budget investment fit receives the maximum score", () => {
  const score = scoreProperty(buyer, { price: 2_500_000, area: "Dubai Marina", bedrooms: 2, yield: 6.5 });
  assert.equal(score, 100);
});

test("a mismatched property ranks below a strong fit", () => {
  const strong = scoreProperty(buyer, { price: 2_500_000, area: "Dubai Marina", bedrooms: 2, yield: 6.5 });
  const weak = scoreProperty(buyer, { price: 4_500_000, area: "Downtown", bedrooms: 4, yield: 4.2 });
  assert.ok(strong > weak);
});

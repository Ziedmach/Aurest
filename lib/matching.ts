export type Buyer = {
  name: string;
  purpose: "Buy" | "Rent";
  budgetMin: number;
  budgetMax: number;
  areas: string[];
  bedrooms: number;
  objective: string;
};

export type Property = {
  id: string;
  title: string;
  area: string;
  price: number;
  bedrooms: number;
  propertyType: string;
  image: string;
  size: number;
  yield: number;
  completion: string;
};

export type Match = Property & {
  score: number;
  reasons: string[];
};

export function scoreProperty(buyer: Buyer, property: Property): Match {
  const reasons: string[] = [];
  let score = 0;

  const midpoint = (buyer.budgetMin + buyer.budgetMax) / 2;
  const budgetDistance = Math.abs(property.price - midpoint) / Math.max(midpoint, 1);
  const budgetScore = property.price >= buyer.budgetMin && property.price <= buyer.budgetMax
    ? 36
    : Math.max(0, 28 - Math.round(budgetDistance * 40));
  score += budgetScore;
  if (budgetScore >= 30) reasons.push("Comfortably inside the stated budget");

  const areaMatch = buyer.areas.some((area) => area.toLowerCase() === property.area.toLowerCase());
  if (areaMatch) {
    score += 28;
    reasons.push(`Matches the preferred ${property.area} location`);
  } else {
    score += 8;
  }

  const bedroomDifference = Math.abs(property.bedrooms - buyer.bedrooms);
  const bedroomScore = bedroomDifference === 0 ? 20 : bedroomDifference === 1 ? 10 : 0;
  score += bedroomScore;
  if (bedroomDifference === 0) reasons.push(`Exact ${buyer.bedrooms}-bedroom fit`);

  const investor = buyer.objective.toLowerCase().includes("yield") || buyer.objective.toLowerCase().includes("invest");
  if (investor && property.yield >= 6) {
    score += 16;
    reasons.push(`${property.yield.toFixed(1)}% estimated gross yield supports the investment goal`);
  } else {
    score += 8;
  }

  return { ...property, score: Math.min(100, score), reasons };
}

export function rankProperties(buyer: Buyer, properties: Property[]): Match[] {
  return properties.map((property) => scoreProperty(buyer, property)).sort((a, b) => b.score - a.score);
}

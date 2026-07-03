import type { Buyer, Property } from "./matching";

export const sampleBuyer: Buyer = {
  name: "Omar Al Mansoori",
  purpose: "Buy",
  budgetMin: 2_000_000,
  budgetMax: 3_200_000,
  areas: ["Dubai Marina", "Dubai Hills"],
  bedrooms: 2,
  objective: "Rental yield with long-term appreciation",
};

export const sampleProperties: Property[] = [
  {
    id: "marina-vista-2104",
    title: "Marina Vista · Full Sea View",
    area: "Dubai Marina",
    price: 2_750_000,
    bedrooms: 2,
    propertyType: "Apartment",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80",
    size: 1148,
    yield: 6.4,
    completion: "Ready",
  },
  {
    id: "park-heights-804",
    title: "Park Heights · Boulevard View",
    area: "Dubai Hills",
    price: 2_390_000,
    bedrooms: 2,
    propertyType: "Apartment",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
    size: 1067,
    yield: 5.8,
    completion: "Ready",
  },
  {
    id: "creek-palace-1207",
    title: "Creek Palace · Skyline Residence",
    area: "Dubai Creek Harbour",
    price: 2_150_000,
    bedrooms: 2,
    propertyType: "Apartment",
    image: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=80",
    size: 1012,
    yield: 6.8,
    completion: "Ready",
  },
];

import { storageGet } from "../../services/storageService.js";

export const DEMO_PROMPT =
  "I want a suit for my friend's wedding next week, budget range is MMK 100000-300000.";

export const tailors = [
  {
    id: "t-aung",
    name: "Aung Tailoring",
    ownerName: "U Aung Min",
    profileImage: "/images/tailors/aung.jpg",
    location: "Bahan, Yangon",
    rating: 4.9,
    reviewCount: 186,
    yearsExperience: 18,
    languages: ["Myanmar", "English"],
    hours: "Tue–Sun, 9:00–18:00",
    specialties: ["Men's Suits", "Wedding Wear"],
    styles: ["Modern", "Slim Fit"],
    priceMin: 150000,
    priceMax: 280000,
    completionDays: { min: 4, max: 6 },
    available: true,
    description:
      "Known across Bahan for modern slim-fit suits that stay sharp in Myanmar heat. Strong wedding turnaround without rushing the finish.",
    highlight: "Wedding-week suits with two fittings included.",
    sampleImages: [
      "/images/designs/suit-navy.jpg",
      "/images/designs/suit-charcoal.jpg",
      "/images/designs/suit-black.jpg",
      "/images/designs/work-fitting.jpg",
      "/images/designs/work-fabric.jpg",
      "/images/designs/work-atelier.jpg",
      "/images/designs/work-measure.jpg",
    ],
  },
  {
    id: "t-shwe",
    name: "Shwe Fashion",
    ownerName: "Daw Shwe Yee",
    profileImage: "/images/tailors/shwe.jpg",
    location: "Mayangone, Yangon",
    rating: 4.7,
    reviewCount: 142,
    yearsExperience: 12,
    languages: ["Myanmar", "English"],
    hours: "Mon–Sat, 10:00–19:00",
    specialties: ["Formal Wear", "Evening Dresses"],
    styles: ["Classic", "Modern"],
    priceMin: 180000,
    priceMax: 300000,
    completionDays: { min: 5, max: 7 },
    available: true,
    description:
      "Atelier for formal occasions — grooms, guests, and evening looks with careful lining and measured silhouettes.",
    highlight: "Evening and guest wear with structured lining.",
    sampleImages: [
      "/images/designs/suit-black.jpg",
      "/images/designs/dress-evening.jpg",
    ],
  },
  {
    id: "t-mandalay",
    name: "Mandalay Atelier",
    ownerName: "Ko Myo Aung",
    profileImage: "/images/tailors/mandalay.jpg",
    location: "Chanayethazan, Mandalay",
    rating: 4.8,
    reviewCount: 98,
    yearsExperience: 15,
    languages: ["Myanmar"],
    hours: "Daily, 9:00–17:30",
    specialties: ["Traditional Wear", "Longyi Sets"],
    styles: ["Traditional", "Contemporary"],
    priceMin: 80000,
    priceMax: 220000,
    completionDays: { min: 5, max: 8 },
    available: true,
    description:
      "Blend of Mandalay craft and contemporary cuts. Reliable for taungshay pasoe, HTP shirts, and guest attire.",
    highlight: "Hand-finished traditional sets with modern ease.",
    sampleImages: [
      "/images/designs/htp-cream.jpg",
      "/images/designs/longyi-set.jpg",
    ],
  },
  {
    id: "t-nilar",
    name: "Nilar Studio",
    ownerName: "Daw Nilar Win",
    profileImage: "/images/tailors/nilar.jpg",
    location: "Sanchaung, Yangon",
    rating: 4.6,
    reviewCount: 121,
    yearsExperience: 10,
    languages: ["Myanmar", "English"],
    hours: "Wed–Mon, 10:00–18:00",
    specialties: ["Women's Tailoring", "Office Wear"],
    styles: ["Minimal", "Modern"],
    priceMin: 90000,
    priceMax: 240000,
    completionDays: { min: 4, max: 7 },
    available: true,
    description:
      "Clean lines for working women — blazers, trousers, and occasion dresses with practical ease of movement.",
    highlight: "Office tailoring that still works after hours.",
    sampleImages: [
      "/images/designs/blazer-ivory.jpg",
      "/images/designs/dress-day.jpg",
    ],
  },
  {
    id: "t-golden",
    name: "Golden Thread House",
    profileImage: "/images/tailors/golden.svg",
    location: "Downtown, Yangon",
    rating: 4.5,
    reviewCount: 74,
    specialties: ["Men's Shirts", "Casual Tailoring"],
    styles: ["Classic", "Relaxed"],
    priceMin: 45000,
    priceMax: 160000,
    completionDays: { min: 3, max: 5 },
    available: true,
    description:
      "Everyday shirts and lightweight trousers for Yangon humidity. Fast fittings near Sule.",
    sampleImages: [
      "/images/designs/shirt-white.svg",
      "/images/designs/trouser-khaki.svg",
    ],
  },
  {
    id: "t-inle",
    name: "Inle Silk & Linen",
    profileImage: "/images/tailors/inle.svg",
    location: "Nyaungshwe, Shan State",
    rating: 4.8,
    reviewCount: 63,
    specialties: ["Linen Wear", "Resort Tailoring"],
    styles: ["Relaxed", "Natural"],
    priceMin: 70000,
    priceMax: 200000,
    completionDays: { min: 6, max: 10 },
    available: true,
    description:
      "Breathable linen and Inle-inspired weaves for travel, ceremonies by the lake, and warm-weather suits.",
    sampleImages: [
      "/images/designs/linen-suit.svg",
      "/images/designs/shirt-linen.svg",
    ],
  },
  {
    id: "t-thiri",
    name: "Thiri Bridal Atelier",
    profileImage: "/images/tailors/thiri.svg",
    location: "Kamayut, Yangon",
    rating: 4.9,
    reviewCount: 88,
    specialties: ["Bridal Wear", "Reception Dresses"],
    styles: ["Romantic", "Modern"],
    priceMin: 250000,
    priceMax: 650000,
    completionDays: { min: 10, max: 18 },
    available: true,
    description:
      "Bridal and reception pieces with structured bodices and Myanmar-friendly fabrics. Book early for peak wedding months.",
    sampleImages: [
      "/images/designs/bridal-ivory.svg",
      "/images/designs/reception-blush.svg",
    ],
  },
  {
    id: "t-bago",
    name: "Bago Heritage Cuts",
    profileImage: "/images/tailors/bago.svg",
    location: "Bago",
    rating: 4.4,
    reviewCount: 51,
    specialties: ["Men's Suits", "Uniform Tailoring"],
    styles: ["Classic", "Structured"],
    priceMin: 110000,
    priceMax: 240000,
    completionDays: { min: 6, max: 9 },
    available: false,
    description:
      "Structured classic suits and institutional uniforms. Currently at capacity until next week.",
    sampleImages: [
      "/images/designs/suit-navy.svg",
      "/images/designs/shirt-white.svg",
    ],
  },
  {
    id: "t-pyay",
    name: "Pyay Street Tailors",
    profileImage: "/images/tailors/pyay.svg",
    location: "Dagon, Yangon",
    rating: 4.3,
    reviewCount: 39,
    specialties: ["Alterations", "Youth Fashion"],
    styles: ["Street", "Slim Fit"],
    priceMin: 35000,
    priceMax: 140000,
    completionDays: { min: 2, max: 4 },
    available: true,
    description:
      "Sharp alterations and slim youth cuts. Best for faster, smaller orders rather than full wedding ensembles.",
    sampleImages: [
      "/images/designs/jacket-olive.svg",
      "/images/designs/trouser-black.svg",
    ],
  },
  {
    id: "t-sagaing",
    name: "Sagaing Loom Studio",
    profileImage: "/images/tailors/sagaing.svg",
    location: "Sagaing",
    rating: 4.7,
    reviewCount: 45,
    specialties: ["Handwoven Wear", "Ceremonial Outfits"],
    styles: ["Traditional", "Artisan"],
    priceMin: 95000,
    priceMax: 280000,
    completionDays: { min: 8, max: 14 },
    available: true,
    description:
      "Handwoven textiles turned into ceremonial and guest outfits. Longer lead times, distinctive finish.",
    sampleImages: [
      "/images/designs/ceremonial.svg",
      "/images/designs/htp-cream.svg",
    ],
  },
];

function storedTailors() {
  const users = storageGet("users", []);
  return Array.isArray(users) ? users.filter((u) => u.role === "tailor") : [];
}

function fromUser(user, catalog) {
  const base = catalog || {
    id: user.id,
    rating: 4.6,
    reviewCount: 0,
    available: true,
    specialties: [],
    styles: [],
    sampleImages: [],
    completionDays: { min: 5, max: 8 },
  };
  return {
    ...base,
    id: user.id || base.id,
    name: user.name || base.name,
    ownerName: user.ownerName || base.ownerName,
    profileImage: user.profileImage || base.profileImage,
    location: user.location || base.location,
    address: user.address || base.address,
    email: user.email || base.email,
    phone: user.phone || base.phone,
    description: user.description || base.description,
    highlight: user.highlight || base.highlight,
    hours: user.hours || base.hours,
    languages: user.languages?.length ? user.languages : base.languages,
    yearsExperience: user.yearsExperience ?? base.yearsExperience,
    specialties: user.specialties?.length ? user.specialties : base.specialties,
    styles: user.styles?.length ? user.styles : base.styles,
    priceMin: user.priceMin ?? base.priceMin,
    priceMax: user.priceMax ?? base.priceMax,
    completionDays: {
      min: user.completionDaysMin ?? base.completionDays?.min,
      max: user.completionDaysMax ?? base.completionDays?.max,
    },
    sampleImages: user.sampleImages?.length ? user.sampleImages : base.sampleImages,
    available: user.available ?? base.available ?? true,
  };
}

export function getPublicTailor(id) {
  if (!id) return null;
  const catalog = tailors.find((t) => t.id === id) || null;
  const user = storedTailors().find((u) => u.id === id);
  if (user) return fromUser(user, catalog);
  return catalog;
}

export function listPublicTailors() {
  const byId = new Map(tailors.map((t) => [t.id, t]));
  for (const user of storedTailors()) {
    byId.set(user.id, fromUser(user, byId.get(user.id) || null));
  }
  return [...byId.values()];
}

export function getTailorById(id) {
  return getPublicTailor(id);
}

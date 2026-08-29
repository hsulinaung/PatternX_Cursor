export const SPECIALTIES = [
  "Men's Suits",
  "Wedding Wear",
  "Women's Dresses",
  "Women's Tailoring",
  "Traditional Wear",
  "Office Wear",
  "Shirts",
  "Pants",
  "Jackets",
  "Formal Wear",
  "Evening Dresses",
];

export const STYLES = ["Formal", "Modern", "Classic", "Traditional", "Casual", "Slim Fit", "Minimal"];

export const LANGUAGES = ["Myanmar", "English", "Chinese"];

export function toggleList(list, value) {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
}

import { mkdirSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function svgRect(bg, label, accent = "#C4A574") {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 800" fill="none">
  <rect width="640" height="800" fill="${bg}"/>
  <rect x="48" y="48" width="544" height="704" stroke="${accent}" stroke-opacity="0.45" fill="none"/>
  <text x="320" y="400" text-anchor="middle" font-family="Georgia, serif" font-size="28" fill="${accent}">${label}</text>
</svg>`;
}

function svgAvatar(bg, initials) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="none">
  <rect width="256" height="256" rx="128" fill="${bg}"/>
  <text x="128" y="148" text-anchor="middle" font-family="Georgia, serif" font-size="72" fill="#F6F1E8">${initials}</text>
</svg>`;
}

const tailors = [
  ["aung", "#1C1916", "AT"],
  ["shwe", "#3A2A1A", "SF"],
  ["mandalay", "#2C241C", "MA"],
  ["nilar", "#4A3B32", "NS"],
  ["golden", "#5A4630", "GT"],
  ["inle", "#2E3A32", "IS"],
  ["thiri", "#4A3036", "TB"],
  ["bago", "#2A2C28", "BH"],
  ["pyay", "#333028", "PS"],
  ["sagaing", "#3A3228", "SL"],
];

const designs = [
  ["suit-navy", "#1B2744", "Navy Suit"],
  ["suit-charcoal", "#2B2B2E", "Charcoal Suit"],
  ["suit-black", "#141414", "Black Suit"],
  ["linen-suit", "#C4B39A", "Linen Suit"],
  ["htp-cream", "#E8D9C4", "HTP Set"],
  ["longyi-set", "#5C1F28", "Longyi Set"],
  ["blazer-ivory", "#EFE6D9", "Ivory Blazer"],
  ["dress-day", "#7A8A72", "Day Dress"],
  ["dress-evening", "#1A1E32", "Evening Dress"],
  ["bridal-ivory", "#F4EEE6", "Bridal"],
  ["reception-blush", "#D9B3B0", "Reception"],
  ["shirt-white", "#F7F4EF", "White Shirt"],
  ["shirt-linen", "#D6CBB8", "Linen Shirt"],
  ["jacket-olive", "#4A5338", "Olive Jacket"],
  ["ceremonial", "#6B4A1F", "Ceremonial"],
  ["trouser-khaki", "#B59A6A", "Khaki Trouser"],
  ["trouser-black", "#1E1E1E", "Black Trouser"],
];

mkdirSync(join(root, "public/images/tailors"), { recursive: true });
mkdirSync(join(root, "public/images/designs"), { recursive: true });

for (const [id, bg, initials] of tailors) {
  writeFileSync(join(root, `public/images/tailors/${id}.svg`), svgAvatar(bg, initials));
}
for (const [id, bg, label] of designs) {
  writeFileSync(join(root, `public/images/designs/${id}.svg`), svgRect(bg, label, bg === "#F7F4EF" || bg === "#F4EEE6" || bg === "#EFE6D9" || bg === "#E8D9C4" ? "#1C1916" : "#C4A574"));
}

console.log("Wrote placeholder images.");

/**
 * PatternX demo authentication.
 *
 * This is a localStorage MVP only. It is not production-secure.
 * Replace this module later with a real backend, hashed passwords,
 * and secure sessions. Journey state stays in `patternx:session`
 * (orderService). Auth uses `patternx:users` and `patternx:authSession`.
 */

import { storageGet, storageSet, storageRemove } from "./storageService.js";

const USERS_KEY = "users";
const AUTH_KEY = "authSession";
const DEMO_PASSWORD = "demo1234";

function fallbackHash(value) {
  let hash = 2166136261;
  const input = `patternx-mvp:${value}`;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return `fnv1a:${(hash >>> 0).toString(16)}`;
}

export async function hashSecret(value) {
  try {
    if (globalThis.crypto?.subtle) {
      const buffer = await crypto.subtle.digest(
        "SHA-256",
        new TextEncoder().encode(`patternx-mvp:${value}`)
      );
      return [...new Uint8Array(buffer)].map((b) => b.toString(16).padStart(2, "0")).join("");
    }
  } catch {
    // Use the fallback below.
  }
  return fallbackHash(value);
}

function normalizePhone(phone) {
  return String(phone || "").replace(/\s+/g, "");
}

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

export function sanitizeUser(user) {
  if (!user) return null;
  const { password, passwordHash, ...safe } = user;
  return safe;
}

function getUsers() {
  const users = storageGet(USERS_KEY, []);
  return Array.isArray(users) ? users : [];
}

function saveUsers(users) {
  return storageSet(USERS_KEY, users);
}

function findUserByIdentifier(identifier) {
  const value = String(identifier || "").trim();
  if (!value) return null;
  const email = normalizeEmail(value);
  const phone = normalizePhone(value);
  return (
    getUsers().find(
      (u) => normalizeEmail(u.email) === email || normalizePhone(u.phone) === phone || u.id === value
    ) || null
  );
}

export function getCurrentUser() {
  const session = storageGet(AUTH_KEY, null);
  if (!session?.userId) return null;
  return sanitizeUser(getUsers().find((u) => u.id === session.userId) || null);
}

export function isAuthenticated() {
  return Boolean(getCurrentUser());
}

export function requireRole(role) {
  return getCurrentUser()?.role === role;
}

function writeSession(userId) {
  storageSet(AUTH_KEY, { userId, createdAt: new Date().toISOString() });
  return getCurrentUser();
}

export async function ensureDemoUsers() {
  const users = getUsers();
  const hash = await hashSecret(DEMO_PASSWORD);
  const seeds = [
    {
      id: "customer-demo",
      role: "customer",
      name: "Hsu Lin",
      email: "hsu.lin@patternx.demo",
      phone: "0911111111",
      passwordHash: hash,
      profileImage: null,
      location: "Yangon",
      nrcImage: null,
      preferredLocation: "Yangon",
      stylePreferences: "Modern slim formal",
      createdAt: "2026-08-01T00:00:00.000Z",
    },
    {
      id: "t-aung",
      role: "tailor",
      name: "Aung Tailoring",
      ownerName: "U Aung",
      email: "aung@patternx.demo",
      phone: "0922222222",
      passwordHash: hash,
      profileImage: "/images/tailors/aung.svg",
      location: "Bahan, Yangon",
      address: "Bahan Township, Yangon",
      description:
        "Known across Bahan for modern slim-fit suits that stay sharp in Myanmar heat.",
      specialties: ["Men's Suits", "Wedding Wear"],
      styles: ["Modern", "Slim Fit"],
      priceMin: 150000,
      priceMax: 280000,
      completionDaysMin: 4,
      completionDaysMax: 6,
      sampleImages: ["/images/designs/suit-navy.svg", "/images/designs/suit-charcoal.svg"],
      createdAt: "2026-08-01T00:00:00.000Z",
    },
  ];

  let changed = false;
  const next = [...users];
  for (const seed of seeds) {
    if (!next.some((u) => u.id === seed.id)) {
      next.push(seed);
      changed = true;
    }
  }
  if (changed) saveUsers(next);
  return next;
}

function duplicateError(email, phone, users) {
  if (email && users.some((u) => normalizeEmail(u.email) === normalizeEmail(email))) {
    return "An account with this email already exists.";
  }
  if (phone && users.some((u) => normalizePhone(u.phone) === normalizePhone(phone))) {
    return "This phone number is already registered.";
  }
  return "";
}

export async function registerCustomer(payload) {
  await ensureDemoUsers();
  const users = getUsers();
  const clash = duplicateError(payload.email, payload.phone, users);
  if (clash) return { ok: false, error: clash };

  const user = {
    id: `customer-${Date.now()}`,
    role: "customer",
    name: payload.name.trim(),
    email: normalizeEmail(payload.email) || "",
    phone: normalizePhone(payload.phone),
    passwordHash: await hashSecret(payload.password),
    profileImage: payload.profileImage || null,
    location: payload.location || "",
    nrcImage: payload.nrcImage || null,
    preferredLocation: payload.preferredLocation || payload.location || "",
    stylePreferences: payload.stylePreferences || "",
    createdAt: new Date().toISOString(),
  };
  saveUsers([user, ...users]);
  return { ok: true, user: writeSession(user.id) };
}

export async function registerTailor(payload) {
  await ensureDemoUsers();
  const users = getUsers();
  const clash = duplicateError(payload.email, payload.phone, users);
  if (clash) return { ok: false, error: clash };

  const user = {
    id: `t-${Date.now()}`,
    role: "tailor",
    name: payload.name.trim(),
    ownerName: payload.ownerName || "",
    email: normalizeEmail(payload.email) || "",
    phone: normalizePhone(payload.phone),
    passwordHash: await hashSecret(payload.password),
    profileImage: payload.profileImage || null,
    location: payload.location || "",
    address: payload.address || "",
    description: payload.description || "",
    specialties: payload.specialties || [],
    styles: payload.styles || [],
    priceMin: payload.priceMin ?? null,
    priceMax: payload.priceMax ?? null,
    completionDaysMin: payload.completionDaysMin ?? null,
    completionDaysMax: payload.completionDaysMax ?? null,
    sampleImages: payload.sampleImages || [],
    createdAt: new Date().toISOString(),
  };
  saveUsers([user, ...users]);
  return { ok: true, user: writeSession(user.id) };
}

export async function login(identifier, password) {
  await ensureDemoUsers();
  if (!String(identifier || "").trim() || !String(password || "").trim()) {
    return { ok: false, error: "Please complete all required fields.", code: "missing" };
  }
  const user = findUserByIdentifier(identifier);
  if (!user) {
    return { ok: false, error: "No account found. Create an account first.", code: "unknown" };
  }
  const hashed = await hashSecret(password);
  if (user.passwordHash !== hashed) {
    return { ok: false, error: "Incorrect email/phone or password.", code: "invalid" };
  }
  return { ok: true, user: writeSession(user.id) };
}

export async function loginDemo(kind) {
  await ensureDemoUsers();
  const userId = kind === "tailor" ? "t-aung" : "customer-demo";
  const user = writeSession(userId);
  if (!user) return { ok: false, error: "Demo account is missing." };
  return { ok: true, user };
}

export function logout() {
  storageRemove(AUTH_KEY);
  return true;
}

export function updateProfile(userId, patch) {
  const users = getUsers();
  const next = users.map((u) => (u.id === userId ? { ...u, ...patch, id: u.id, role: u.role } : u));
  saveUsers(next);
  return sanitizeUser(next.find((u) => u.id === userId) || null);
}

export const DEMO_AUTH = {
  password: DEMO_PASSWORD,
  customer: { id: "customer-demo", name: "Hsu Lin" },
  tailor: { id: "t-aung", name: "Aung Tailoring" },
};

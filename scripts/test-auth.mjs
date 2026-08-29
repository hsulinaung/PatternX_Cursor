import { hashSecret, sanitizeUser } from "../src/services/authService.js";

const a = await hashSecret("demo1234");
const b = await hashSecret("demo1234");
if (a !== b) throw new Error("hash not stable");
if (a === "demo1234") throw new Error("password stored raw");

const safe = sanitizeUser({ id: "x", name: "A", passwordHash: "secret", password: "no" });
if (safe.passwordHash || safe.password) throw new Error("password leaked");
if (safe.id !== "x") throw new Error("sanitize dropped id");

console.log("auth helpers passed");

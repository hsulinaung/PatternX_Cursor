import { sampleOrders } from "../shared/data/orders.js";
import { storageGet, storageSet } from "./storageService";

const ORDERS_KEY = "orders";
const SESSION_KEY = "session";

function nextOrderId(existing) {
  const numbers = existing
    .map((o) => Number(String(o.orderId || "").replace(/\D/g, "")))
    .filter((n) => Number.isFinite(n));
  const max = numbers.length ? Math.max(...numbers) : 1010;
  return `PX-${max + 1}`;
}

export function getOrders() {
  const stored = storageGet(ORDERS_KEY, null);
  if (Array.isArray(stored) && stored.length) return stored;
  storageSet(ORDERS_KEY, sampleOrders);
  return sampleOrders;
}

export function getOrderById(orderId) {
  return getOrders().find((o) => o.orderId === orderId) || null;
}

export function createOrder(payload) {
  const orders = getOrders();
  const orderId = payload.orderId || payload.id || nextOrderId(orders);
  const order = {
    id: orderId,
    orderId,
    customerId: payload.customerId || "c-demo",
    requestId: payload.requestId || null,
    status: payload.status || "Confirmed",
    customer: payload.customer || "Demo Guest",
    tailor: payload.tailor || "",
    tailorId: payload.tailorId || "",
    clothingType: payload.clothingType || "",
    style: payload.style || "",
    color: payload.color || "",
    occasion: payload.occasion || "",
    price: payload.price ?? 0,
    deadline: payload.deadline || "",
    customization: payload.customization || {},
    createdAt: payload.createdAt || new Date().toISOString(),
    notes: payload.notes || "",
  };
  const next = [order, ...orders];
  storageSet(ORDERS_KEY, next);
  return order;
}

export function getSession() {
  return storageGet(SESSION_KEY, {});
}

export function saveSession(partial) {
  const current = getSession();
  const next = { ...current, ...partial };
  storageSet(SESSION_KEY, next);
  return next;
}

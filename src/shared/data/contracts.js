/**
 * Shared MVP data contract.
 * Customer features create these objects; tailor features read and update them.
 * Persist via services + localStorage — do not duplicate this shape in feature folders.
 */

export const REQUEST_STATUSES = [
  "Draft",
  "Submitted",
  "Quoted",
  "Accepted",
  "Rejected",
  "Converted",
];

export const ORDER_STATUSES = [
  "Confirmed",
  "Tailor Accepted",
  "In Production",
  "Ready",
  "Completed",
];

export function createDesignRequest(partial = {}) {
  return {
    id: partial.id || `DR-${Date.now()}`,
    customerId: partial.customerId || "c-demo",
    tailorId: partial.tailorId || null,
    clothingType: partial.clothingType || null,
    occasion: partial.occasion || null,
    style: partial.style || null,
    color: partial.color || null,
    fabric: partial.fabric || null,
    budgetMin: partial.budgetMin ?? null,
    budgetMax: partial.budgetMax ?? null,
    deadline: partial.deadline || null,
    notes: partial.notes || "",
    referenceImage: partial.referenceImage || null,
    status: partial.status || "Submitted",
    createdAt: partial.createdAt || new Date().toISOString(),
  };
}

export function createOrderRecord(partial = {}) {
  const id = partial.id || partial.orderId || `PX-${Date.now()}`;
  return {
    id,
    orderId: partial.orderId || id,
    customerId: partial.customerId || "c-demo",
    tailorId: partial.tailorId || null,
    requestId: partial.requestId || null,
    clothingType: partial.clothingType || null,
    price: partial.price ?? 0,
    status: partial.status || "Confirmed",
    deadline: partial.deadline || null,
    customization: partial.customization || {},
    createdAt: partial.createdAt || new Date().toISOString(),
  };
}

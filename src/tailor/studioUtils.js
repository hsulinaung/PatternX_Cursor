import { customers } from "../shared/data/orders.js";
import { sampleDesignRequests } from "../shared/data/designRequests.js";
import { getSession } from "../services/orderService.js";

const MOCK_REQUEST_IDS = new Set(sampleDesignRequests.map((r) => r.id));

export function displayRequestStatus(status) {
  if (status === "Submitted" || status === "Draft" || status === "Pending") return "Pending";
  return status || "Pending";
}

export function isPendingRequest(request) {
  return ["Submitted", "Draft", "Pending"].includes(request.status);
}

export function isMockRequest(request) {
  return MOCK_REQUEST_IDS.has(request.id);
}

export function resolveCustomerName(record) {
  if (record?.customerName) return record.customerName;
  if (record?.customer) return record.customer;
  const found = customers.find((c) => c.id === record?.customerId);
  if (found) return found.name;
  if (record?.customerId === "customer-demo") return "Hsu Lin";
  return "Customer";
}

export function requestMatchScore(request) {
  if (request?.matchScore != null) return request.matchScore;
  const session = getSession();
  if (session?.matchScore && session.selectedTailorId === request?.tailorId) {
    return session.matchScore;
  }
  return null;
}

export function studioStats(requests, orders) {
  const pending = requests.filter(isPendingRequest).length;
  const completed = orders.filter((o) => o.status === "Completed").length;
  const active = orders.filter((o) => o.status !== "Completed").length;
  const revenue = orders.reduce((sum, o) => sum + (Number(o.price) || 0), 0);
  return { pending, active, completed, revenue };
}

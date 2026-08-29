import { getCurrentUser } from "../services/authService.js";
import { DEMO_CUSTOMER } from "../customer/demoCustomer.js";
import { DEMO_TAILOR } from "../tailor/demoTailor.js";

export function getActingCustomer() {
  const user = getCurrentUser();
  if (user?.role === "customer") {
    return { customerId: user.id, name: user.name };
  }
  return DEMO_CUSTOMER;
}

export function getActingTailor() {
  const user = getCurrentUser();
  if (user?.role === "tailor") {
    return { id: user.id, name: user.name };
  }
  return DEMO_TAILOR;
}

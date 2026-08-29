import { createDesignRequest } from "../src/shared/data/contracts.js";
import { estimatePrice, assistantAcknowledgement } from "../src/customer/utils/orderHelpers.js";
import { tailors } from "../src/shared/data/tailors.js";
import { DEMO_CUSTOMER } from "../src/customer/demoCustomer.js";

const aung = tailors.find((t) => t.id === "t-aung");
const price = estimatePrice({ budgetMin: 100000, budgetMax: 300000 }, aung);
if (price !== 220000) throw new Error(`expected 220000 got ${price}`);

const msg = assistantAcknowledgement({
  clothingType: "Men's Suit",
  occasion: "Wedding",
  budgetMin: 100000,
  budgetMax: 300000,
  deadlineLabel: "Next week",
});
if (!/wedding/.test(msg) || !/100K/.test(msg)) throw new Error(msg);

const request = createDesignRequest({
  customerId: DEMO_CUSTOMER.customerId,
  tailorId: "t-aung",
  clothingType: "Men's Suit",
  requirements: { clothingType: "Men's Suit" },
  customization: { fit: "Slim Fit" },
});
if (request.customerId !== "customer-demo") throw new Error("customer id");
if (!request.customization || !request.requirements) throw new Error("handoff fields");

console.log("phase3 helpers passed", { price, requestId: request.id });

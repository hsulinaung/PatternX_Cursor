# PatternX team workflow

One GitHub repository. One Vite/React app. Two feature areas.

## Ownership

1. **Customer developer** owns `src/customer/`.
   - Home, assistant, requirements, recommendations, tailor details, customize, review, confirmation, customer orders.
2. **Tailor developer** owns `src/tailor/`.
   - Studio entry, dashboard, incoming requests, quotes, tailor orders, profile.
3. **Shared UI, mock data, and helpers** belong in `src/shared/`.
   - Buttons, cards, layout, formatters, dates, catalog data, request/order contracts.
4. **Business services** belong in `src/services/`.
   - `aiService`, `matchingService`, `orderService`, `requestService`, `storageService`, `journeyService`.
   - Both sides use these instead of copying logic.

## Rules

5. **Do not edit the other developer’s feature folder.**
   - Customer work stays in `src/customer/`.
   - Tailor work stays in `src/tailor/`.
6. **Keep `src/App.jsx` and `src/main.jsx` stable.** Add routes in `src/customer/customerRoutes.jsx` or `src/tailor/tailorRoutes.jsx`.
7. **If you must change shared code or a service**, keep the diff small and tell the other developer.
8. **Run `npm run build` before committing.**
9. **Use clear commit messages** that name the area, for example:
   - `Customer: persist customization notes`
   - `Tailor: accept incoming request`
   - `Shared: add formatCurrency helper`

## Routes

Existing customer URLs stay as-is (`/`, `/assistant`, `/requirements`, …, `/tailor/:id` for atelier profiles).

Namespaced aliases: `/customer/*`.

Tailor studio: `/tailor`, `/tailor/dashboard`, `/tailor/requests`, `/tailor/orders`, `/tailor/profile`.

Demo chooser: `/demo`.

`/tailor/:id` (for example `/tailor/t-aung`) remains the **customer** atelier profile. Static studio paths are registered first so they do not collide.

## Data contract

Customer creates design requests and orders.

Tailor reads and updates the same objects via `requestService` and `orderService` (localStorage for the MVP).

Shapes live in `src/shared/data/contracts.js`.

## Local commands

```bash
npm install
npm run dev
npm run build
```

# Mini Checkout & Playwright Browser Test Suite

A single-page client-side checkout application built with **React + TypeScript (Vite)** and an automated end-to-end browser test suite built with **Playwright**.

---

## Features Implemented

- **Fixed-Price Product Catalog:** Two products (`Grid Notebook` at `$12.00` and `Ceramic Mug` at `$18.00`) that can be added to the cart.
- **Cart & Dynamic Calculations:** Add items, update item quantities, or remove items with immediate recalculation of line totals and order total.
- **Input & Cart Validation:**
  - Blocks checkout when the cart is empty.
  - Blocks checkout when the required `Full Name` field is blank or whitespace-only, while preserving existing customer input.
- **Double-Click / Duplicate Order Protection:** Uses a synchronous submission lock (`submitLockRef`) and button disabled state so rapid double-clicks on **Place Order** never produce duplicate orders or multiple confirmation banners.
- **Single Order Confirmation:** Displays a clear confirmation message with a unique `ORD-XXXXXX` reference and total charged upon valid submission.

---

## Project Structure

```text
checkout/
├── index.html              # App entry HTML
├── package.json            # Dependencies and npm scripts
├── playwright.config.ts    # Playwright configuration (auto-starts Vite dev server)
├── src/
│   ├── App.tsx             # Single-page checkout component & validation logic
│   ├── main.tsx            # React root mount
│   └── styles.css          # Minimal styling
├── tests/
│   └── checkout.spec.ts    # 3 automated Playwright end-to-end tests
├── TEST_PLAN.md            # Risk-prioritized test plan & manual test findings
└── README.md               # Setup, run, and test instructions

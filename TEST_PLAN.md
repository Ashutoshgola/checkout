# Test Plan & Manual Execution Notes

## Scope
Single-page Mini Checkout UI with two fixed-price items (`Grid Notebook` at `$12.00` and `Ceramic Mug` at `$18.00`), quantity/removal controls, required `Full Name` field, and client-side order confirmation.

## Risk Prioritization
1. **High — Duplicate order / multiple confirmations on rapid click:** A user double-clicking `Place Order` should never generate two orders or two confirmation panels.
2. **High — Validation bypass or data loss on error:** Submitting an empty cart or blank name must block checkout, show a clear error, and keep entered values intact.
3. **High — Stale or wrong totals on quantity/item changes:** Adding, updating quantity, or removing items must keep line totals and order total in sync.
4. **Medium — Non-numeric or zero/negative quantity entries:** Typing `0`, negative numbers, or NaN into the quantity field shouldn't corrupt totals.
5. **Low — Whitespace-only names:** Names like `"   "` should be treated as blank rather than valid input.

## Manual Test Results

### Case M1: Empty Cart Submission
- **Steps:** Open the page, leave cart empty, enter `"Rohan Verma"` in `Full Name`, and click `Place Order`.
- **Expected:** Order is blocked, validation message appears, and no confirmation box is shown.
- **Actual:** Blocked as expected; alert showed `"Your cart is empty. Add at least one item before placing an order."` No confirmation rendered.
- **Status:** Pass (no defect found).

### Case M2: Rapid Double-Click on Place Order
- **Steps:** Add `Grid Notebook` (`$12.00`), enter `"Rohan Verma"`, and rapidly double-click `Place Order`.
- **Expected:** Only one confirmation section and one `ORD-XXXXXX` reference appear.
- **Actual:** A single confirmation section appeared with one order reference; the submit button became disabled after the first click and `submitLockRef` ignored the second event.
- **Status:** Pass (no defect found).

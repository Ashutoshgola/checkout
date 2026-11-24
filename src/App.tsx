import { useMemo, useRef, useState } from 'react';

interface Product {
  id: string;
  name: string;
  priceCents: number;
}

interface CartItem {
  product: Product;
  quantity: number;
}

const CATALOG: Product[] = [
  { id: 'notebook', name: 'Grid Notebook', priceCents: 1200 },
  { id: 'mug', name: 'Ceramic Mug', priceCents: 1800 },
];

function formatMoney(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

function createOrderReference(): string {
  const randomPart = Math.floor(100000 + Math.random() * 900000);
  return `ORD-${randomPart}`;
}

export default function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerName, setCustomerName] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [orderRef, setOrderRef] = useState<string | null>(null);
  const [confirmedTotalCents, setConfirmedTotalCents] = useState<number>(0);

  // Synchronous guard so rapid double-clicks cannot trigger two order creations
  const submitLockRef = useRef<boolean>(false);

  const orderTotalCents = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.product.priceCents * item.quantity, 0);
  }, [cart]);

  function addProduct(product: Product) {
    setErrorMessage('');
    setOrderRef(null);
    submitLockRef.current = false;

    setCart((prev) => {
      const existing = prev.find((entry) => entry.product.id === product.id);
      if (existing) {
        return prev.map((entry) =>
          entry.product.id === product.id
            ? { ...entry, quantity: entry.quantity + 1 }
            : entry
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  }

  function updateQuantity(productId: string, nextQty: number) {
    setErrorMessage('');
    if (!Number.isFinite(nextQty)) return;

    if (nextQty <= 0) {
      removeItem(productId);
      return;
    }

    setCart((prev) =>
      prev.map((entry) =>
        entry.product.id === productId ? { ...entry, quantity: Math.floor(nextQty) } : entry
      )
    );
  }

  function removeItem(productId: string) {
    setErrorMessage('');
    setCart((prev) => prev.filter((entry) => entry.product.id !== productId));
  }

  function handlePlaceOrder(e: React.FormEvent) {
    e.preventDefault();

    if (submitLockRef.current || isSubmitting) {
      return;
    }

    if (cart.length === 0) {
      setErrorMessage('Your cart is empty. Add at least one item before placing an order.');
      return;
    }

    if (customerName.trim().length === 0) {
      setErrorMessage('Please enter your name to complete the order.');
      return;
    }

    submitLockRef.current = true;
    setIsSubmitting(true);
    setErrorMessage('');

    const totalSnapshot = orderTotalCents;
    const refCode = createOrderReference();

    setConfirmedTotalCents(totalSnapshot);
    setOrderRef(refCode);
    setCart([]);
    setIsSubmitting(false);
  }

  return (
    <main className="page">
      <h1>Mini Checkout</h1>

      <section className="card" aria-label="Products">
        <h2>Products</h2>
        {CATALOG.map((product) => (
          <div key={product.id} className="product-row">
            <div>
              <strong>{product.name}</strong> — <span>{formatMoney(product.priceCents)}</span>
            </div>
            <button
              type="button"
              data-testid={`add-${product.id}`}
              onClick={() => addProduct(product)}
            >
              Add
            </button>
          </div>
        ))}
      </section>

      <section className="card" aria-label="Cart and Checkout">
        <h2>Your Cart</h2>

        {cart.length === 0 ? (
          <p data-testid="empty-cart-note">No items in cart.</p>
        ) : (
          <div>
            {cart.map((item) => {
              const lineTotalCents = item.product.priceCents * item.quantity;
              return (
                <div
                  key={item.product.id}
                  className="cart-row"
                  data-testid={`cart-item-${item.product.id}`}
                >
                  <div>
                    <strong>{item.product.name}</strong>
                    <div>Unit: {formatMoney(item.product.priceCents)}</div>
                  </div>

                  <div className="qty-controls">
                    <label htmlFor={`qty-${item.product.id}`} className="sr-only">
                      Quantity for {item.product.name}
                    </label>
                    <input
                      id={`qty-${item.product.id}`}
                      data-testid={`qty-input-${item.product.id}`}
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.product.id, Number(e.target.value))}
                    />
                    <button
                      type="button"
                      data-testid={`remove-${item.product.id}`}
                      onClick={() => removeItem(item.product.id)}
                    >
                      Remove
                    </button>
                  </div>

                  <strong data-testid={`line-total-${item.product.id}`}>
                    {formatMoney(lineTotalCents)}
                  </strong>
                </div>
              );
            })}
          </div>
        )}

        <div className="total-line">
          <span>Order Total</span>
          <span data-testid="order-total">{formatMoney(orderTotalCents)}</span>
        </div>

        <form onSubmit={handlePlaceOrder} noValidate>
          <div className="field">
            <label htmlFor="customer-name">Full Name (required)</label>
            <input
              id="customer-name"
              data-testid="customer-name-input"
              type="text"
              value={customerName}
              onChange={(e) => {
                setCustomerName(e.target.value);
                if (errorMessage) setErrorMessage('');
              }}
              placeholder="Enter your name"
            />
          </div>

          {errorMessage && (
            <div role="alert" data-testid="validation-error" className="error-msg">
              {errorMessage}
            </div>
          )}

          <div style={{ marginTop: 14 }}>
            <button
              type="submit"
              className="primary-btn"
              data-testid="place-order-btn"
              disabled={isSubmitting || Boolean(orderRef)}
            >
              Place Order
            </button>
          </div>
        </form>
      </section>

      {orderRef && (
        <section
          aria-live="polite"
          data-testid="order-confirmation"
          className="confirmation-box"
        >
          <h2>Order Confirmed</h2>
          <p>
            Thank you, <strong>{customerName.trim()}</strong>. Your order has been placed.
          </p>
          <p>
            Order Reference: <strong data-testid="order-ref">{orderRef}</strong>
          </p>
          <p>Total Charged: {formatMoney(confirmedTotalCents)}</p>
        </section>
      )}
    </main>
  );
}

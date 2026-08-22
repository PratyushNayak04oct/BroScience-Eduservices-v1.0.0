"use client";

import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/utils";
import Button from "@/components/ui/Button";
import { useCart } from "./CartContext";

export default function CartDrawer() {
  const { items, itemCount, subtotal, isOpen, closeCart, removeItem, updateQuantity, clearCart } =
    useCart();

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity duration-300",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={closeCart}
        aria-hidden="true"
      />

      <aside
        className={cn(
          "fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-[var(--border)] bg-[var(--background)] shadow-2xl transition-transform duration-300 ease-out",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
        aria-label="Shopping cart"
        aria-hidden={!isOpen}
      >
        <header className="flex items-center justify-between border-b border-[var(--border)] px-6 py-5">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">
            Your Cart {itemCount > 0 && `(${itemCount})`}
          </h2>
          <button
            type="button"
            onClick={closeCart}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] text-[var(--muted)] transition-colors hover:text-[var(--foreground)]"
            aria-label="Close cart"
          >
            ×
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[var(--border)] text-2xl text-[var(--muted)]">
                🛒
              </div>
              <div>
                <p className="font-medium text-[var(--foreground)]">Your cart is empty</p>
                <p className="mt-1 text-sm text-[var(--muted)]">
                  Browse our premium study materials and add items to get started.
                </p>
              </div>
            </div>
          ) : (
            <ul className="flex flex-col gap-4">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="flex gap-4 rounded-xl border border-[var(--border)] p-4"
                >
                  <div className="h-16 w-16 shrink-0 rounded-lg bg-gradient-to-br from-[var(--brand-maroon)]/20 to-[var(--brand-gold)]/15" />
                  <div className="flex flex-1 flex-col gap-2">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium text-[var(--foreground)]">{item.title}</p>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="text-xs text-[var(--muted)] hover:text-red-500"
                        aria-label={`Remove ${item.title}`}
                      >
                        Remove
                      </button>
                    </div>
                    <p className="text-sm text-[var(--brand-gold)]">{formatPrice(item.price)}</p>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="flex h-7 w-7 items-center justify-center rounded-full border border-[var(--border)] text-sm disabled:opacity-40"
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span className="text-sm font-medium">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="flex h-7 w-7 items-center justify-center rounded-full border border-[var(--border)] text-sm"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <footer className="border-t border-[var(--border)] px-6 py-5">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm text-[var(--muted)]">Subtotal</span>
              <span className="text-lg font-semibold text-[var(--foreground)]">
                {formatPrice(subtotal)}
              </span>
            </div>
            <div className="flex flex-col gap-3">
              <Button className="w-full justify-center">Proceed to Checkout</Button>
              <button
                type="button"
                onClick={clearCart}
                className="text-center text-xs text-[var(--muted)] hover:text-[var(--foreground)]"
              >
                Clear cart
              </button>
            </div>
          </footer>
        )}
      </aside>
    </>
  );
}

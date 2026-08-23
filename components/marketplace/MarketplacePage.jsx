"use client";

import { products } from "@/data/products";
import SectionHeading from "@/components/ui/SectionHeading";
import ProductCard from "@/components/marketplace/ProductCard";
import CartDrawer from "@/components/marketplace/CartDrawer";
import { CartProvider, useCart } from "@/components/marketplace/CartContext";
import Reveal from "@/components/ui/Reveal";

function MarketplaceContent() {
  const { itemCount, openCart } = useCart();
  const featured = products.filter((p) => p.rating >= 4.7).slice(0, 3);
  const rest = products.filter((p) => !featured.find((f) => f.id === p.id));

  return (
    <>
      <div className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="mb-16 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <Reveal>
              <SectionHeading
                eyebrow="Marketplace"
                title="Premium study materials, delivered"
                description="Curated books, workbooks, posters, and digital vouchers — handpicked by our academic team."
              />
            </Reveal>
            <button
              type="button"
              onClick={openCart}
              className="relative rounded-full border border-[var(--border-strong)] px-5 py-2.5 text-sm font-medium text-[var(--foreground)] transition-all duration-200 hover:scale-[1.03] hover:border-[var(--brand-gold)] hover:text-[var(--brand-gold)] active:scale-[0.97]"
            >
              Cart
              {itemCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--brand-gold)] text-xs font-bold text-[var(--brand-black)]">
                  {itemCount}
                </span>
              )}
            </button>
          </div>

          <Reveal>
            <h2 className="mb-6 text-xl font-semibold text-[var(--foreground)]">Featured Products</h2>
          </Reveal>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((product, index) => (
              <Reveal key={product.id} delay={index * 0.06}>
                <ProductCard product={product} featured />
              </Reveal>
            ))}
          </div>

          <Reveal>
            <h2 className="mb-6 mt-16 text-xl font-semibold text-[var(--foreground)]">All Products</h2>
          </Reveal>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {rest.map((product, index) => (
              <Reveal key={product.id} delay={index * 0.03}>
                <ProductCard product={product} />
              </Reveal>
            ))}
          </div>
        </div>
      </div>
      <CartDrawer />
    </>
  );
}

export default function MarketplacePage() {
  return (
    <CartProvider>
      <MarketplaceContent />
    </CartProvider>
  );
}

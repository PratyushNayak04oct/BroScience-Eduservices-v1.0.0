"use client";

import GlassCard from "@/components/ui/GlassCard";
import { formatPrice } from "@/lib/utils";
import { useCart } from "./CartContext";

export default function ProductCard({ product, featured = false }) {
  const { addItem } = useCart();

  return (
    <GlassCard interactive className={`flex h-full flex-col gap-4 p-6 ${featured ? "ring-1 ring-[var(--brand-gold)]/30" : ""}`}>
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-gradient-to-br from-[var(--brand-maroon)]/20 to-[var(--brand-gold)]/15 transition-transform duration-700 group-hover/card:scale-[1.03]">
        {featured && (
          <span className="absolute left-3 top-3 rounded-full bg-[var(--brand-gold)] px-3 py-1 text-xs font-medium text-[var(--brand-black)]">
            Featured
          </span>
        )}
        {!product.inStock && (
          <span className="absolute right-3 top-3 rounded-full bg-[var(--foreground)]/80 px-3 py-1 text-xs text-[var(--background)]">
            Out of Stock
          </span>
        )}
      </div>

      <div className="flex-1">
        <p className="text-xs text-[var(--muted)]">{product.category}</p>
        <h3 className="mt-1 font-semibold leading-snug text-[var(--foreground)]">{product.title}</h3>
        <p className="mt-2 text-sm text-[var(--muted)] line-clamp-2">{product.description}</p>
      </div>

      <div className="flex items-center gap-2 text-xs text-[var(--muted)]">
        <span className="text-[var(--brand-gold)]">★ {product.rating}</span>
        <span>·</span>
        <span>{product.reviews} reviews</span>
      </div>

      <div className="flex flex-col gap-3 border-t border-[var(--border)] pt-4 min-[380px]:flex-row min-[380px]:items-center min-[380px]:justify-between">
        <div className="min-w-0">
          <p className="text-lg font-semibold text-[var(--foreground)]">{formatPrice(product.price)}</p>
          {product.originalPrice > product.price && (
            <p className="text-xs text-[var(--muted)] line-through">
              {formatPrice(product.originalPrice)}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={() => addItem(product)}
          disabled={!product.inStock}
          className="w-full rounded-full bg-[var(--brand-gold)] px-4 py-2 text-xs font-medium text-[var(--brand-black)] transition-all duration-200 hover:scale-[1.04] hover:bg-[#d4b45c] active:scale-[0.96] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 min-[380px]:w-auto"
        >
          Add to Cart
        </button>
      </div>
    </GlassCard>
  );
}

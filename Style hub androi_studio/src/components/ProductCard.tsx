import React, { useState } from 'react';
import { Star, ShoppingCart, Check, Eye, Zap, Plus } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
  onSelectProduct: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelectProduct }) => {
  const { addToCart, getItemQuantity } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  // Immediate reactive subscription to the item quantity in global cart
  const quantityInCart = getItemQuantity(product.id);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  const formatCategory = (cat: string) => {
    switch (cat.toLowerCase()) {
      case "men's clothing":
        return 'Hombre';
      case "women's clothing":
        return 'Mujer';
      case 'jewelery':
        return 'Joyería';
      case 'electronics':
        return 'Electrónica';
      default:
        return cat;
    }
  };

  const getCategoryBadgeClass = (cat: string) => {
    switch (cat.toLowerCase()) {
      case "men's clothing":
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case "women's clothing":
        return 'bg-pink-50 text-pink-700 border-pink-200';
      case 'jewelery':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'electronics':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default:
        return 'bg-neutral-100 text-neutral-700 border-neutral-200';
    }
  };

  const isHighRating = (product.rating?.rate ?? 0) >= 4.0;

  return (
    <div
      onClick={() => onSelectProduct(product)}
      className="group relative bg-white rounded-2xl sm:rounded-3xl border border-neutral-200/90 overflow-hidden hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all duration-300 flex flex-col cursor-pointer"
    >
      {/* Category badge & Top Rating tag */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1 items-start">
        <span
          className={`text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full border shadow-2xs backdrop-blur-xs ${getCategoryBadgeClass(
            product.category
          )}`}
        >
          {formatCategory(product.category)}
        </span>
        {isHighRating && (
          <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-amber-500 text-white shadow-2xs flex items-center gap-0.5">
            <Zap className="w-2.5 h-2.5 fill-current" />
            Top
          </span>
        )}
      </div>

      {/* Quick view icon on hover */}
      <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <div className="p-2 rounded-xl bg-white/95 backdrop-blur-xs shadow-md text-neutral-700 hover:text-indigo-600 transition-colors">
          <Eye className="w-4 h-4" />
        </div>
      </div>

      {/* Image container */}
      <div className="relative w-full pt-[85%] bg-neutral-50/70 p-6 flex items-center justify-center overflow-hidden">
        <img
          src={product.image}
          alt={product.title}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-contain p-6 group-hover:scale-110 transition-transform duration-300 mix-blend-multiply"
        />
      </div>

      {/* Product Information */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between gap-3">
        <div>
          {/* Rating */}
          <div className="flex items-center gap-1.5 mb-1.5">
            <div className="flex items-center text-amber-500">
              <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-500" />
            </div>
            <span className="text-xs font-bold text-neutral-800">
              {product.rating?.rate ? product.rating.rate.toFixed(1) : '4.5'}
            </span>
            <span className="text-xs text-neutral-400">
              ({product.rating?.count ?? 0})
            </span>
            <span className="text-[10px] text-emerald-600 font-semibold ml-auto bg-emerald-50 px-1.5 py-0.5 rounded">
              Envío Rápido
            </span>
          </div>

          {/* Title */}
          <h3
            className="text-xs sm:text-sm font-bold text-neutral-900 line-clamp-2 leading-snug group-hover:text-indigo-600 transition-colors"
            title={product.title}
          >
            {product.title}
          </h3>
        </div>

        {/* Pricing & Real-Time Add to Cart button */}
        <div className="pt-2 border-t border-neutral-100 flex items-center justify-between gap-2 mt-auto">
          <div>
            <span className="text-[11px] text-neutral-400 block -mb-0.5 font-medium">Precio</span>
            <span className="text-base sm:text-lg font-black text-neutral-900 tracking-tight">
              ${product.price.toFixed(2)}
            </span>
          </div>

          <button
            onClick={handleQuickAdd}
            className={`px-3 sm:px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all duration-150 active:scale-95 cursor-pointer ${
              justAdded
                ? 'bg-emerald-600 text-white shadow-xs scale-105'
                : quantityInCart > 0
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
                : 'bg-neutral-900 hover:bg-indigo-600 text-white shadow-xs'
            }`}
            title="Añadir 1 unidad al carrito"
          >
            {justAdded ? (
              <>
                <Check className="w-3.5 h-3.5 animate-in zoom-in-50" />
                <span>+1 Añadido</span>
              </>
            ) : quantityInCart > 0 ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>{quantityInCart} en cesta</span>
                <Plus className="w-3 h-3 ml-0.5 opacity-80" />
              </>
            ) : (
              <>
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>Añadir</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

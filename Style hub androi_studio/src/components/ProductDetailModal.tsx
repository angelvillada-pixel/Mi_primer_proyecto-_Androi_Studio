import React, { useState } from 'react';
import { X, Star, ShoppingBag, Plus, Minus, Check, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose }) => {
  const { addToCart, setIsCartOpen, getItemQuantity } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const quantityInCart = product ? getItemQuantity(product.id) : 0;

  if (!product) return null;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    onClose();
    setIsCartOpen(true);
  };

  const formatCategory = (cat: string) => {
    switch (cat.toLowerCase()) {
      case "men's clothing":
        return "Ropa para Caballero";
      case "women's clothing":
        return "Ropa para Dama";
      case 'jewelery':
        return 'Joyería Fina';
      case 'electronics':
        return 'Electrónica & Gadgets';
      default:
        return cat;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div
        className="relative bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden border border-neutral-200 flex flex-col md:flex-row max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 hover:text-neutral-900 transition-colors"
          aria-label="Cerrar modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Product Image Area */}
        <div className="md:w-1/2 bg-neutral-50/80 p-8 flex items-center justify-center relative border-b md:border-b-0 md:border-r border-neutral-200">
          <div className="w-full h-64 sm:h-80 md:h-96 flex items-center justify-center p-4">
            <img
              src={product.image}
              alt={product.title}
              className="max-h-full max-w-full object-contain mix-blend-multiply drop-shadow-sm transition-transform hover:scale-105 duration-300"
            />
          </div>
          <div className="absolute bottom-4 left-6 text-xs text-neutral-400 font-mono">
            ID de Producto: #{product.id}
          </div>
        </div>

        {/* Product Details & Actions */}
        <div className="md:w-1/2 p-6 sm:p-8 overflow-y-auto flex flex-col justify-between">
          <div>
            {/* Category & Rating */}
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <span className="text-xs font-bold tracking-wider uppercase px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                {formatCategory(product.category)}
              </span>

              <div className="flex items-center gap-1.5 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200/60">
                <Star className="w-4 h-4 fill-amber-400 stroke-amber-500" />
                <span className="text-xs font-bold text-amber-900">
                  {product.rating?.rate ? product.rating.rate.toFixed(1) : '4.5'}
                </span>
                <span className="text-xs text-amber-700">
                  ({product.rating?.count ?? 0} opiniones)
                </span>
              </div>
            </div>

            {/* Title */}
            <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 leading-snug mb-3">
              {product.title}
            </h2>

            {/* Price */}
            <div className="mb-6 flex items-baseline gap-3">
              <span className="text-3xl font-black text-neutral-900">
                ${product.price.toFixed(2)}
              </span>
              <span className="text-xs text-emerald-600 font-semibold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Disponible en inventario
              </span>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">
                Descripción del producto
              </h4>
              <p className="text-sm text-neutral-600 leading-relaxed max-h-36 overflow-y-auto pr-2">
                {product.description}
              </p>
            </div>

            {/* Guarantees */}
            <div className="grid grid-cols-3 gap-2 py-3 px-3.5 bg-neutral-50 rounded-2xl border border-neutral-100 mb-6 text-center">
              <div className="flex flex-col items-center">
                <Truck className="w-4 h-4 text-indigo-600 mb-1" />
                <span className="text-[11px] font-medium text-neutral-600">Envío Rápido</span>
              </div>
              <div className="flex flex-col items-center border-x border-neutral-200">
                <ShieldCheck className="w-4 h-4 text-indigo-600 mb-1" />
                <span className="text-[11px] font-medium text-neutral-600">Garantía 100%</span>
              </div>
              <div className="flex flex-col items-center">
                <RotateCcw className="w-4 h-4 text-indigo-600 mb-1" />
                <span className="text-[11px] font-medium text-neutral-600">Devolución 30d</span>
              </div>
            </div>
          </div>

          {/* Quantity and Actions */}
          <div className="pt-4 border-t border-neutral-200 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-neutral-700">Cantidad:</span>
              <div className="flex items-center gap-3 bg-neutral-100 rounded-xl p-1 border border-neutral-200">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-neutral-700 shadow-2xs hover:bg-neutral-50 disabled:opacity-40 transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-6 text-center font-bold text-sm text-neutral-900">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-neutral-700 shadow-2xs hover:bg-neutral-50 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleAddToCart}
                className={`py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                  added
                    ? 'bg-emerald-600 text-white'
                    : quantityInCart > 0
                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm'
                    : 'bg-neutral-900 hover:bg-neutral-800 text-white active:scale-98 shadow-sm'
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4 animate-in zoom-in-50" />
                    <span>¡Agregado (+{quantity})!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>{quantityInCart > 0 ? `Añadir más (${quantityInCart} en cesta)` : 'Añadir al carrito'}</span>
                  </>
                )}
              </button>

              <button
                onClick={handleBuyNow}
                className="py-3 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-md shadow-indigo-200 active:scale-98 transition-all"
              >
                Comprar ahora
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

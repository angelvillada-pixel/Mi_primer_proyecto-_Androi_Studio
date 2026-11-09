import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    subtotal,
    tax,
    total,
    isCartOpen,
    setIsCartOpen,
  } = useCart();

  const { currentUser } = useUser();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [orderId, setOrderId] = useState<string>('');

  if (!isCartOpen) return null;

  const shippingCost = subtotal > 50 || subtotal === 0 ? 0 : 5.99;
  const finalTotal = total + shippingCost;

  const handleCheckout = () => {
    setIsCheckingOut(true);
    setTimeout(() => {
      setOrderId('ORD-' + Math.floor(100000 + Math.random() * 900000));
      setIsCheckingOut(false);
      setOrderConfirmed(true);
      clearCart();
    }, 1200);
  };

  const handleClose = () => {
    setIsCartOpen(false);
    setOrderConfirmed(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-neutral-900/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between border-l border-neutral-200 animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-5 border-b border-neutral-200 flex items-center justify-between bg-neutral-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-neutral-900">Carrito de Compras</h2>
              <p className="text-xs text-neutral-500">
                {totalItems} {totalItems === 1 ? 'producto' : 'productos'} seleccionados
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-2 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-5">
          {orderConfirmed ? (
            /* Order Success State */
            <div className="py-12 px-4 text-center flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-1">¡Pedido Confirmado!</h3>
              <p className="text-sm text-neutral-600 mb-4">
                Gracias por tu compra en StyleHub. Tu orden ha sido procesada exitosamente.
              </p>

              <div className="w-full bg-neutral-50 rounded-2xl p-4 border border-neutral-200 text-left text-xs space-y-2 mb-6">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Código de orden:</span>
                  <span className="font-mono font-bold text-neutral-800">{orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Comprador:</span>
                  <span className="font-semibold text-neutral-800">
                    {currentUser ? `${currentUser.name.firstname} ${currentUser.name.lastname}` : 'Invitado'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Envío a:</span>
                  <span className="font-semibold text-neutral-800">
                    {currentUser ? `${currentUser.address.street}, ${currentUser.address.city}` : 'Dirección guardada'}
                  </span>
                </div>
              </div>

              <button
                onClick={handleClose}
                className="w-full py-3 rounded-xl bg-neutral-900 text-white font-bold text-sm hover:bg-neutral-800 transition-colors"
              >
                Seguir Comprando
              </button>
            </div>
          ) : cart.length === 0 ? (
            /* Empty Cart State */
            <div className="h-full flex flex-col items-center justify-center text-center py-16 px-4">
              <div className="w-20 h-20 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400 mb-4">
                <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
              </div>
              <h3 className="text-lg font-bold text-neutral-800 mb-1">Tu carrito está vacío</h3>
              <p className="text-sm text-neutral-500 max-w-xs mb-6">
                Añade prendas de moda, accesorios o electrónicos desde el catálogo para comenzar.
              </p>
              <button
                onClick={handleClose}
                className="py-2.5 px-6 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-sm"
              >
                Ver Catálogo
              </button>
            </div>
          ) : (
            /* Item List */
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
                <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                  Artículos
                </span>
                <button
                  onClick={clearCart}
                  className="text-xs text-rose-600 hover:text-rose-800 font-semibold flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Vaciar carrito
                </button>
              </div>

              {cart.map((item) => (
                <div
                  key={item.product.id}
                  className="flex gap-4 p-3 rounded-2xl border border-neutral-100 bg-neutral-50/50 hover:bg-neutral-50 transition-colors"
                >
                  {/* Thumbnail */}
                  <div className="w-20 h-20 bg-white rounded-xl p-2 shrink-0 border border-neutral-200/80 flex items-center justify-center">
                    <img
                      src={item.product.image}
                      alt={item.product.title}
                      className="max-h-full max-w-full object-contain mix-blend-multiply"
                    />
                  </div>

                  {/* Info & Controls */}
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4
                        className="text-xs font-bold text-neutral-800 line-clamp-2 leading-tight"
                        title={item.product.title}
                      >
                        {item.product.title}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-neutral-400 hover:text-rose-600 p-1"
                        title="Eliminar producto"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm font-bold text-neutral-900">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </span>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 bg-white rounded-lg border border-neutral-200 px-1 py-0.5">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="w-6 h-6 rounded flex items-center justify-center text-neutral-600 hover:bg-neutral-100"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold text-neutral-800 w-4 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="w-6 h-6 rounded flex items-center justify-center text-neutral-600 hover:bg-neutral-100"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Drawer Footer with Calculations */}
        {!orderConfirmed && cart.length > 0 && (
          <div className="p-5 border-t border-neutral-200 bg-neutral-50/60 space-y-3">
            <div className="space-y-1.5 text-xs text-neutral-600">
              <div className="flex justify-between">
                <span>Subtotal ({totalItems} items):</span>
                <span className="font-semibold text-neutral-800">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Envío estimado:</span>
                <span className="font-semibold text-neutral-800">
                  {shippingCost === 0 ? (
                    <span className="text-emerald-600">Gratis ($50+)</span>
                  ) : (
                    `$${shippingCost.toFixed(2)}`
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Impuesto estimado (8%):</span>
                <span className="font-semibold text-neutral-800">${tax.toFixed(2)}</span>
              </div>
              <div className="pt-2 border-t border-neutral-200 flex justify-between text-base font-bold text-neutral-900">
                <span>Total a pagar:</span>
                <span className="text-indigo-600">${finalTotal.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={isCheckingOut}
              className="w-full py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white font-bold text-sm shadow-md shadow-indigo-200 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {isCheckingOut ? (
                <span>Procesando pedido...</span>
              ) : (
                <>
                  <span>Completar Pedido</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-neutral-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Checkout seguro simulado de StyleHub</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Calendar, PackageCheck, Compass, Check, LogIn, LogOut, ShieldCheck, UserCheck, KeyRound, ShoppingCart } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';
import { ApiCart, Product } from '../types';

interface UserProfileViewProps {
  products: Product[];
}

export const UserProfileView: React.FC<UserProfileViewProps> = ({ products }) => {
  const { users, currentUser, setCurrentUser, setIsAuthModalOpen, logout } = useUser();
  const { showToast } = useToast();
  const { addToCart, setIsCartOpen } = useCart();
  const [userCarts, setUserCarts] = useState<ApiCart[]>([]);
  const [loadingCarts, setLoadingCarts] = useState(false);

  const handleReorderCart = (c: ApiCart) => {
    let addedCount = 0;
    c.products.forEach((item) => {
      const match = products.find((p) => p.id === item.productId);
      if (match) {
        addToCart(match, item.quantity, true);
        addedCount += item.quantity;
      }
    });
    showToast({
      title: '¡Carrito sincronizado!',
      message: `Se añadieron ${addedCount} productos de la orden #${c.id} a tu carrito.`,
      type: 'success',
    });
    setIsCartOpen(true);
  };

  useEffect(() => {
    if (!currentUser) {
      setUserCarts([]);
      return;
    }
    let active = true;
    setLoadingCarts(true);

    api
      .getUserCarts(currentUser.id)
      .then((carts) => {
        if (active) setUserCarts(carts);
      })
      .catch((err) => {
        console.error('Error fetching user carts', err);
      })
      .finally(() => {
        if (active) setLoadingCarts(false);
      });

    return () => {
      active = false;
    };
  }, [currentUser]);

  const handleSwitchUser = (user: typeof users[0]) => {
    setCurrentUser(user);
    showToast({
      title: `Usuario cambiado: ${user.name.firstname} ${user.name.lastname}`,
      message: `Cargando datos y carritos vinculados a user ID #${user.id}...`,
      type: 'info',
    });
  };

  const handleLogout = () => {
    logout();
    showToast({
      title: 'Sesión cerrada',
      message: 'Has salido de tu cuenta.',
      type: 'info',
    });
  };

  // State when user is not logged in
  if (!currentUser) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 animate-in fade-in duration-300">
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-neutral-200 text-center shadow-lg">
          <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-5 shadow-xs">
            <LogIn className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-black text-neutral-900 mb-2">
            Inicia Sesión en StyleHub
          </h2>
          <p className="text-neutral-500 text-sm max-w-md mx-auto mb-6 leading-relaxed">
            Accede con cualquiera de los usuarios preconfigurados de la Fake Store API para visualizar datos de perfil, direcciones de entrega y el historial de pedidos en tiempo real.
          </p>

          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="py-3 px-8 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-sm shadow-md shadow-indigo-200 transition-all active:scale-98"
          >
            Seleccionar Cuenta de Prueba
          </button>

          {/* Quick preview buttons */}
          <div className="mt-8 pt-6 border-t border-neutral-100">
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider block mb-3">
              O ingresa rápidamente como:
            </span>
            <div className="flex flex-wrap justify-center gap-2">
              {users.slice(0, 3).map((u) => (
                <button
                  key={u.id}
                  onClick={() => handleSwitchUser(u)}
                  className="px-3.5 py-1.5 rounded-xl bg-neutral-100 hover:bg-neutral-200/80 text-xs font-semibold text-neutral-800 transition-colors"
                >
                  {u.name.firstname} ({u.username})
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      
      {/* Top Banner & Profile Overview */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/90 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-neutral-100">
          
          {/* Identity */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-indigo-100 uppercase shrink-0">
              {currentUser.name.firstname[0]}
              {currentUser.name.lastname[0]}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black text-neutral-900">
                  {currentUser.name.firstname} {currentUser.name.lastname}
                </h1>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Sesión Verificada
                </span>
              </div>
              <p className="text-xs sm:text-sm text-neutral-500">
                @{currentUser.username} • FakeStore User #{currentUser.id}
              </p>
              <p className="text-[11px] text-neutral-400 font-mono mt-0.5">
                Endpoint: GET /users/{currentUser.id}
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200/70 text-neutral-800 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <UserCheck className="w-3.5 h-3.5 text-indigo-600" />
              <span>Cambiar Perfil</span>
            </button>

            <button
              onClick={handleLogout}
              className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>

        {/* User Switcher Buttons (AliExpress style fast account switcher) */}
        <div className="py-4 border-b border-neutral-100">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 block mb-2">
            Alternar rápidamente entre perfiles reales de Fake Store API:
          </span>
          <div className="flex flex-wrap gap-2">
            {users.slice(0, 5).map((user) => {
              const isSelected = user.id === currentUser.id;
              return (
                <button
                  key={user.id}
                  onClick={() => handleSwitchUser(user)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-neutral-100 hover:bg-neutral-200/70 text-neutral-700'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5" />}
                  <span>{user.name.firstname} ({user.username})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* User Detailed Metadata Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 pt-6">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-neutral-400 font-medium block">Correo Electrónico</span>
              <span className="text-sm font-semibold text-neutral-900 break-all">
                {currentUser.email}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-neutral-400 font-medium block">Teléfono de Contacto</span>
              <span className="text-sm font-semibold text-neutral-900">{currentUser.phone}</span>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-neutral-400 font-medium block">Dirección de Entrega</span>
              <span className="text-sm font-semibold text-neutral-900">
                {currentUser.address.street} #{currentUser.address.number}
              </span>
              <span className="text-xs text-neutral-500 block">
                {currentUser.address.city}, CP {currentUser.address.zipcode}
              </span>
            </div>
          </div>
        </div>

        {currentUser.address.geolocation && (
          <div className="mt-6 pt-4 border-t border-neutral-100 flex flex-wrap items-center gap-2 text-xs text-neutral-500">
            <Compass className="w-4 h-4 text-indigo-500" />
            <span>Coordenadas Geográficas:</span>
            <span className="font-mono bg-neutral-100 px-2 py-0.5 rounded text-neutral-700">
              Lat: {currentUser.address.geolocation.lat}, Long: {currentUser.address.geolocation.long}
            </span>
            {currentUser.password && (
              <span className="ml-auto flex items-center gap-1 text-[11px] text-neutral-400 font-mono">
                <KeyRound className="w-3 h-3 text-neutral-400" />
                Credencial de prueba: {currentUser.password}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Associated Orders / Carts Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/90 shadow-2xs">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <PackageCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-neutral-900">Historial de Carritos & Compras</h2>
              <p className="text-xs text-neutral-500">
                Recuperados en tiempo real mediante <code className="text-indigo-600 font-mono font-semibold">GET /carts/user/{currentUser.id}</code>
              </p>
            </div>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-neutral-100 text-neutral-700">
            {userCarts.length} {userCarts.length === 1 ? 'registro' : 'registros'}
          </span>
        </div>

        {loadingCarts ? (
          <div className="py-12 text-center text-xs text-neutral-500 flex flex-col items-center">
            <div className="animate-spin rounded-full h-7 w-7 border-3 border-indigo-600 border-t-transparent mb-2"></div>
            <span>Sincronizando carritos desde la API...</span>
          </div>
        ) : userCarts.length === 0 ? (
          <div className="text-center py-12 text-neutral-500 text-sm bg-neutral-50 rounded-2xl border border-neutral-200/60 p-6">
            <p className="font-semibold text-neutral-700 mb-1">Sin carritos registrados</p>
            <p className="text-xs text-neutral-500">Este usuario de prueba aún no registra compras en la Fake Store API.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {userCarts.map((c) => (
              <div
                key={c.id}
                className="border border-neutral-200 rounded-2xl p-4 sm:p-5 bg-neutral-50/50 hover:bg-neutral-50 transition-colors"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-2 border-b border-neutral-200/60">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-neutral-900">Carrito #{c.id}</span>
                    <span className="text-xs text-neutral-400">•</span>
                    <span className="text-xs text-neutral-500 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(c.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 rounded-full">
                      {c.products.reduce((acc, p) => acc + p.quantity, 0)} artículos
                    </span>
                    <button
                      onClick={() => handleReorderCart(c)}
                      className="px-2.5 py-1 rounded-lg bg-neutral-900 hover:bg-indigo-600 text-white text-[11px] font-bold flex items-center gap-1 transition-colors"
                      title="Volver a cargar estos productos al carrito activo"
                    >
                      <ShoppingCart className="w-3 h-3" />
                      <span>Cargar al Carrito</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {c.products.map((item) => {
                    const matchedProduct = products.find((p) => p.id === item.productId);
                    return (
                      <div
                        key={item.productId}
                        className="flex items-center gap-3 p-2.5 bg-white rounded-xl border border-neutral-200/80 text-xs shadow-2xs"
                      >
                        {matchedProduct && (
                          <img
                            src={matchedProduct.image}
                            alt={matchedProduct.title}
                            className="w-10 h-10 object-contain p-1 mix-blend-multiply shrink-0"
                          />
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-neutral-800 truncate">
                            {matchedProduct ? matchedProduct.title : `Producto #${item.productId}`}
                          </p>
                          <p className="text-neutral-500 text-[11px]">
                            Cant: <span className="font-bold text-neutral-700">{item.quantity}</span>
                            {matchedProduct && ` • $${matchedProduct.price}`}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

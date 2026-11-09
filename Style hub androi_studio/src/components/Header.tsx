import React, { useState, useRef, useEffect } from 'react';
import { ShoppingBag, User as UserIcon, Layers, Search, X, LogIn, LogOut, ChevronDown, UserCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';
import { useToast } from '../context/ToastContext';

interface HeaderProps {
  activeTab: 'catalog' | 'profile' | 'architecture';
  setActiveTab: (tab: 'catalog' | 'profile' | 'architecture') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
}) => {
  const { totalItems, subtotal, setIsCartOpen, badgeBounce } = useCart();
  const { currentUser, isAuthenticated, setIsAuthModalOpen, logout } = useUser();
  const { showToast } = useToast();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    showToast({
      title: 'Sesión finalizada',
      message: 'Has cerrado sesión correctamente.',
      type: 'info',
    });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3 sm:gap-6">
          
          {/* Brand Logo */}
          <div
            onClick={() => setActiveTab('catalog')}
            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group shrink-0"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-200 group-hover:scale-105 transition-transform duration-200">
              <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-neutral-900 group-hover:text-indigo-600 transition-colors">
                  Style<span className="text-indigo-600">Hub</span>
                </span>
                <span className="text-[10px] font-bold tracking-wider uppercase px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 hidden md:inline-block">
                  FakeStore API
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 font-medium hidden sm:block">
                Catálogo Premium & MVVM
              </p>
            </div>
          </div>

          {/* Search Bar (AliExpress/MercadoLibre style) */}
          <div className="flex-1 max-w-lg hidden md:block">
            <div className="relative group">
              <Search className="w-4 h-4 text-neutral-400 group-focus-within:text-indigo-600 absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors pointer-events-none" />
              <input
                type="text"
                placeholder="Buscar en el catálogo (ropa, joyería, electrónica)..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (activeTab !== 'catalog') setActiveTab('catalog');
                }}
                className="w-full pl-10 pr-9 py-2.5 text-sm bg-neutral-100/80 hover:bg-neutral-100 focus:bg-white text-neutral-900 placeholder-neutral-400 rounded-full border border-neutral-200/80 focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100/60 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 p-0.5 rounded-full"
                  title="Borrar búsqueda"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Action Navigation */}
          <nav className="flex items-center gap-1.5 sm:gap-3">
            
            {/* Catalog Button */}
            <button
              onClick={() => setActiveTab('catalog')}
              className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'catalog'
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              Catálogo
            </button>

            {/* Architecture Tab */}
            <button
              onClick={() => setActiveTab('architecture')}
              className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all ${
                activeTab === 'architecture'
                  ? 'bg-indigo-600 text-white shadow-xs shadow-indigo-200'
                  : 'text-indigo-600 hover:bg-indigo-50'
              }`}
              title="Especificación de Arquitectura MVVM y ERD"
            >
              <Layers className="w-4 h-4" />
              <span className="hidden sm:inline">Arquitectura</span>
            </button>

            {/* Account / Login Trigger (AliExpress / Shein style) */}
            <div className="relative" ref={dropdownRef}>
              {isAuthenticated && currentUser ? (
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-2 rounded-xl border border-neutral-200 hover:border-neutral-300 bg-white hover:bg-neutral-50 transition-all text-left"
                >
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-violet-600 text-white font-bold flex items-center justify-center text-xs uppercase shadow-2xs">
                    {currentUser.name.firstname[0]}
                    {currentUser.name.lastname[0]}
                  </div>
                  <div className="hidden lg:block leading-none">
                    <span className="text-[10px] text-neutral-400 block font-medium">Cuenta Activa</span>
                    <span className="text-xs font-bold text-neutral-900 truncate max-w-[100px] block">
                      {currentUser.name.firstname}
                    </span>
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 text-neutral-400 transition-transform ${userDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-neutral-900 hover:bg-indigo-600 text-white text-xs sm:text-sm font-bold shadow-xs transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Ingresar</span>
                </button>
              )}

              {/* User Dropdown Menu */}
              {userDropdownOpen && currentUser && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-neutral-200 p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="p-3 bg-neutral-50 rounded-xl mb-2 border border-neutral-100">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-neutral-900">
                        {currentUser.name.firstname} {currentUser.name.lastname}
                      </span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-1.5 py-0.5 rounded-full">
                        En línea
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-500 truncate mt-0.5">
                      {currentUser.email}
                    </p>
                    <p className="text-[10px] text-neutral-400 font-mono mt-0.5">
                      Usuario FakeStore: #{currentUser.id}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <button
                      onClick={() => {
                        setActiveTab('profile');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-neutral-700 hover:bg-neutral-100 flex items-center gap-2 transition-colors"
                    >
                      <UserIcon className="w-4 h-4 text-indigo-600" />
                      <span>Ver Mi Perfil & Carritos</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsAuthModalOpen(true);
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-neutral-700 hover:bg-neutral-100 flex items-center gap-2 transition-colors"
                    >
                      <UserCheck className="w-4 h-4 text-indigo-600" />
                      <span>Cambiar de Usuario (FakeStore)</span>
                    </button>

                    <div className="pt-1 border-t border-neutral-100 mt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Cerrar Sesión</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Shopping Cart Drawer Trigger with Real-Time Reactivity & Bounce Animation */}
            <button
              onClick={() => setIsCartOpen(true)}
              className={`relative p-2.5 sm:px-3.5 sm:py-2.5 rounded-2xl bg-neutral-100 hover:bg-indigo-50 hover:text-indigo-600 text-neutral-800 transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                badgeBounce ? 'scale-105 ring-2 ring-indigo-400 bg-indigo-50/80 shadow-md' : ''
              }`}
              aria-label="Abrir Carrito"
            >
              <div className="relative">
                <ShoppingBag className={`w-5 h-5 transition-transform duration-200 ${badgeBounce ? 'scale-115 text-indigo-600' : ''}`} />
                {totalItems > 0 && (
                  <span
                    key={`header-badge-${totalItems}`}
                    className={`absolute -top-2 -right-2 text-white text-[10px] font-black h-4.5 min-w-[18px] px-1 rounded-full flex items-center justify-center shadow-xs transition-all duration-200 animate-in zoom-in-50 ${
                      badgeBounce ? 'scale-125 bg-emerald-500 ring-2 ring-emerald-200' : 'bg-indigo-600'
                    }`}
                  >
                    {totalItems}
                  </span>
                )}
              </div>
              <span className="hidden md:inline text-xs font-bold">Carrito</span>
              {subtotal > 0 && (
                <span className="hidden xl:inline text-[11px] font-bold text-neutral-500 bg-white/80 px-2 py-0.5 rounded-lg border border-neutral-200/80">
                  ${subtotal.toFixed(2)}
                </span>
              )}
            </button>

          </nav>
        </div>

        {/* Mobile Search Bar (under header) */}
        <div className="pb-3 md:hidden">
          <div className="relative">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (activeTab !== 'catalog') setActiveTab('catalog');
              }}
              className="w-full pl-9 pr-8 py-2 text-xs bg-neutral-100 text-neutral-800 rounded-xl border border-transparent focus:border-indigo-400 focus:bg-white focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

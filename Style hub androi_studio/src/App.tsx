import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { UserProfileView } from './components/UserProfileView';
import { ArchitectureView } from './components/ArchitectureView';
import { AuthModal } from './components/AuthModal';
import { useCart } from './context/CartContext';
import { useUser } from './context/UserContext';
import { api } from './services/api';
import { Product } from './types';
import { Filter, ArrowUpDown, Sparkles, AlertCircle, ShoppingBag, RefreshCw, User as UserIcon, Layers, Grid } from 'lucide-react';

export const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating-desc'>('featured');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState<'catalog' | 'profile' | 'architecture'>('catalog');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { totalItems, setIsCartOpen, badgeBounce } = useCart();
  const { currentUser, isAuthenticated, setIsAuthModalOpen } = useUser();

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [fetchedProducts, fetchedCategories] = await Promise.all([
        api.getProducts(),
        api.getCategories(),
      ]);
      setProducts(fetchedProducts);
      setCategories(fetchedCategories);
    } catch (err: unknown) {
      console.error('Error loading catalog data', err);
      setError('No se pudo conectar temporalmente con la Fake Store API. Mostrando catálogo local.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const formatCategoryLabel = (cat: string) => {
    switch (cat.toLowerCase()) {
      case 'all':
        return 'Todos';
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

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Category filter
    if (selectedCategory !== 'all') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    // Sorting
    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating-desc') {
      result.sort((a, b) => (b.rating?.rate ?? 0) - (a.rating?.rate ?? 0));
    }

    return result;
  }, [products, selectedCategory, searchQuery, sortBy]);

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50/60 text-neutral-900 selection:bg-indigo-500 selection:text-white pb-16 md:pb-0">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Main Body */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* Tab 1: Catalog view */}
        {activeTab === 'catalog' && (
          <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
            
            {/* Hero / Banner with modern gradient & call-out */}
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-neutral-900 via-indigo-950 to-neutral-900 text-white p-6 sm:p-10 shadow-lg">
              <div className="max-w-2xl relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-indigo-200 mb-3">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Colección 2026 • Fake Store API</span>
                </div>
                <h1 className="text-2xl sm:text-4xl font-black tracking-tight mb-2 sm:mb-3">
                  Descubre la moda y accesorios que definen tu estilo
                </h1>
                <p className="text-neutral-300 text-xs sm:text-sm leading-relaxed mb-6">
                  {isAuthenticated && currentUser ? (
                    <span>¡Hola <strong className="text-indigo-300">{currentUser.name.firstname}</strong>! Disfruta de envíos rápidos y catálogo actualizado en tiempo real.</span>
                  ) : (
                    <span>Explora 4 categorías de moda, joyería y gadgets. Inicia sesión con usuarios de Fake Store para sincronizar pedidos.</span>
                  )}
                </p>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => {
                      setSelectedCategory('all');
                      setSearchQuery('');
                    }}
                    className="px-5 py-2.5 rounded-xl bg-white text-neutral-900 font-bold text-xs sm:text-sm hover:bg-neutral-100 transition-colors shadow-xs"
                  >
                    Ver Todo el Catálogo
                  </button>

                  {!isAuthenticated ? (
                    <button
                      onClick={() => setIsAuthModalOpen(true)}
                      className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm transition-colors shadow-xs"
                    >
                      Iniciar Sesión Rápida
                    </button>
                  ) : (
                    <button
                      onClick={() => setActiveTab('profile')}
                      className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm transition-colors border border-white/20 backdrop-blur-xs"
                    >
                      Mi Perfil & Compras
                    </button>
                  )}

                  <button
                    onClick={() => setActiveTab('architecture')}
                    className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white font-semibold text-xs sm:text-sm transition-colors"
                  >
                    Arquitectura MVVM
                  </button>
                </div>
              </div>

              {/* Decorative background glow */}
              <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-20 pointer-events-none bg-radial from-indigo-500 to-transparent"></div>
            </div>

            {/* Filters Bar */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-neutral-200/90 shadow-2xs space-y-4">
              
              {/* Category Pills */}
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
                  <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider mr-1 hidden sm:inline flex items-center gap-1">
                    <Filter className="w-3.5 h-3.5" />
                  </span>

                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                      selectedCategory === 'all'
                        ? 'bg-neutral-900 text-white shadow-xs'
                        : 'bg-neutral-100 hover:bg-neutral-200/70 text-neutral-700'
                    }`}
                  >
                    Todos ({products.length})
                  </button>

                  {categories.map((cat) => {
                    const isSelected = selectedCategory === cat;
                    const count = products.filter((p) => p.category === cat).length;
                    return (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                          isSelected
                            ? 'bg-indigo-600 text-white shadow-xs'
                            : 'bg-neutral-100 hover:bg-neutral-200/70 text-neutral-700'
                        }`}
                      >
                        {formatCategoryLabel(cat)} ({count})
                      </button>
                    );
                  })}
                </div>

                {/* Sort selector */}
                <div className="flex items-center gap-2 ml-auto">
                  <ArrowUpDown className="w-3.5 h-3.5 text-neutral-400" />
                  <span className="text-xs text-neutral-500 font-medium hidden sm:inline">Ordenar por:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="text-xs font-semibold bg-neutral-100 text-neutral-800 py-1.5 px-2.5 rounded-xl border border-transparent focus:border-indigo-400 focus:outline-none cursor-pointer"
                  >
                    <option value="featured">Destacados</option>
                    <option value="price-asc">Precio: Menor a Mayor</option>
                    <option value="price-desc">Precio: Mayor a Menor</option>
                    <option value="rating-desc">Mejor Calificados</option>
                  </select>
                </div>
              </div>

              {/* Status summary */}
              <div className="flex items-center justify-between text-xs text-neutral-500 pt-1 border-t border-neutral-100">
                <span>
                  Mostrando <strong className="text-neutral-800">{filteredProducts.length}</strong> de {products.length} productos
                  {searchQuery && ` para "${searchQuery}"`}
                </span>

                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-indigo-600 hover:underline font-semibold"
                  >
                    Borrar búsqueda
                  </button>
                )}
              </div>
            </div>

            {/* Error or Notice */}
            {error && (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>{error}</span>
                </div>
                <button
                  onClick={loadData}
                  className="px-2.5 py-1 rounded-lg bg-amber-200/70 hover:bg-amber-200 text-amber-900 font-bold flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  Reintentar
                </button>
              </div>
            )}

            {/* Loading Skeleton */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl p-5 border border-neutral-200 animate-pulse space-y-4">
                    <div className="w-full h-48 bg-neutral-200 rounded-xl"></div>
                    <div className="h-4 bg-neutral-200 rounded w-3/4"></div>
                    <div className="h-4 bg-neutral-200 rounded w-1/2"></div>
                    <div className="h-8 bg-neutral-200 rounded-xl"></div>
                  </div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              /* Empty Search Results */
              <div className="text-center py-16 bg-white rounded-3xl border border-neutral-200 p-8">
                <div className="w-16 h-16 rounded-2xl bg-neutral-100 flex items-center justify-center text-neutral-400 mx-auto mb-3">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-neutral-900 mb-1">No se encontraron productos</h3>
                <p className="text-sm text-neutral-500 max-w-sm mx-auto mb-4">
                  No hay artículos que coincidan con tus filtros actuales o término de búsqueda.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setSearchQuery('');
                  }}
                  className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold rounded-xl"
                >
                  Restablecer Filtros
                </button>
              </div>
            ) : (
              /* Products Grid */
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onSelectProduct={setSelectedProduct}
                  />
                ))}
              </div>
            )}

          </div>
        )}

        {/* Tab 2: User Profile */}
        {activeTab === 'profile' && (
          <UserProfileView products={products} />
        )}

        {/* Tab 3: Architecture Spec */}
        {activeTab === 'architecture' && (
          <ArchitectureView />
        )}

      </main>

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      {/* Cart Drawer */}
      <CartDrawer />

      {/* E-Commerce Auth Modal */}
      <AuthModal />

      {/* Mobile Bottom Navigation Bar (AliExpress / Shein style) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-neutral-200 px-4 py-2 md:hidden flex items-center justify-around shadow-lg">
        <button
          onClick={() => setActiveTab('catalog')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-[10px] font-bold transition-colors ${
            activeTab === 'catalog' ? 'text-indigo-600' : 'text-neutral-500'
          }`}
        >
          <Grid className="w-5 h-5" />
          <span>Catálogo</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-[10px] font-bold transition-colors ${
            activeTab === 'profile' ? 'text-indigo-600' : 'text-neutral-500'
          }`}
        >
          <UserIcon className="w-5 h-5" />
          <span>{isAuthenticated && currentUser ? currentUser.name.firstname : 'Perfil'}</span>
        </button>

        <button
          onClick={() => setIsCartOpen(true)}
          className="relative flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-[10px] font-bold text-neutral-500"
        >
          <div className="relative">
            <ShoppingBag className={`w-5 h-5 ${badgeBounce ? 'scale-125 text-indigo-600' : ''}`} />
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-indigo-600 text-white text-[10px] font-black h-4 min-w-[16px] px-1 rounded-full flex items-center justify-center shadow-xs">
                {totalItems}
              </span>
            )}
          </div>
          <span>Carrito</span>
        </button>

        <button
          onClick={() => setActiveTab('architecture')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-[10px] font-bold transition-colors ${
            activeTab === 'architecture' ? 'text-indigo-600' : 'text-neutral-500'
          }`}
        >
          <Layers className="w-5 h-5" />
          <span>Arquitectura</span>
        </button>
      </div>

      {/* Footer */}
      <footer className="mt-auto border-t border-neutral-200 bg-white py-8 text-neutral-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-neutral-800 text-sm">StyleHub</span>
            <span>•</span>
            <span>Catálogo y Modelado de Arquitectura Móvil</span>
          </div>
          <div className="flex items-center gap-4 text-neutral-400">
            <span>Fake Store API (fakestoreapi.com)</span>
            <span>•</span>
            <span>Patrón MVVM & Jetpack Compose Spec</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

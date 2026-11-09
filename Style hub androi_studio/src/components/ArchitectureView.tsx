import React, { useState } from 'react';
import { Layers, Database, ArrowRight, Server, Globe, Cpu, Smartphone, ExternalLink, Code2 } from 'lucide-react';

export const ArchitectureView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'mvvm' | 'erd' | 'endpoints'>('mvvm');

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Intro Header */}
      <div className="bg-gradient-to-br from-neutral-900 via-neutral-800 to-indigo-950 text-white rounded-3xl p-6 sm:p-10 shadow-xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold uppercase tracking-wider mb-4">
          <Layers className="w-3.5 h-3.5" />
          <span>Documentación de Arquitectura de Software</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight mb-3">
          StyleHub – Arquitectura & Modelado de Datos
        </h1>
        <p className="text-neutral-300 text-sm sm:text-base max-w-3xl leading-relaxed">
          Diseño de arquitectura para StyleHub bajo el patrón MVVM y consumo de Fake Store API.
          Esta vista visualiza los diagramas de flujo, el modelo entidad-relación (ERD) y el catálogo de endpoints especificados en el proyecto.
        </p>

        {/* Tab Switcher */}
        <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-neutral-700/60">
          <button
            onClick={() => setActiveTab('mvvm')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'mvvm'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300'
            }`}
          >
            Flujo de Arquitectura MVVM
          </button>
          <button
            onClick={() => setActiveTab('erd')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'erd'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300'
            }`}
          >
            Diagrama Entidad-Relación (ERD)
          </button>
          <button
            onClick={() => setActiveTab('endpoints')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'endpoints'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300'
            }`}
          >
            Endpoints Fake Store API
          </button>
        </div>
      </div>

      {/* Tab 1: MVVM Architecture Flow */}
      {activeTab === 'mvvm' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/90 shadow-xs space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-neutral-900">Patrón Arquitectónico MVVM</h2>
              <p className="text-xs text-neutral-500">
                Separación de responsabilidades: Vista, ViewModel, Repositorio y Cliente HTTP
              </p>
            </div>
          </div>

          {/* Interactive Flow visualization */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-center py-6">
            
            {/* Box 1: UI */}
            <div className="p-5 rounded-2xl bg-indigo-50/80 border-2 border-indigo-200 text-center flex flex-col items-center">
              <Smartphone className="w-8 h-8 text-indigo-600 mb-2" />
              <h3 className="font-bold text-sm text-neutral-900">UI / Vistas</h3>
              <p className="text-[11px] text-neutral-600 mt-1">Jetpack Compose / React Views</p>
              <span className="mt-3 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-indigo-100 text-indigo-800">
                Presentación
              </span>
            </div>

            <div className="hidden md:flex justify-center text-neutral-400">
              <ArrowRight className="w-6 h-6" />
            </div>

            {/* Box 2: ViewModel */}
            <div className="p-5 rounded-2xl bg-violet-50/80 border-2 border-violet-200 text-center flex flex-col items-center">
              <Cpu className="w-8 h-8 text-violet-600 mb-2" />
              <h3 className="font-bold text-sm text-neutral-900">ProductViewModel</h3>
              <p className="text-[11px] text-neutral-600 mt-1">State Flow & Business Logic</p>
              <span className="mt-3 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-violet-100 text-violet-800">
                Estado Reactivo
              </span>
            </div>

            <div className="hidden md:flex justify-center text-neutral-400">
              <ArrowRight className="w-6 h-6" />
            </div>

            {/* Box 3: Repository & Client */}
            <div className="p-5 rounded-2xl bg-emerald-50/80 border-2 border-emerald-200 text-center flex flex-col items-center">
              <Server className="w-8 h-8 text-emerald-600 mb-2" />
              <h3 className="font-bold text-sm text-neutral-900">Repository & Client</h3>
              <p className="text-[11px] text-neutral-600 mt-1">Retrofit / HTTP Fetcher</p>
              <span className="mt-3 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                Capa de Datos
              </span>
            </div>
          </div>

          {/* Code representation from README */}
          <div className="bg-neutral-900 text-neutral-200 p-4 sm:p-5 rounded-2xl font-mono text-xs overflow-x-auto">
            <div className="flex items-center justify-between text-neutral-400 pb-2 mb-2 border-b border-neutral-800">
              <span className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-indigo-400" />
                Diagrama de Flujo (Mermaid Original de Fase 4)
              </span>
            </div>
            <pre className="text-emerald-400 font-mono">
{`flowchart LR
    UI[Jetpack Compose UI] --> VM[ProductViewModel]
    VM --> REPO[ProductRepository]
    REPO --> API[Retrofit Client]
    API --> WEB[(Fake Store API)]
    VM -.-> STATE[UI State Flow]
    STATE --> UI`}
            </pre>
          </div>
        </div>
      )}

      {/* Tab 2: ERD Entity Relationship Diagram */}
      {activeTab === 'erd' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/90 shadow-xs space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-neutral-900">Diagrama Entidad-Relación (ERD)</h2>
              <p className="text-xs text-neutral-500">
                Relaciones de datos entre Categoría, Producto, Usuario, Carrito e Ítems
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Entity 1: Category */}
            <div className="p-4 rounded-2xl border border-neutral-200 bg-neutral-50">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-200 mb-2">
                <span className="font-bold text-xs uppercase text-indigo-700">CATEGORY</span>
                <span className="text-[10px] bg-indigo-100 text-indigo-800 px-1.5 py-0.5 rounded">1..N</span>
              </div>
              <ul className="text-xs space-y-1 font-mono text-neutral-700">
                <li className="flex justify-between">
                  <span>name</span>
                  <span className="text-amber-600 font-bold">PK string</span>
                </li>
              </ul>
            </div>

            {/* Entity 2: Product */}
            <div className="p-4 rounded-2xl border border-indigo-200 bg-indigo-50/40">
              <div className="flex items-center justify-between pb-2 border-b border-indigo-200 mb-2">
                <span className="font-bold text-xs uppercase text-indigo-900">PRODUCT</span>
                <span className="text-[10px] bg-indigo-200 text-indigo-900 px-1.5 py-0.5 rounded">Core</span>
              </div>
              <ul className="text-xs space-y-1 font-mono text-neutral-700">
                <li className="flex justify-between">
                  <span>id</span>
                  <span className="text-amber-600 font-bold">PK int</span>
                </li>
                <li className="flex justify-between">
                  <span>title</span>
                  <span className="text-neutral-500">string</span>
                </li>
                <li className="flex justify-between">
                  <span>price</span>
                  <span className="text-neutral-500">float</span>
                </li>
                <li className="flex justify-between">
                  <span>category</span>
                  <span className="text-indigo-600 font-bold">FK string</span>
                </li>
                <li className="flex justify-between">
                  <span>rating_rate</span>
                  <span className="text-neutral-500">float</span>
                </li>
              </ul>
            </div>

            {/* Entity 3: User */}
            <div className="p-4 rounded-2xl border border-neutral-200 bg-neutral-50">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-200 mb-2">
                <span className="font-bold text-xs uppercase text-neutral-900">USER</span>
                <span className="text-[10px] bg-neutral-200 text-neutral-800 px-1.5 py-0.5 rounded">1..N</span>
              </div>
              <ul className="text-xs space-y-1 font-mono text-neutral-700">
                <li className="flex justify-between">
                  <span>id</span>
                  <span className="text-amber-600 font-bold">PK int</span>
                </li>
                <li className="flex justify-between">
                  <span>email</span>
                  <span className="text-neutral-500">string</span>
                </li>
                <li className="flex justify-between">
                  <span>name</span>
                  <span className="text-neutral-500">string</span>
                </li>
                <li className="flex justify-between">
                  <span>city / street</span>
                  <span className="text-neutral-500">string</span>
                </li>
              </ul>
            </div>

            {/* Entity 4: Cart & Cart Item */}
            <div className="p-4 rounded-2xl border border-neutral-200 bg-neutral-50">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-200 mb-2">
                <span className="font-bold text-xs uppercase text-neutral-900">CART / ITEM</span>
                <span className="text-[10px] bg-neutral-200 text-neutral-800 px-1.5 py-0.5 rounded">N..M</span>
              </div>
              <ul className="text-xs space-y-1 font-mono text-neutral-700">
                <li className="flex justify-between">
                  <span>cart.id</span>
                  <span className="text-amber-600 font-bold">PK int</span>
                </li>
                <li className="flex justify-between">
                  <span>userId</span>
                  <span className="text-indigo-600 font-bold">FK int</span>
                </li>
                <li className="flex justify-between">
                  <span>productId</span>
                  <span className="text-indigo-600 font-bold">FK int</span>
                </li>
                <li className="flex justify-between">
                  <span>quantity</span>
                  <span className="text-neutral-500">int</span>
                </li>
              </ul>
            </div>

          </div>

          <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 text-xs text-neutral-600">
            <span className="font-bold text-neutral-800">Relaciones de Negocio: </span>
            <code className="text-indigo-600">CATEGORY ||--o&#123; PRODUCT</code> (Una categoría contiene múltiples productos),
            <code className="text-indigo-600 ml-2">PRODUCT ||--o&#123; CART_ITEM</code> (Un producto se incluye en ítems de carrito), y
            <code className="text-indigo-600 ml-2">USER ||--o&#123; CART</code> (Un usuario es dueño de sus carritos).
          </div>
        </div>
      )}

      {/* Tab 3: Endpoints Table */}
      {activeTab === 'endpoints' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200/90 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-neutral-900">Catálogo de Endpoints Fake Store API</h2>
                <p className="text-xs text-neutral-500">
                  Consumo documentado en Fase 4 del README.md
                </p>
              </div>
            </div>

            <a
              href="https://fakestoreapi.com"
              target="_blank"
              rel="noreferrer"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              <span>fakestoreapi.com</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-100 text-neutral-700 uppercase font-semibold">
                <tr>
                  <th className="py-3 px-4 rounded-l-xl">Método</th>
                  <th className="py-3 px-4">Endpoint</th>
                  <th className="py-3 px-4">Parámetros</th>
                  <th className="py-3 px-4 rounded-r-xl">Propósito en la App StyleHub</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 font-mono">
                <tr className="hover:bg-neutral-50/60">
                  <td className="py-3.5 px-4"><span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">GET</span></td>
                  <td className="py-3.5 px-4 font-bold text-neutral-900">/products</td>
                  <td className="py-3.5 px-4 text-neutral-500">Ninguno</td>
                  <td className="py-3.5 px-4 font-sans text-neutral-700">Obtener lista de todos los productos del catálogo</td>
                </tr>
                <tr className="hover:bg-neutral-50/60">
                  <td className="py-3.5 px-4"><span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">GET</span></td>
                  <td className="py-3.5 px-4 font-bold text-neutral-900">/products/:id</td>
                  <td className="py-3.5 px-4 text-neutral-500">id (int)</td>
                  <td className="py-3.5 px-4 font-sans text-neutral-700">Obtener información detallada de un producto específico</td>
                </tr>
                <tr className="hover:bg-neutral-50/60">
                  <td className="py-3.5 px-4"><span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">GET</span></td>
                  <td className="py-3.5 px-4 font-bold text-neutral-900">/products/categories</td>
                  <td className="py-3.5 px-4 text-neutral-500">Ninguno</td>
                  <td className="py-3.5 px-4 font-sans text-neutral-700">Obtener el listado de categorías para el filtrado</td>
                </tr>
                <tr className="hover:bg-neutral-50/60">
                  <td className="py-3.5 px-4"><span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">GET</span></td>
                  <td className="py-3.5 px-4 font-bold text-neutral-900">/users</td>
                  <td className="py-3.5 px-4 text-neutral-500">Ninguno</td>
                  <td className="py-3.5 px-4 font-sans text-neutral-700">Obtener el perfil de los usuarios registrados</td>
                </tr>
                <tr className="hover:bg-neutral-50/60">
                  <td className="py-3.5 px-4"><span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">GET</span></td>
                  <td className="py-3.5 px-4 font-bold text-neutral-900">/carts/user/:id</td>
                  <td className="py-3.5 px-4 text-neutral-500">id (int)</td>
                  <td className="py-3.5 px-4 font-sans text-neutral-700">Obtener carritos asociados al usuario activo</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

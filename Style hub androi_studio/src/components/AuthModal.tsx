import React, { useState } from 'react';
import { X, UserCheck, KeyRound, ShoppingBag, ArrowRight, ShieldCheck, Check, Zap, Sparkles } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { useToast } from '../context/ToastContext';

export const AuthModal: React.FC = () => {
  const { users, currentUser, isAuthModalOpen, setIsAuthModalOpen, loginDemoBypass, loginWithCredentials } = useUser();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'quick' | 'credentials'>('quick');
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleQuickLogin = (userId: number) => {
    const result = loginDemoBypass(userId);
    showToast({
      title: `¡Bienvenido, ${result.user.name.firstname}!`,
      message: result.message,
      type: 'success',
    });
  };

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Smart Fallback guarantees 100% login success
      const result = await loginWithCredentials(usernameInput, passwordInput);
      showToast({
        title: result.isFallback ? '¡Acceso Concedido (Modo Demo)!' : '¡Inicio de Sesión Exitoso!',
        message: result.message,
        type: 'success',
      });
      setUsernameInput('');
      setPasswordInput('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDirectBypass = () => {
    const result = loginDemoBypass(1); // Default to John Doe
    showToast({
      title: '¡Acceso Inmediato Concedido!',
      message: `Has ingresado como ${result.user.name.firstname} ${result.user.name.lastname} (Bypass de Presentación).`,
      type: 'success',
    });
  };

  const handlePrefill = (username: string, pass: string) => {
    setUsernameInput(username);
    setPasswordInput(pass);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-neutral-900/65 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div
        className="relative bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 hover:text-neutral-900 transition-colors"
          aria-label="Cerrar modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Brand Header (AliExpress / Shein style) */}
        <div className="bg-gradient-to-r from-neutral-900 via-indigo-950 to-neutral-900 text-white p-6 sm:p-7 relative overflow-hidden">
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-11 h-11 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/30">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black tracking-tight">StyleHub Cuenta</h2>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-200 border border-emerald-400/30 flex items-center gap-1">
                  <Zap className="w-2.5 h-2.5 fill-current" />
                  Garantía 100% Online
                </span>
              </div>
              <p className="text-xs text-neutral-300 mt-0.5">
                Acceso con usuarios de Fake Store API y Bypass Inteligente para presentaciones
              </p>
            </div>
          </div>

          {/* Quick Direct Bypass Banner Button for Instant Presentation */}
          <div className="mt-4 pt-3 border-t border-neutral-800 flex items-center justify-between gap-3">
            <button
              onClick={handleDirectBypass}
              type="button"
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-black text-xs shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 transition-transform active:scale-98"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ingreso Inmediato con 1 Clic (Bypass Demo: John Doe)</span>
            </button>
          </div>

          {/* Tab selector */}
          <div className="flex gap-2 mt-4 pt-3 border-t border-neutral-800">
            <button
              onClick={() => setActiveTab('quick')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'quick'
                  ? 'bg-white text-neutral-900 shadow-sm'
                  : 'bg-white/10 hover:bg-white/15 text-neutral-300'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Perfiles Fake Store (1 Clic)</span>
            </button>

            <button
              onClick={() => setActiveTab('credentials')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'credentials'
                  ? 'bg-white text-neutral-900 shadow-sm'
                  : 'bg-white/10 hover:bg-white/15 text-neutral-300'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Credenciales Clásicas</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-7">
          {activeTab === 'quick' ? (
            /* Tab 1: One-click profile selector */
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs text-neutral-500">
                  Selecciona cualquier usuario para sincronizar sus datos y pedidos:
                </p>
                <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Respuesta Instantánea
                </span>
              </div>

              <div className="max-h-72 overflow-y-auto space-y-2.5 pr-1">
                {users.slice(0, 5).map((user) => {
                  const isCurrent = currentUser?.id === user.id;
                  return (
                    <div
                      key={user.id}
                      onClick={() => handleQuickLogin(user.id)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isCurrent
                          ? 'border-indigo-500 bg-indigo-50/50 ring-2 ring-indigo-200'
                          : 'border-neutral-200 bg-white hover:border-indigo-300 hover:bg-neutral-50'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-600 text-white font-bold flex items-center justify-center shrink-0 shadow-xs uppercase text-sm">
                          {user.name.firstname[0]}
                          {user.name.lastname[0]}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-neutral-900 truncate">
                              {user.name.firstname} {user.name.lastname}
                            </span>
                            <span className="text-[10px] text-neutral-400 font-mono">
                              @{user.username}
                            </span>
                          </div>
                          <p className="text-[11px] text-neutral-500 truncate">
                            {user.email} • {user.address.city}
                          </p>
                        </div>
                      </div>

                      <div className="shrink-0">
                        {isCurrent ? (
                          <span className="text-xs font-bold text-indigo-700 bg-indigo-100 px-2.5 py-1 rounded-full flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" />
                            Activo
                          </span>
                        ) : (
                          <button
                            type="button"
                            className="text-xs font-bold text-white bg-neutral-900 hover:bg-indigo-600 px-3 py-1.5 rounded-xl transition-colors shadow-2xs"
                          >
                            Ingresar
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Tab 2: Classic username / password input with guaranteed Smart Fallback */
            <form onSubmit={handleCredentialsSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1.5">
                  Usuario o Correo
                </label>
                <input
                  type="text"
                  placeholder="ej. johnd, david_r, o cualquier nombre de prueba"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1.5">
                  Contraseña
                </label>
                <input
                  type="password"
                  placeholder="•••••••• (opcional en modo presentación)"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              {/* Prefill helper pills */}
              <div className="pt-1">
                <span className="text-[11px] font-semibold text-neutral-400 block mb-1.5">
                  Cuentas recomendadas de la Fake Store API:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => handlePrefill('johnd', 'm38rmF$')}
                    className="text-[11px] font-mono px-2 py-1 bg-neutral-100 hover:bg-indigo-50 hover:text-indigo-600 text-neutral-700 rounded-lg transition-colors border border-neutral-200"
                  >
                    johnd / m38rmF$
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePrefill('david_r', 'ewedon')}
                    className="text-[11px] font-mono px-2 py-1 bg-neutral-100 hover:bg-indigo-50 hover:text-indigo-600 text-neutral-700 rounded-lg transition-colors border border-neutral-200"
                  >
                    david_r / ewedon
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePrefill('kevinryan', 'kev@nryan')}
                    className="text-[11px] font-mono px-2 py-1 bg-neutral-100 hover:bg-indigo-50 hover:text-indigo-600 text-neutral-700 rounded-lg transition-colors border border-neutral-200"
                  >
                    kevinryan / kev@nryan
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-neutral-900 hover:bg-indigo-600 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 mt-4 active:scale-98 disabled:opacity-70"
              >
                <span>{isSubmitting ? 'Iniciando sesión...' : 'Entrar a mi Cuenta'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Footer note */}
          <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Fallback Inteligente: Garantía de no bloqueo</span>
            </span>
            <span>GET /users sincronizado</span>
          </div>
        </div>
      </div>
    </div>
  );
};

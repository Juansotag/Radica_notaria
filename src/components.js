// Shared UI components: NavBar, Footer, Toast, LoadingBar
import React, { useState, useEffect } from 'https://esm.sh/react@18';
import htm from 'https://esm.sh/htm@3';
const html = htm.bind(React.createElement);

// ── LoadingBar ──────────────────────────────────────────────────────────────
export function LoadingBar({ loading }) {
  const [phase, setPhase] = useState('idle');

  useEffect(() => {
    if (loading) {
      setPhase('loading');
    } else if (phase === 'loading') {
      setPhase('complete');
      const t = setTimeout(() => setPhase('idle'), 400);
      return () => clearTimeout(t);
    }
  }, [loading]);

  if (phase === 'idle') return null;

  return html`
    <div class="fixed top-0 left-0 right-0 z-[9999] h-[3px] bg-[#D6E4F0] overflow-hidden">
      <div class=${`h-full bg-[#2E75B6] rounded-full ${phase === 'loading' ? 'load-progress' : 'load-complete'}`}
           style=${{ width: phase === 'complete' ? '100%' : undefined }}></div>
    </div>
  `;
}

// ── NavBar ───────────────────────────────────────────────────────────────────
export function NavBar({ activeView, onViewChange, pendingCount }) {
  const tabs = [
    { key: 'panel',      label: 'Panel de digitadora' },
    { key: 'formulario', label: 'Formulario constructora' },
  ];

  return html`
    <nav class="bg-white border-b border-[#E2E8F0] sticky top-0 z-40 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">

          <!-- Logo -->
          <div class="flex items-center gap-3 flex-shrink-0">
            <div class="w-9 h-9 bg-gradient-to-br from-[#1F4E79] to-[#2E75B6] rounded-xl flex items-center justify-center shadow-sm">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <rect x="2" y="2" width="6" height="6" fill="white" rx="1.5"/>
                <rect x="10" y="2" width="6" height="6" fill="white" rx="1.5" opacity="0.65"/>
                <rect x="2" y="10" width="6" height="6" fill="white" rx="1.5" opacity="0.65"/>
                <rect x="10" y="10" width="6" height="6" fill="white" rx="1.5"/>
              </svg>
            </div>
            <span class="font-bold text-[#1F4E79] text-xl tracking-tight">NotaríaDoc</span>
          </div>

          <!-- Tabs -->
          <div class="flex items-stretch h-full gap-0">
            ${tabs.map(({ key, label }) => {
              const active = activeView === key;
              return html`
                <button
                  key=${key}
                  id=${`tab-${key}`}
                  onClick=${() => onViewChange(key)}
                  class=${`relative flex items-center gap-2 px-5 py-1 text-sm transition-all duration-200 border-b-[3px] h-full
                    ${active
                      ? 'border-[#2E75B6] text-[#1F4E79] font-semibold'
                      : 'border-transparent text-[#64748B] font-medium hover:text-[#1F4E79] hover:border-[#D6E4F0]'}`}
                >
                  ${label}
                  ${key === 'panel' && pendingCount > 0 && html`
                    <span class="bg-[#D97706] text-white text-[11px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center leading-tight">
                      ${pendingCount}
                    </span>
                  `}
                </button>
              `;
            })}
          </div>
        </div>
      </div>
    </nav>
  `;
}

// ── Footer ───────────────────────────────────────────────────────────────────
export function Footer() {
  return html`
    <footer class="text-center py-5 text-xs text-[#94A3B8] border-t border-[#E2E8F0] bg-white mt-auto">
      Powered by${' '}
      <span class="font-semibold text-[#64748B]">GovLab</span>
      ${' '}·${' '}Universidad de La Sabana
    </footer>
  `;
}

// ── Toast ────────────────────────────────────────────────────────────────────
export function Toast({ message, visible, onDismiss }) {
  useEffect(() => {
    if (visible) {
      const t = setTimeout(onDismiss, 4000);
      return () => clearTimeout(t);
    }
  }, [visible, message]);

  if (!visible) return null;

  return html`
    <div class="fixed bottom-6 right-6 z-[9998] fade-in-up pointer-events-none">
      <div class="bg-[#1A2A3A] text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 max-w-sm pointer-events-auto">
        <div class="w-7 h-7 rounded-full bg-[#16A34A] flex items-center justify-center flex-shrink-0">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2.5 7l3 3 6-6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <p class="text-sm font-medium flex-1">${message}</p>
        <button
          onClick=${onDismiss}
          class="text-white/50 hover:text-white transition-colors text-xl leading-none ml-1"
        >×</button>
      </div>
    </div>
  `;
}

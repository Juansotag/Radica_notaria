// PanelDigitadora — View 2: Internal dashboard for the digitadora
import React, { useState, useMemo } from 'https://esm.sh/react@18';
import htm from 'https://esm.sh/htm@3';
import { MOCK_DRAFTS } from './data.js';
import { formatCOP, formatRelativeTime } from './utils.js';
import { SlideOver } from './slideover.js';

const html = htm.bind(React.createElement);

// Status config
const STATUS = {
  'pendiente':   { label: 'Pendiente',   dot: '#D97706', badge: 'bg-[#FEF3C7] text-[#92400E]' },
  'en-revision': { label: 'En revisión', dot: '#2E75B6', badge: 'bg-[#DBEAFE] text-[#1E40AF]' },
  'aprobado':    { label: 'Aprobado',    dot: '#16A34A', badge: 'bg-[#DCFCE7] text-[#14532D]' },
};

// ── DraftCard ─────────────────────────────────────────────────────────────────
function DraftCard({ draft, onReview }) {
  const st = STATUS[draft.status] || STATUS['pendiente'];
  return html`
    <div
      class="bg-white rounded-xl border border-[#E2E8F0] shadow-sm hover:shadow-md transition-all duration-200 flex flex-col relative overflow-hidden group"
    >
      <!-- Status dot -->
      <div class="absolute top-3 right-3 w-2.5 h-2.5 rounded-full shadow-sm"
           style=${{ background: st.dot }}></div>

      <div class="p-5 flex-1">
        <!-- Top row: constructora badge + time -->
        <div class="flex items-center gap-2 mb-3">
          <span class="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#D6E4F0] text-[#1F4E79]">
            ${draft.constructora}
          </span>
          <span class="text-xs text-[#94A3B8] ml-auto pr-5">${formatRelativeTime(draft.fecha)}</span>
        </div>

        <!-- Buyer -->
        <h3 class="font-semibold text-[#1A1A1A] text-base leading-tight mb-0.5 pr-4">${draft.nombreComprador}</h3>
        <p class="text-xs text-[#64748B] mb-1">CC ${draft.cedula}</p>
        <p class="text-xs text-[#94A3B8] mb-3 truncate">${draft.proyecto}</p>

        <!-- Value -->
        <p class="text-lg font-bold text-[#1F4E79]">${formatCOP(draft.valorVenta)}</p>
        <span class=${`text-[10px] font-semibold mt-1 inline-block px-2 py-0.5 rounded-full ${st.badge}`}>${st.label}</span>
      </div>

      <div class="border-t border-[#F1F5F9] px-5 py-3 flex gap-2">
        <button
          id=${`btn-revisar-${draft.id}`}
          onClick=${() => onReview(draft)}
          class="flex-1 bg-[#1F4E79] hover:bg-[#2E75B6] text-white text-xs font-semibold py-2.5 rounded-lg transition-all duration-200"
        >Revisar borrador</button>
        <button
          onClick=${() => onReview(draft)}
          class="flex-1 border border-[#1F4E79] text-[#1F4E79] hover:bg-[#D6E4F0] text-xs font-semibold py-2.5 rounded-lg transition-all duration-200"
        >Ver detalles</button>
      </div>
    </div>
  `;
}

// ── PanelDigitadora ───────────────────────────────────────────────────────────
export function PanelDigitadora({ onToast }) {
  const [drafts, setDrafts]     = useState(MOCK_DRAFTS);
  const [filter, setFilter]     = useState('pendiente');
  const [search, setSearch]     = useState('');
  const [selected, setSelected] = useState(null);
  const [sort, setSort]         = useState('recientes');

  // Derived counts
  const counts = useMemo(() => ({
    pendiente:   drafts.filter(d => d.status === 'pendiente').length,
    'en-revision': drafts.filter(d => d.status === 'en-revision').length,
    aprobado:    drafts.filter(d => d.status === 'aprobado').length,
    todos:       drafts.length,
  }), [drafts]);

  // Filtered + sorted list
  const visible = useMemo(() => {
    let list = filter === 'todos' ? drafts : drafts.filter(d => d.status === filter);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(d =>
        d.nombreComprador.toLowerCase().includes(q) ||
        d.cedula.includes(q)
      );
    }
    return sort === 'recientes'
      ? [...list].sort((a, b) => b.fecha - a.fecha)
      : [...list].sort((a, b) => a.fecha - b.fecha);
  }, [drafts, filter, search, sort]);

  const filterLabel = {
    pendiente: 'Borradores pendientes', 'en-revision': 'En revisión',
    aprobado: 'Aprobados', todos: 'Todos los borradores',
  }[filter];

  const handleApprove = (updatedDraft) => {
    setDrafts(prev => prev.map(d => d.id === updatedDraft.id ? { ...updatedDraft, status: 'aprobado' } : d));
    setSelected(null);
    onToast('Borrador aprobado. La radicadora ha sido notificada.');
  };

  const FILTERS = [
    { key: 'pendiente',   label: 'Pendientes',   countCls: 'bg-[#FEF3C7] text-[#92400E]' },
    { key: 'en-revision', label: 'En revisión',   countCls: 'bg-[#DBEAFE] text-[#1E40AF]' },
    { key: 'aprobado',    label: 'Aprobados',     countCls: 'bg-[#DCFCE7] text-[#14532D]' },
    { key: 'todos',       label: 'Todos',         countCls: 'bg-[#F1F5F9] text-[#475569]' },
  ];

  return html`
    <div class="flex-1 flex overflow-hidden" style=${{ minHeight: 'calc(100vh - 64px - 52px)' }}>

      <!-- Sidebar (desktop) -->
      <aside class="hidden md:flex flex-col w-[240px] bg-white border-r border-[#E2E8F0] flex-shrink-0">
        <div class="px-4 pt-5 pb-2">
          <p class="text-[10px] font-bold uppercase tracking-widest text-[#94A3B8] mb-3">Borradores</p>

          <!-- Filter tabs -->
          <div class="flex flex-col gap-1">
            ${FILTERS.map(({ key, label, countCls }) => html`
              <button key=${key}
                onClick=${() => setFilter(key)}
                class=${`flex items-center justify-between w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 text-left
                  ${filter === key
                    ? 'bg-[#D6E4F0] text-[#1F4E79]'
                    : 'text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#1A1A1A]'}`}>
                ${label}
                <span class=${`text-[11px] font-bold px-2 py-0.5 rounded-full ${countCls}`}>
                  ${counts[key]}
                </span>
              </button>
            `)}
          </div>
        </div>

        <!-- Search -->
        <div class="px-4 pt-3 mt-2 border-t border-[#F1F5F9]">
          <div class="relative">
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
            </svg>
            <input
              type="text" placeholder="Buscar por nombre o cédula..."
              value=${search} onInput=${e => setSearch(e.target.value)}
              class="w-full pl-9 pr-3 py-2 text-xs border border-[#E2E8F0] rounded-xl bg-[#F8FAFC] text-[#1A1A1A] placeholder-[#94A3B8] focus:border-[#1F4E79]" />
          </div>
        </div>
      </aside>

      <!-- Mobile filter bar -->
      <div class="md:hidden fixed top-16 left-0 right-0 z-30 bg-white border-b border-[#E2E8F0] px-4 py-2 flex gap-2 overflow-x-auto">
        ${FILTERS.map(({ key, label }) => html`
          <button key=${key} onClick=${() => setFilter(key)}
            class=${`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all
              ${filter === key ? 'bg-[#1F4E79] text-white' : 'bg-[#F1F5F9] text-[#64748B]'}`}>
            ${label} (${counts[key]})
          </button>
        `)}
      </div>

      <!-- Main content -->
      <main class="flex-1 overflow-y-auto p-6 md:p-8 mt-12 md:mt-0">
        <!-- Top bar -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h2 class="text-xl font-bold text-[#1A1A1A]">${filterLabel}</h2>
            <p class="text-sm text-[#64748B]">${visible.length} borrador${visible.length !== 1 ? 'es' : ''} encontrado${visible.length !== 1 ? 's' : ''}</p>
          </div>
          <select
            value=${sort} onChange=${e => setSort(e.target.value)}
            class="border border-[#E2E8F0] rounded-xl px-4 py-2 text-sm text-[#374151] bg-white cursor-pointer focus:border-[#1F4E79] self-start">
            <option value="recientes">Más recientes primero</option>
            <option value="antiguos">Más antiguos primero</option>
          </select>
        </div>

        <!-- Draft grid -->
        ${visible.length > 0 ? html`
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
            ${visible.map(d => html`
              <${DraftCard} key=${d.id} draft=${d} onReview=${setSelected} />
            `)}
          </div>
        ` : html`
          <!-- Empty state -->
          <div class="flex flex-col items-center justify-center py-24 text-center">
            <div class="w-20 h-20 rounded-full bg-[#F1F5F9] flex items-center justify-center mb-4">
              <svg width="36" height="36" fill="none" viewBox="0 0 24 24" stroke="#94A3B8" stroke-width="1.5">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
            </div>
            <p class="text-[#64748B] font-semibold mb-1">No hay borradores</p>
            <p class="text-sm text-[#94A3B8]">No se encontraron resultados con los filtros actuales.</p>
          </div>
        `}
      </main>
    </div>

    <!-- SlideOver -->
    ${selected && html`
      <${SlideOver}
        draft=${selected}
        onClose=${() => setSelected(null)}
        onApprove=${handleApprove}
      />
    `}
  `;
}

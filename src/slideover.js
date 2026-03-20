// SlideOver — Right-panel for deed review, field editing, and approval
import React, { useState } from 'https://esm.sh/react@18';
import htm from 'https://esm.sh/htm@3';
import { formatCOP, formatCOPInput, parseCOPInput, formatColombianDate } from './utils.js';

const html = htm.bind(React.createElement);

const STATUS_CFG = {
  'pendiente':   { label: 'Pendiente',   cls: 'bg-[#FEF3C7] text-[#92400E] border-[#FCD34D]' },
  'en-revision': { label: 'En revisión', cls: 'bg-[#DBEAFE] text-[#1E40AF] border-[#93C5FD]' },
  'aprobado':    { label: 'Aprobado',    cls: 'bg-[#DCFCE7] text-[#14532D] border-[#86EFAC]' },
};

// Key-value row inside "Datos del formulario" tab
const KV = ({ label, value }) => html`
  <div class="contents">
    <dt class="text-xs font-medium text-[#64748B] uppercase tracking-wide py-2 pr-3">${label}</dt>
    <dd class="text-sm text-[#1A1A1A] font-medium py-2 border-b border-[#F1F5F9]">${value || '—'}</dd>
  </div>
`;

// ── Deed Preview ──────────────────────────────────────────────────────────────
function DeedPreview({ draft }) {
  const hi = (text) => html`<mark class="bg-[#FEF3C7] text-[#92400E] px-0.5 rounded font-medium">${text}</mark>`;
  const today = formatColombianDate(new Date());

  return html`
    <div class="bg-white border border-[#E2E8F0] rounded-xl p-8 mx-1 shadow-sm text-[#1A1A1A] text-sm leading-relaxed font-serif">
      <!-- Header -->
      <div class="text-center mb-6">
        <p class="font-bold text-base uppercase tracking-widest">ESCRITURA PÚBLICA No. ${hi(draft.escrituraNo)}</p>
        <p class="font-semibold text-sm mt-1 uppercase tracking-wider text-[#374151]">NOTARÍA SEGUNDA DEL CÍRCULO DE ZIPAQUIRÁ</p>
        <p class="text-xs text-[#64748B] mt-1">Zipaquirá, ${hi(today)}</p>
        <div class="mt-4 border-t-2 border-[#1F4E79]"></div>
      </div>

      <!-- Body -->
      <p class="mb-4 text-justify">
        En la ciudad de Zipaquirá, Departamento de Cundinamarca, República de Colombia, ante mí, 
        NOTARIO SEGUNDO DEL CÍRCULO DE ZIPAQUIRÁ, comparecieron de una parte, como vendedor, 
        la sociedad ${hi(draft.constructora + ' S.A.S.')}, y de la otra parte, como comprador, 
        ${hi(draft.nombreComprador)}, mayor de edad, domiciliado/a en esta ciudad, identificado/a 
        con Cédula de Ciudadanía No. ${hi(draft.cedula)}, expedida en Zipaquirá.
      </p>

      <p class="mb-4 text-justify">
        Los comparecientes me manifiestan que han celebrado un contrato de compraventa sobre el 
        inmueble ubicado en ${hi(draft.direccion)}, correspondiente al proyecto inmobiliario 
        ${hi(draft.proyecto)}, inscrito en la Oficina de Instrumentos Públicos de Zipaquirá.
      </p>

      <p class="mb-4 text-justify">
        El precio acordado de la compraventa es la suma de ${hi(formatCOP(draft.valorVenta))}, 
        que el comprador declara haber recibido a su entera satisfacción. La forma de pago 
        convenida entre las partes corresponde a la modalidad ${hi(draft.formaPago)}.
        ${draft.formaPago !== 'Contado' ? html`
          El valor del crédito hipotecario concedido por ${hi(draft.banco)} asciende a la suma 
          de ${hi(formatCOP(draft.valorCredito))}, conforme a las condiciones pactadas en el 
          contrato de mutuo con garantía hipotecaria.
        ` : ''}
      </p>

      <p class="mb-4 text-justify">
        El vendedor garantiza que el inmueble objeto de esta escritura se encuentra libre de 
        todo gravamen, embargo, limitación al dominio, condición resolutoria y demás 
        afectaciones que pudieren menoscabar el derecho de dominio que se transfiere. Así mismo, 
        declara que se halla al día en el pago de los impuestos, contribuciones y servicios 
        públicos correspondientes al inmueble vendido.
      </p>

      ${draft.caja && draft.caja !== 'Ninguna' ? html`
        <p class="mb-4 text-justify">
          De conformidad con lo establecido en la normativa vigente, el comprador acredita 
          afiliación a la Caja de Compensación Familiar ${hi(draft.caja)}, conforme a los 
          documentos aportados al expediente notarial.
        </p>
      ` : ''}

      <p class="mb-6 text-justify">
        Para constancia, se firma la presente escritura pública en la Notaría Segunda del 
        Círculo de Zipaquirá, en la fecha indicada en el encabezado de este instrumento.
      </p>

      <!-- Signature lines -->
      <div class="grid grid-cols-2 gap-8 mt-10 pt-6 border-t border-[#E2E8F0]">
        <div class="text-center">
          <div class="border-b border-[#374151] mb-1 h-8"></div>
          <p class="text-xs text-[#64748B] font-semibold uppercase">${draft.constructora} S.A.S.</p>
          <p class="text-xs text-[#94A3B8]">Vendedor — Representante Legal</p>
        </div>
        <div class="text-center">
          <div class="border-b border-[#374151] mb-1 h-8"></div>
          <p class="text-xs text-[#64748B] font-semibold uppercase">${draft.nombreComprador}</p>
          <p class="text-xs text-[#94A3B8]">Comprador — CC ${draft.cedula}</p>
        </div>
      </div>
      <div class="text-center mt-10 pt-4 border-t border-[#E2E8F0]">
        <div class="border-b border-[#374151] mb-1 h-8 max-w-[200px] mx-auto"></div>
        <p class="text-xs text-[#64748B] font-semibold uppercase">Notario Segundo del Círculo de Zipaquirá</p>
      </div>
    </div>
  `;
}

// ── Edit Form ─────────────────────────────────────────────────────────────────
function EditForm({ draft, onSave, onCancel }) {
  const [data, setData] = useState({ ...draft });
  const set = (k, v) => setData(d => ({ ...d, [k]: v }));

  const inCls = 'w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm text-[#1A1A1A] bg-white focus:border-[#1F4E79]';

  return html`
    <div class="p-4 space-y-3">
      <p class="text-xs font-semibold text-[#64748B] uppercase tracking-wide mb-3">Editar datos del borrador</p>

      ${[
        { key: 'nombreComprador', label: 'Nombre completo' },
        { key: 'cedula',          label: 'Cédula' },
        { key: 'email',           label: 'Correo electrónico' },
        { key: 'direccion',       label: 'Dirección del inmueble' },
      ].map(({ key, label }) => html`
        <div key=${key}>
          <label class="text-xs font-medium text-[#64748B] block mb-1">${label}</label>
          <input class=${inCls} type="text" value=${data[key]}
            onInput=${e => set(key, e.target.value)} />
        </div>
      `)}

      <div>
        <label class="text-xs font-medium text-[#64748B] block mb-1">Valor de venta (COP)</label>
        <div class="flex">
          <span class="flex items-center px-3 bg-[#F1F5F9] border border-r-0 border-[#E2E8F0] rounded-l-lg text-xs text-[#64748B] font-semibold">COP $</span>
          <input class="flex-1 border border-[#E2E8F0] rounded-r-lg px-3 py-2 text-sm"
            type="text" inputmode="numeric"
            value=${formatCOPInput(String(data.valorVenta))}
            onInput=${e => set('valorVenta', parseCOPInput(e.target.value))} />
        </div>
      </div>

      <div class="flex gap-3 pt-2">
        <button onClick=${() => onSave(data)}
          class="flex-1 bg-[#1F4E79] text-white text-sm font-semibold py-2.5 rounded-lg hover:bg-[#2E75B6] transition-colors">
          Guardar cambios
        </button>
        <button onClick=${onCancel}
          class="flex-1 border border-[#E2E8F0] text-[#64748B] text-sm font-medium py-2.5 rounded-lg hover:bg-[#F8FAFC] transition-colors">
          Cancelar
        </button>
      </div>
    </div>
  `;
}

// ── SlideOver ─────────────────────────────────────────────────────────────────
export function SlideOver({ draft, onClose, onApprove }) {
  const [tab, setTab]           = useState('datos');   // 'datos' | 'borrador'
  const [editing, setEditing]   = useState(false);
  const [localDraft, setLocalD] = useState(draft);
  const [confirming, setConfirm] = useState(false);

  const st = STATUS_CFG[localDraft.status] || STATUS_CFG['pendiente'];

  const handleSave = (updated) => {
    setLocalD(updated);
    setEditing(false);
  };

  const handleApprove = () => {
    setConfirm(false);
    onApprove(localDraft);
  };

  return html`
    <!-- Backdrop -->
    <div class="fixed inset-0 z-40 overlay-bg" onClick=${onClose}></div>

    <!-- Panel -->
    <div class="fixed right-0 top-0 bottom-0 z-50 w-full lg:w-1/2 bg-white shadow-2xl flex flex-col slide-in-right overflow-hidden">

      <!-- Header -->
      <div class="px-6 py-4 border-b border-[#E2E8F0] bg-gradient-to-r from-[#1F4E79] to-[#2E75B6]">
        <div class="flex items-start justify-between">
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-3 mb-1">
              <span class=${`text-xs font-semibold px-2.5 py-1 rounded-full border ${st.cls}`}>${st.label}</span>
            </div>
            <h2 class="text-xl font-bold text-white truncate">${localDraft.nombreComprador}</h2>
            <p class="text-[#D6E4F0] text-xs mt-0.5">${localDraft.constructora} · ${localDraft.proyecto}</p>
          </div>
          <button onClick=${onClose}
            class="text-white/70 hover:text-white transition-colors w-9 h-9 flex items-center justify-center rounded-xl hover:bg-white/10 flex-shrink-0 ml-2 text-xl font-light">
            ×
          </button>
        </div>
      </div>

      <!-- Tabs -->
      <div class="flex border-b border-[#E2E8F0] bg-white px-4">
        ${[['datos', 'Datos del formulario'], ['borrador', 'Borrador generado']].map(([k, l]) => html`
          <button key=${k} onClick=${() => { setTab(k); setEditing(false); }}
            class=${`px-4 py-3 text-sm font-medium border-b-2 transition-all duration-200 mr-1
              ${tab === k
                ? 'border-[#2E75B6] text-[#1F4E79]'
                : 'border-transparent text-[#64748B] hover:text-[#1F4E79]'}`}>
            ${l}
          </button>
        `)}
      </div>

      <!-- Scrollable Content -->
      <div class="flex-1 overflow-y-auto">
        ${tab === 'datos' && !editing && html`
          <div class="p-6">
            <dl class="grid grid-cols-[auto_1fr] gap-x-4">
              <${KV} label="Constructora"    value=${localDraft.constructora} />
              <${KV} label="Proyecto"        value=${localDraft.proyecto} />
              <${KV} label="Banco hipoteca"  value=${localDraft.banco} />
              <${KV} label="Caja comp."      value=${localDraft.caja} />
              <${KV} label="Nombre"          value=${localDraft.nombreComprador} />
              <${KV} label="Cédula"          value=${'CC ' + localDraft.cedula} />
              <${KV} label="Correo"          value=${localDraft.email} />
              <${KV} label="Dirección"       value=${localDraft.direccion} />
              ${localDraft.ciiu && html`<${KV} label="CIIU" value=${localDraft.ciiu} />`}
              <${KV} label="Valor de venta"  value=${formatCOP(localDraft.valorVenta)} />
              <${KV} label="Forma de pago"   value=${localDraft.formaPago} />
              ${localDraft.valorCredito ? html`<${KV} label="Crédito hipotecario" value=${formatCOP(localDraft.valorCredito)} />` : null}
              <${KV} label="Escritura No."   value=${localDraft.escrituraNo} />
            </dl>
          </div>
        `}

        ${tab === 'datos' && editing && html`
          <${EditForm}
            draft=${localDraft}
            onSave=${handleSave}
            onCancel=${() => setEditing(false)}
          />
        `}

        ${tab === 'borrador' && html`
          <div class="p-4">
            <${DeedPreview} draft=${localDraft} />
          </div>
        `}
      </div>

      <!-- Sticky Action Bar -->
      <div class="px-6 py-4 border-t border-[#E2E8F0] bg-white flex items-center justify-between gap-3 flex-shrink-0">
        <button
          onClick=${() => { setTab('datos'); setEditing(!editing); }}
          class="flex items-center gap-2 px-4 py-2.5 border border-[#E2E8F0] text-[#374151] text-sm font-medium rounded-xl hover:bg-[#F8FAFC] transition-all duration-200"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M9.5 1.5l3 3-8 8H1.5v-3l8-8z" stroke="#374151" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Corregir datos
        </button>

        ${localDraft.status !== 'aprobado' ? html`
          <button
            id="btn-aprobar"
            onClick=${() => setConfirm(true)}
            class="flex items-center gap-2 px-5 py-2.5 bg-[#16A34A] hover:bg-[#15803D] text-white text-sm font-bold rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8l4 4 6-6" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Aprobar borrador
          </button>
        ` : html`
          <span class="flex items-center gap-2 px-5 py-2.5 bg-[#DCFCE7] text-[#14532D] text-sm font-bold rounded-xl">
            ✓ Borrador aprobado
          </span>
        `}
      </div>
    </div>

    <!-- Confirmation Dialog -->
    ${confirming && html`
      <div class="fixed inset-0 z-[60] flex items-center justify-center">
        <div class="absolute inset-0 overlay-bg" onClick=${() => setConfirm(false)}></div>
        <div class="relative bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 scale-in">
          <div class="w-14 h-14 rounded-full bg-[#FEF3C7] flex items-center justify-center mx-auto mb-4">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <path d="M14 10v4m0 4h.01M11.07 5.26l-7.5 13A2 2 0 005.3 21h17.4a2 2 0 001.73-3l-7.5-13a2 2 0 00-3.46 0z"
                stroke="#D97706" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <h3 class="text-lg font-bold text-[#1A1A1A] text-center mb-2">¿Confirmar aprobación?</h3>
          <p class="text-sm text-[#64748B] text-center leading-relaxed mb-6">
            ¿Está seguro de que desea aprobar este borrador?<br/>
            Esta acción notificará a la radicadora.
          </p>
          <div class="flex gap-3">
            <button onClick=${() => setConfirm(false)}
              class="flex-1 border border-[#E2E8F0] text-[#374151] text-sm font-medium py-3 rounded-xl hover:bg-[#F8FAFC] transition-colors">
              Cancelar
            </button>
            <button id="btn-confirmar-aprobacion" onClick=${handleApprove}
              class="flex-1 bg-[#16A34A] text-white text-sm font-bold py-3 rounded-xl hover:bg-[#15803D] transition-colors">
              Confirmar aprobación
            </button>
          </div>
        </div>
      </div>
    `}
  `;
}

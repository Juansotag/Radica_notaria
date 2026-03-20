// FormularioConstructora — View 1: External form for construction companies
import React, { useState, useRef } from 'https://esm.sh/react@18';
import htm from 'https://esm.sh/htm@3';
import { CONSTRUCTORAS, PROJECTS_BY_CONSTRUCTORA, BANCOS, CAJAS } from './data.js';
import { formatCOPInput, parseCOPInput } from './utils.js';

const html = htm.bind(React.createElement);

// ── Small reusable primitives ─────────────────────────────────────────────────

const SectionHeader = ({ num, title }) => html`
  <div class="flex items-center gap-3 mb-5">
    <div class="w-6 h-6 rounded-full bg-[#1F4E79] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">${num}</div>
    <div class="border-l-4 border-[#1F4E79] pl-3">
      <h3 class="font-semibold text-[#1A1A1A] text-sm uppercase tracking-wide">${title}</h3>
    </div>
  </div>
`;

const Lbl = ({ children, required }) => html`
  <label class="block text-sm font-medium text-[#374151] mb-1.5">
    ${children}
    ${required && html`<span class="text-[#DC2626] ml-0.5">*</span>`}
  </label>
`;

const ErrMsg = ({ msg }) => msg
  ? html`<p class="mt-1.5 text-xs text-[#DC2626] flex items-center gap-1"><span>⚠</span>${msg}</p>`
  : null;

const baseCls  = 'w-full border rounded-lg px-3 py-2.5 text-sm text-[#1A1A1A] bg-white transition-all duration-200';
const inCls    = (e) => `${baseCls} ${e ? 'border-[#DC2626]' : 'border-[#E2E8F0]'}`;
const selCls   = (e) => `${baseCls} ${e ? 'border-[#DC2626]' : 'border-[#E2E8F0]'} cursor-pointer`;
const hdnCls   = 'border-[#E2E8F0] rounded-r-lg px-3 py-2.5 text-sm text-[#1A1A1A] w-full border transition-all duration-200';

const Field = ({ label, required, error, children }) => html`
  <div class="mb-4">
    <${Lbl} required=${required}>${label}<//>
    ${children}
    <${ErrMsg} msg=${error} />
  </div>
`;

// ── Success State ─────────────────────────────────────────────────────────────
function SuccessState({ onReset }) {
  return html`
    <div class="flex flex-col items-center justify-center py-16 px-8 text-center scale-in">
      <div class="w-28 h-28 rounded-full bg-[#DCFCE7] border-4 border-[#86EFAC] flex items-center justify-center mb-7 shadow-lg">
        <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
          <circle cx="26" cy="26" r="24" stroke="#16A34A" stroke-width="2"/>
          <path d="M15 26l8 8 14-14" stroke="#16A34A" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <h2 class="text-2xl font-bold text-[#1A1A1A] mb-3">¡Orden enviada exitosamente!</h2>
      <p class="text-[#64748B] text-sm max-w-md leading-relaxed mb-8">
        Su borrador de escritura será generado automáticamente.<br/>
        La digitadora recibirá una notificación de inmediato.
      </p>
      <button
        id="btn-enviar-otra"
        onClick=${onReset}
        class="bg-[#1F4E79] hover:bg-[#2E75B6] text-white font-semibold px-8 py-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
      >Enviar otra orden</button>
    </div>
  `;
}

// ── Main Form ─────────────────────────────────────────────────────────────────
export function FormularioConstructora({ onLoadingChange }) {
  const EMPTY = {
    constructora:'', proyecto:'', banco:'', caja:'',
    nombre:'', cedula:'', email:'', direccion:'', ciiu:'',
    valorVenta:'', formaPago:'', valorCredito:'', archivo: null,
  };

  const [f, setF]               = useState(EMPTY);
  const [errors, setErrors]     = useState({});
  const [submitted, setSubmit]  = useState(false);
  const [dragging, setDragging] = useState(false);
  const [tooltip, setTooltip]   = useState(false);
  const fileRef                 = useRef();

  const set = (key, val) => setF(prev => ({ ...prev, [key]: val }));

  const validate = () => {
    const e = {};
    if (!f.constructora) e.constructora = 'Seleccione una constructora';
    if (!f.proyecto)     e.proyecto     = 'Seleccione un proyecto';
    if (!f.banco)        e.banco        = 'Seleccione un banco';
    if (!f.caja)         e.caja         = 'Seleccione una caja de compensación';

    if (!f.nombre || f.nombre.trim().split(/\s+/).length < 2)
      e.nombre = 'Ingrese nombre y apellidos completos (mínimo 2 palabras)';

    const ced = f.cedula.replace(/\D/g, '');
    if (!ced || ced.length < 6 || ced.length > 10)
      e.cedula = 'La cédula debe tener entre 6 y 10 dígitos';

    if (!f.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email))
      e.email = 'Ingrese un correo electrónico válido';

    if (!f.direccion) e.direccion = 'Ingrese la dirección del inmueble';

    const val = parseCOPInput(f.valorVenta);
    if (!f.valorVenta || val < 10000000)
      e.valorVenta = 'El valor mínimo de venta es $10.000.000 COP';

    if (!f.formaPago) e.formaPago = 'Seleccione una forma de pago';

    if ((f.formaPago === 'Hipoteca' || f.formaPago === 'Mixto') && !f.valorCredito)
      e.valorCredito = 'Ingrese el valor del crédito hipotecario';

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    onLoadingChange(true);
    await new Promise(r => setTimeout(r, 1500));
    onLoadingChange(false);
    setSubmit(true);
  };

  const handleFile = (file) => {
    if (!file) return;
    if (file.type !== 'application/pdf') return;
    if (file.size > 10 * 1024 * 1024) return;
    set('archivo', file);
  };

  if (submitted) {
    return html`<${SuccessState} onReset=${() => { setF(EMPTY); setErrors({}); setSubmit(false); }} />`;
  }

  const proyectos     = f.constructora ? (PROJECTS_BY_CONSTRUCTORA[f.constructora] || []) : [];
  const showCredito   = f.formaPago === 'Hipoteca' || f.formaPago === 'Mixto';

  return html`
    <div>
      <!-- Card Header -->
      <div class="mb-8">
        <p class="text-xs text-[#94A3B8] uppercase tracking-widest font-medium mb-1">Notaría Segunda de Zipaquirá</p>
        <h1 class="text-2xl font-bold text-[#1A1A1A] mb-1.5">Orden de Escrituración</h1>
        <p class="text-sm text-[#64748B]">Complete todos los campos obligatorios para radicar su solicitud.</p>
        <div class="mt-5 h-px bg-gradient-to-r from-[#1F4E79] via-[#2E75B6] to-transparent"></div>
      </div>

      <!-- Section 1 -->
      <div class="mb-8 p-6 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
        <${SectionHeader} num="1" title="Información del Proyecto" />
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-5">

          <${Field} label="Constructora" required error=${errors.constructora}>
            <select id="sel-constructora" class=${selCls(errors.constructora)} value=${f.constructora}
              onChange=${e => { set('constructora', e.target.value); set('proyecto', ''); }}>
              <option value="">Seleccione...</option>
              ${CONSTRUCTORAS.map(c => html`<option key=${c} value=${c}>${c}</option>`)}
            </select>
          <//>

          <${Field} label="Proyecto inmobiliario" required error=${errors.proyecto}>
            <select id="sel-proyecto" class=${selCls(errors.proyecto)} value=${f.proyecto}
              onChange=${e => set('proyecto', e.target.value)} disabled=${!f.constructora}>
              <option value="">${f.constructora ? 'Seleccione...' : 'Primero seleccione constructora'}</option>
              ${proyectos.map(p => html`<option key=${p} value=${p}>${p}</option>`)}
            </select>
          <//>

          <${Field} label="Banco de hipoteca" required error=${errors.banco}>
            <select id="sel-banco" class=${selCls(errors.banco)} value=${f.banco}
              onChange=${e => set('banco', e.target.value)}>
              <option value="">Seleccione...</option>
              ${BANCOS.map(b => html`<option key=${b} value=${b}>${b}</option>`)}
            </select>
          <//>

          <${Field} label="Caja de compensación" required error=${errors.caja}>
            <select id="sel-caja" class=${selCls(errors.caja)} value=${f.caja}
              onChange=${e => set('caja', e.target.value)}>
              <option value="">Seleccione...</option>
              ${CAJAS.map(c => html`<option key=${c} value=${c}>${c}</option>`)}
            </select>
          <//>
        </div>
      </div>

      <!-- Section 2 -->
      <div class="mb-8 p-6 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
        <${SectionHeader} num="2" title="Información del Comprador" />
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-5">

          <${Field} label="Nombre completo" required error=${errors.nombre}>
            <input id="inp-nombre" class=${inCls(errors.nombre)} type="text"
              placeholder="Ej. María Fernanda Gómez López"
              value=${f.nombre} onInput=${e => set('nombre', e.target.value)} />
          <//>

          <${Field} label="Número de cédula" required error=${errors.cedula}>
            <input id="inp-cedula" class=${inCls(errors.cedula)} type="text" inputmode="numeric"
              placeholder="Ej. 1020304050" maxlength="10"
              value=${f.cedula} onInput=${e => set('cedula', e.target.value.replace(/\D/g,''))} />
          <//>

          <div class="sm:col-span-2">
            <${Field} label="Correo electrónico" required error=${errors.email}>
              <input id="inp-email" class=${inCls(errors.email)} type="email"
                placeholder="correo@ejemplo.com"
                value=${f.email} onInput=${e => set('email', e.target.value)} />
            <//>
          </div>

          <div class="sm:col-span-2">
            <${Field} label="Dirección del inmueble" required error=${errors.direccion}>
              <input id="inp-direccion" class=${inCls(errors.direccion)} type="text"
                placeholder="Ej. Cra. 23 No. 45-12 Apto 301, Zipaquirá"
                value=${f.direccion} onInput=${e => set('direccion', e.target.value)} />
            <//>
          </div>

          <div class="sm:col-span-2 mb-4">
            <div class="flex items-center gap-2 mb-1.5">
              <label class="text-sm font-medium text-[#374151]">CIIU (actividad económica)</label>
              <div class="relative">
                <button
                  onMouseEnter=${() => setTooltip(true)}
                  onMouseLeave=${() => setTooltip(false)}
                  class="w-4 h-4 rounded-full bg-[#94A3B8] text-white text-[10px] font-bold flex items-center justify-center cursor-help"
                >?</button>
                ${tooltip && html`
                  <div class="absolute left-6 top-0 z-20 bg-[#1A1A1A] text-white text-xs rounded-lg px-3 py-2 w-60 shadow-xl fade-down">
                    Código de actividad económica del comprador. Opcional.
                  </div>
                `}
              </div>
            </div>
            <input id="inp-ciiu" class=${inCls(false)} type="text" placeholder="Ej. 4111"
              value=${f.ciiu} onInput=${e => set('ciiu', e.target.value)} />
          </div>
        </div>
      </div>

      <!-- Section 3 -->
      <div class="mb-8 p-6 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
        <${SectionHeader} num="3" title="Condiciones de la Compra" />
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-5">

          <div class="mb-4">
            <${Lbl} required>Valor de venta<//>
            <div class="flex">
              <span class="flex items-center px-3 bg-[#E2E8F0] border border-r-0 border-[#E2E8F0] rounded-l-lg text-xs text-[#64748B] font-semibold whitespace-nowrap">
                COP $
              </span>
              <input id="inp-valor" class=${hdnCls} type="text" inputmode="numeric"
                placeholder="285.000.000"
                value=${f.valorVenta}
                onInput=${e => set('valorVenta', formatCOPInput(e.target.value))} />
            </div>
            <${ErrMsg} msg=${errors.valorVenta} />
          </div>

          <div class="mb-4">
            <${Lbl} required>Forma de pago<//>
            <div class="mt-2 flex flex-col gap-2.5">
              ${['Contado', 'Hipoteca', 'Mixto'].map(op => html`
                <label key=${op} class="flex items-center gap-3 cursor-pointer group">
                  <input type="radio" name="formaPago" value=${op}
                    checked=${f.formaPago === op}
                    onChange=${() => set('formaPago', op)}
                    class="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span class="text-sm text-[#1A1A1A] group-hover:text-[#1F4E79] transition-colors">${op}</span>
                </label>
              `)}
            </div>
            <${ErrMsg} msg=${errors.formaPago} />
          </div>
        </div>

        ${showCredito && html`
          <div class="fade-down mt-1">
            <div class="mb-4">
              <${Lbl} required>Valor del crédito hipotecario<//>
              <div class="flex">
                <span class="flex items-center px-3 bg-[#E2E8F0] border border-r-0 border-[#E2E8F0] rounded-l-lg text-xs text-[#64748B] font-semibold whitespace-nowrap">
                  COP $
                </span>
                <input id="inp-credito" class=${hdnCls} type="text" inputmode="numeric"
                  placeholder="220.000.000"
                  value=${f.valorCredito}
                  onInput=${e => set('valorCredito', formatCOPInput(e.target.value))} />
              </div>
              <${ErrMsg} msg=${errors.valorCredito} />
            </div>
          </div>
        `}
      </div>

      <!-- Section 4: File Upload -->
      <div class="mb-8 p-6 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
        <${SectionHeader} num="4" title="Documentos de Soporte" />

        ${f.archivo ? html`
          <div class="flex items-center gap-3 p-4 bg-[#F0FDF4] border border-[#86EFAC] rounded-xl">
            <div class="w-8 h-8 rounded-full bg-[#DCFCE7] flex items-center justify-center flex-shrink-0">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 7l3.5 3.5L12 3" stroke="#16A34A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <span class="text-sm text-[#15803D] font-medium flex-1 truncate">${f.archivo.name}</span>
            <button onClick=${() => set('archivo', null)}
              class="text-[#64748B] hover:text-[#DC2626] transition-colors w-6 h-6 flex items-center justify-center rounded-full hover:bg-[#FEE2E2]">
              ×
            </button>
          </div>
        ` : html`
          <div
            class=${`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all duration-200
              ${dragging
                ? 'border-[#1F4E79] bg-[#D6E4F0]'
                : 'border-[#CBD5E1] bg-white hover:border-[#2E75B6] hover:bg-[#F0F7FF]'}`}
            onClick=${() => fileRef.current?.click()}
            onDragOver=${e => { e.preventDefault(); setDragging(true); }}
            onDragLeave=${() => setDragging(false)}
            onDrop=${e => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); }}
          >
            <svg class="mx-auto mb-3 text-[#94A3B8]" width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
            </svg>
            <p class="text-sm font-semibold text-[#374151]">Arrastre su archivo aquí o haga clic para seleccionar</p>
            <p class="text-xs text-[#94A3B8] mt-1">PDF, máximo 10 MB. Opcional.</p>
            <input ref=${fileRef} type="file" accept=".pdf" class="hidden"
              onChange=${e => handleFile(e.target.files[0])} />
          </div>
        `}
      </div>

      <!-- Submit -->
      <button
        id="btn-enviar-orden"
        onClick=${handleSubmit}
        class="w-full bg-gradient-to-r from-[#1F4E79] to-[#2E75B6] hover:from-[#2E75B6] hover:to-[#1F4E79] text-white font-bold py-4 rounded-xl transition-all duration-300 text-sm shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
      >
        Enviar orden
      </button>
    </div>
  `;
}

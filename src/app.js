// Root App component — wires together NavBar, views, Footer, LoadingBar, Toast
import React, { useState } from 'https://esm.sh/react@18';
import { createRoot } from 'https://esm.sh/react-dom@18/client';
import htm from 'https://esm.sh/htm@3';

import { NavBar, Footer, Toast, LoadingBar } from './components.js';
import { FormularioConstructora }            from './formulario.js';
import { PanelDigitadora }                   from './panel.js';
import { MOCK_DRAFTS }                       from './data.js';

const html = htm.bind(React.createElement);

function App() {
  const [view, setView]       = useState('panel');   // 'panel' | 'formulario'
  const [loading, setLoading] = useState(false);
  const [toast, setToast]     = useState({ visible: false, message: '' });
  const [drafts, setDrafts]   = useState(MOCK_DRAFTS);

  const pendingCount = drafts.filter(d => d.status === 'pendiente').length;

  const showToast = (message) => setToast({ visible: true, message });
  const hideToast = ()         => setToast(t => ({ ...t, visible: false }));

  return html`
    <div class="flex flex-col min-h-screen">
      <${LoadingBar} loading=${loading} />

      <${NavBar}
        activeView=${view}
        onViewChange=${setView}
        pendingCount=${pendingCount}
      />

      <div class="flex-1 flex flex-col">
        ${view === 'formulario' && html`
          <div class="flex-1 flex items-start justify-center py-10 px-4">
            <div class="w-full max-w-[720px] bg-white rounded-2xl shadow-md p-8 sm:p-10">
              <${FormularioConstructora}
                onLoadingChange=${setLoading}
              />
            </div>
          </div>
        `}

        ${view === 'panel' && html`
          <${PanelDigitadora}
            drafts=${drafts}
            onDraftsChange=${setDrafts}
            onToast=${showToast}
          />
        `}
      </div>

      <${Footer} />

      <${Toast}
        message=${toast.message}
        visible=${toast.visible}
        onDismiss=${hideToast}
      />
    </div>
  `;
}

// Mount
const root = createRoot(document.getElementById('root'));
root.render(html`<${App} />`);

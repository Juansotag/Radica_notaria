# NotaríaDoc

**Suite de automatización documental para Notaría Segunda de Zipaquirá**

Sistema web para la gestión de órdenes de escrituración de bienes raíces. Permite a constructoras radicar solicitudes de escritura y a la digitadora de la notaría revisar, corregir y aprobar los borradores generados automáticamente.

---

## Vistas principales

| Vista | Descripción |
|---|---|
| **Panel de digitadora** | Dashboard interno. Revisión, corrección y aprobación de borradores. |
| **Formulario constructora** | Formulario externo. Radicación de órdenes de escrituración. |

---

## Stack tecnológico

- **React 18** vía ESM CDN (`esm.sh`) + **htm** para JSX sin compilación
- **Tailwind CSS** Play CDN
- **Google Fonts** — Inter
- Sin backend — estado local + datos de prueba

---

## Ejecutar localmente

No requiere Node.js. Sirve los archivos con cualquier servidor HTTP:

**Con Python (Anaconda):**
```bash
python -m http.server 3000
```

**Con Node.js (si está instalado):**
```bash
npx serve .
```

Luego abrir: **http://localhost:3000**

---

## Despliegue en Railway

### Pasos

1. En [Railway.app](https://railway.app), crear un nuevo proyecto → **"Deploy from GitHub repo"**
2. Seleccionar el repositorio `Juansotag/Radica_notaria`
3. Railway detecta automáticamente el `package.json` y usa **Node.js**
4. El comando de inicio es `serve . --listen $PORT` (ya configurado)
5. Railway asigna automáticamente un dominio público (p. ej. `radica-notaria.up.railway.app`)

> **No se requiere ninguna variable de entorno.** El puerto lo asigna Railway automáticamente mediante `$PORT`.

### Comandos npm disponibles

```bash
npm start     # Producción (usa $PORT — Railway)
npm run dev   # Desarrollo local en puerto 3000
```

---

## Estructura del proyecto

```
Radica_notaria/
├── index.html           ← Punto de entrada HTML
├── package.json         ← Config Node.js para Railway
└── src/
    ├── app.js           ← Componente raíz, monta la app
    ├── data.js          ← Datos de prueba (7 borradores, constructoras, bancos)
    ├── utils.js         ← formatCOP, formatColombianDate, formatRelativeTime
    ├── components.js    ← NavBar, Footer, Toast, LoadingBar
    ├── formulario.js    ← Vista 1: Formulario de constructora
    ├── slideover.js     ← Panel lateral de revisión y escritura pública
    └── panel.js         ← Vista 2: Panel de la digitadora
```

---

## Funcionalidades implementadas

### Formulario constructora
- ✅ 4 secciones con validación completa
- ✅ Selector de proyecto filtrado por constructora
- ✅ Campo de crédito hipotecario animado (aparece al seleccionar Hipoteca/Mixto)
- ✅ Zona de carga de PDF por drag-and-drop
- ✅ Tooltip CIIU
- ✅ Estado de éxito con animación al enviar

### Panel de digitadora
- ✅ Sidebar con filtros (Pendientes / En revisión / Aprobados / Todos) + contadores
- ✅ Búsqueda en tiempo real por nombre o cédula
- ✅ Ordenamiento por fecha
- ✅ 7 borradores de prueba con datos colombianos realistas
- ✅ Panel lateral (slide-over) con borrador de escritura pública
- ✅ Campos resaltados en ámbar en el borrador generado
- ✅ Edición inline de datos
- ✅ Flujo de aprobación con diálogo de confirmación y toast

---

*Desarrollado con ❤️ — GovLab · Universidad de La Sabana*

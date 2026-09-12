# Centro Técnico Telefonía & Ordenadores — Alcobendas

Sitio web profesional y autogestionable para el negocio **Centro Técnico Telefonía & Ordenadores**, en **Calle de la Constitución, 35, 28100 Alcobendas (Madrid)** · ☎ **691 14 21 82**.

Stack: **HTML** + **Tailwind CSS** + **JavaScript** moderno, con **Decap CMS** (antiguo Netlify CMS) para que el cliente gestione el contenido **sin tocar código**.

---

## 🗂️ Estructura de archivos

```
.
├── index.html              # Página principal (hero, servicios, catálogo, opiniones, contacto)
├── gracias.html            # Página de confirmación del formulario
├── admin/
│   ├── index.html          # Panel del CMS (Decap) — se abre en /admin
│   └── config.yml          # Configuración del CMS (colecciones editables)
├── content/                # Contenido editable desde el CMS (lo lee el JS)
│   ├── ajustes.json        # Teléfono, WhatsApp, dirección, horario, hero
│   ├── productos.json      # Catálogo / inventario
│   └── testimonios.json    # Opiniones de clientes
├── assets/
│   ├── css/styles.css      # Estilos propios (complementan Tailwind)
│   ├── js/main.js          # Lógica: menú, carga CMS, filtros, búsqueda
│   └── uploads/            # Imágenes subidas desde el CMS
├── sitemap.xml             # Mapa del sitio para Google
├── robots.txt              # Reglas para buscadores
├── site.webmanifest        # PWA / icono
├── netlify.toml            # Despliegue y cabeceras en Netlify
├── tailwind.config.js      # Config de Tailwind para compilar en producción
├── package.json            # Scripts (build de Tailwind + servidor CMS local)
└── src/input.css           # Entrada de Tailwind
```

---

## 🚀 Puesta en marcha rápida

### Opción A — Ver en local (sin instalar nada)
El sitio usa Tailwind por CDN, así que solo necesitas servirlo por HTTP (no abrir el archivo directamente, porque el catálogo se carga con `fetch`):

```bash
# Con Python (ya instalado en la mayoría de equipos)
python3 -m http.server 8080
# Abre http://localhost:8080
```

### Opción B — Desplegar en Netlify (recomendado, con CMS)
1. Sube este repositorio a GitHub (rama de producción: `main`).
2. En [Netlify](https://app.netlify.com) → **Add new site → Import from GitHub** y elige el repo.
3. Deja la configuración por defecto (ya incluida en `netlify.toml`) y pulsa **Deploy**.

---

## 🔐 Activar el panel de gestión (/admin)

El CMS usa **Netlify Identity + Git Gateway** para que el cliente entre con usuario y contraseña:

1. En Netlify → tu sitio → **Integrations / Identity** → **Enable Identity**.
2. En **Identity → Services → Git Gateway** → **Enable Git Gateway**.
3. En **Identity → Registration**, pon *Invite only* (más seguro) y pulsa **Invite users** para invitar al email del cliente.
4. El cliente abre **`https://TU-SITIO.netlify.app/admin/`**, acepta la invitación, crea su contraseña y ya puede editar.

> Si no quieres usar Netlify Identity, abre `admin/config.yml` y cambia el bloque `backend` a la opción **github** (ya viene comentada). En ese caso el acceso se hace con la cuenta de GitHub.

### ¿Qué puede editar el cliente sin código?
Desde **/admin**:
- **⚙️ Ajustes del negocio**: teléfono, WhatsApp, dirección, horario, imagen del inicio.
- **🛒 Catálogo**: añadir/editar/quitar fundas, smartphones y accesorios con foto, precio, categoría, stock y "destacado". Aparecen al instante en la web con filtros y buscador.
- **⭐ Opiniones**: testimonios de clientes con estrellas.

Cada cambio se guarda como un commit en el repositorio y se publica automáticamente.

---

## 🛠️ (Opcional) Compilar Tailwind para producción

El CDN funciona perfectamente, pero para máximo rendimiento puedes generar un CSS optimizado:

```bash
npm install
npm run build          # genera assets/css/tailwind.css minificado
```

Después, en `index.html` y `gracias.html` sustituye:
```html
<script src="https://cdn.tailwindcss.com"></script>
<!-- y el bloque <script>tailwind.config = ...</script> -->
```
por:
```html
<link rel="stylesheet" href="/assets/css/tailwind.css" />
```

Para previsualizar el CMS en local sin Netlify:
```bash
npm run cms            # arranca decap-server en el puerto 8081
# (local_backend ya está activado en admin/config.yml)
```

---

## 📈 SEO local incluido

- Etiquetas `<title>`, `meta description` y Open Graph optimizadas para **"reparar móvil en Alcobendas"**.
- **Datos estructurados** `schema.org/ElectronicsStore` con dirección (NAP), horario, teléfono y zona de servicio → favorece Google Maps y el panel de negocio.
- `sitemap.xml` y `robots.txt` listos.
- Meta `geo` con coordenadas de Alcobendas.

### Tras publicar, recomendado:
1. Dar de alta / reclamar el **Perfil de Empresa de Google** (Google Business Profile) con los mismos datos.
2. Enviar `sitemap.xml` en **Google Search Console**.
3. Reemplazar el dominio de ejemplo `centrotecnicoalcobendas.es` por el dominio real en: `index.html` (canonical/OG), `sitemap.xml` y `robots.txt`.

---

## ✏️ Datos del negocio (para cambiar en un sitio)
- **Teléfono/WhatsApp**: desde **/admin → Ajustes** (se actualiza en toda la web).
- **Dominio**: buscar y reemplazar `centrotecnicoalcobendas.es`.
- **Mapa**: el iframe de Google Maps ya apunta a la dirección; se actualiza si cambias la dirección en el HTML.

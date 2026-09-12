# Joyería Bruno — Alcobendas

Sitio web elegante y autogestionable para **Joyería Bruno** (joyería y relojería), en **Calle Constitución, 65, 28100 Alcobendas (Madrid)** · ☎ **916 52 62 12** · WhatsApp **620 93 67 22**.

Stack: **HTML + Tailwind CSS + JavaScript** con **Decap CMS** en `/admin` para gestionar el contenido sin tocar código. Estética de lujo (ónix + dorado, tipografía serif).

## Estructura
```
index.html            # Portada: hero, colecciones, servicios, catálogo, opiniones, contacto
gracias.html          # Confirmación de formularios
admin/                # Panel Decap CMS (index.html + config.yml)
content/              # Contenido editable (ajustes, productos, testimonios JSON)
assets/css, assets/js # Estilos y lógica
assets/uploads/       # Imágenes subidas desde el CMS
sitemap.xml, robots.txt, site.webmanifest, netlify.toml
```

## Ver en local
```bash
python3 -m http.server 8080   # http://localhost:8080
```

## Desplegar (Netlify, con panel /admin operativo)
1. Sube el repo a GitHub (rama `main`).
2. Netlify → Import from GitHub → Deploy (config en `netlify.toml`).
3. Identity → Enable Identity + Enable Git Gateway → invita al email del cliente.
4. El cliente entra en `/admin/` y edita colecciones, precios, fotos y opiniones.

## SEO local
- Meta tags orientados a "joyería/relojería Alcobendas".
- JSON-LD `JewelryStore` con dirección, horario, teléfono y **rating 4,9/5 (149 reseñas)**.
- `sitemap.xml` y `robots.txt` listos.
- Tras publicar: reclamar el Perfil de Empresa de Google, enviar el sitemap en Search Console y sustituir el dominio de ejemplo por el real.

## Pendiente de contenido real (cliente)
- Subir **fotos reales** de joyas y relojes (clave en joyería).
- Sustituir las opiniones de ejemplo por reseñas reales.
- Cambiar el botón de Google por el enlace real de "Escribir reseña".

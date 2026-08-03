# ARTETOSCO — sitio web

Sitio estático **HTML5 + CSS3 + JavaScript ES6 (vanilla)**. Sin React, sin build,
sin dependencias de Node en producción.

## Estructura

```
public/site/                 ← raíz publicada en Netlify
├── index.html               Inicio
├── sobre-nosotros.html
├── servicios.html
├── servicio-construcciones.html
├── servicio-muebles.html
├── servicio-creaciones.html
├── productos.html
├── portfolio.html
├── contacto.html
├── 404.html
├── robots.txt
├── sitemap.xml
├── css/style.css            Sistema de diseño completo (variables CSS)
├── js/main.js               Módulos ES6 (nav, scroll, filtros, lightbox, formularios)
└── assets/images/           Fotografías optimizadas
```

Cada página comparte el mismo bloque `<header>` y `<footer>`, marcados con
comentarios `<!-- header.php -->` / `<!-- footer.php -->` para migrar a WordPress
o a includes PHP sin reescribir el diseño.

## Despliegue en Netlify

1. Conecta el repositorio en Netlify.
2. La configuración ya está en `netlify.toml`:
   - **Publish directory:** `public/site`
   - **Build command:** vacío (no hay build)
3. Deploy. También sirve arrastrar la carpeta `public/site` a Netlify Drop.

## Mantenimiento

- **Colores, tipografías y espaciados:** variables en `:root` dentro de `css/style.css`.
- **Contenido:** texto plano dentro del HTML, sin plantillas ni compilación.
- **Nuevas páginas:** duplica una existente, cambia `<title>`, `description`,
  `canonical`, `og:*` y añade la URL a `sitemap.xml`.
- **SEO:** cada página tiene título único, meta description, canonical, Open Graph,
  Twitter Card y una única `<h1>`. La home incluye JSON-LD de la organización.
- **Dominio propio:** reemplaza `https://artestosco.lovable.app` en `canonical`,
  `og:url`, `sitemap.xml` y `robots.txt`.

# Estudio Frontier - Nueva versión del sitio

Este proyecto contiene una versión renovada del sitio web del estudio legal.

## Estructura

- `web/index.html` — página principal.
- `web/styles.css` — estilos responsive.
- `web/script.js` — menú móvil y comportamiento de navegación.

## Cómo usar

1. Abre `web/index.html` directamente en tu navegador.
2. O usa un servidor estático local, por ejemplo:

```sh
cd web
python3 -m http.server 8000
```

Luego abre `http://localhost:8000`.

## Formulario de contacto

El formulario de la sección "Contacto" envía los datos a `web/api/contact.js`, una función serverless de Vercel que usa [Resend](https://resend.com) para mandar el correo a `contacto@estudiofrontier.com.ar`. Esto **solo funciona desplegado en Vercel** (no al abrir `index.html` directamente ni con `python3 -m http.server`, porque esos no ejecutan la función `/api/contact`).

Para que funcione al desplegar:

1. Crear una cuenta gratis en [resend.com](https://resend.com) y generar una API key.
2. En el proyecto de Vercel, ir a Settings → Environment Variables y agregar `RESEND_API_KEY` con esa key.
3. En Settings → General → Root Directory, configurar `web` (o desplegar con la CLI ejecutando `vercel` desde dentro de la carpeta `web/`), para que Vercel detecte `web/package.json` y `web/api/contact.js` como la raíz del proyecto.

Por defecto el correo se envía desde `onboarding@resend.dev` (dominio de prueba de Resend, no requiere configuración). Para enviarlo desde un dominio propio (ej. `contacto@estudiofrontier.com.ar`) hay que verificar el dominio en Resend y cambiar el campo `from` en `web/api/contact.js`.

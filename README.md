# Estudio Frontier - Ferreiro — Nueva versión del sitio

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

El formulario de la sección "Contacto" envía los datos a `web/api/contact.js`, una función serverless de Vercel que usa [Resend](https://resend.com) para mandar el correo. Esto **solo funciona desplegado en Vercel** (no al abrir `index.html` directamente ni con `python3 -m http.server`, porque esos no ejecutan la función `/api/contact`).

Para que funcione al desplegar:

1. Crear una cuenta gratis en [resend.com](https://resend.com) y generar una API key.
2. En el proyecto de Vercel, ir a Settings → Environment Variables y agregar `RESEND_API_KEY` con esa key (en Production, Preview y Development).
3. En Settings → General → Root Directory, configurar `web` (o desplegar con la CLI ejecutando `vercel` desde dentro de la carpeta `web/`), para que Vercel detecte `web/package.json` y `web/api/contact.js` como la raíz del proyecto.

### Pendiente: verificar el dominio en Resend

Por defecto el correo se envía desde `onboarding@resend.dev`, el dominio de prueba compartido de Resend. **Ese dominio solo puede entregar correo a la casilla con la que se creó la cuenta de Resend** (no a `cristian@estudiofrontier.com` ni a ninguna otra dirección) — es una restricción anti-spam de Resend, no un bug. Por eso `TO_EMAIL` en `web/api/contact.js` está temporalmente apuntando a esa casilla de Resend.

Para que el formulario le llegue a `cristian@estudiofrontier.com`:

1. En [resend.com/domains](https://resend.com/domains), agregar el dominio `estudiofrontier.com`.
2. Resend va a mostrar 2-3 registros DNS (TXT/CNAME) para copiar en el panel DNS de donde esté alojado el dominio (el hosting o el registrador).
3. Esperar a que Resend marque el dominio como verificado (minutos a un par de horas, según la propagación DNS).
4. En `web/api/contact.js`, cambiar `TO_EMAIL` a `cristian@estudiofrontier.com` y el `from` a una dirección de ese dominio (ej. `Frontier - Ferreiro <contacto@estudiofrontier.com>`).

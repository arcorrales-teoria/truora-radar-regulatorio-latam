# Migración suave a Lovable

Esta rama contiene la versión React + Vite del Radar Regulatorio. Conserva las rutas públicas, el diagnóstico, el formulario embebido de HubSpot, el tracking del embudo y los recursos visuales de la versión original en Next.js.

## Qué se conserva

- `/radar-regulatorio`
- `/radar-regulatorio/:pais`
- `/radar-regulatorio/:pais/:ley`
- `/radar-regulatorio/:pais/assessment?industria=...`
- Contenido regulatorio y preguntas del diagnóstico.
- Formulario HubSpot del portal `21471312`.
- Tracking global y vistas de avance del diagnóstico.
- Tailwind CSS v4, Host Grotesk, animaciones y diseño responsive.

## Flujo recomendado

Lovable no importa repositorios existentes. La sincronización oficial crea un repositorio nuevo desde un proyecto de Lovable.

1. Crear un proyecto vacío en Lovable.
2. En **Project settings → Git → GitHub**, conectar GitHub. Lovable creará un repositorio nuevo.
3. Clonar ese repositorio o añadirlo como un segundo remoto local.
4. Empujar el contenido de esta rama al `main` del repositorio creado por Lovable.
5. Hacer un commit adicional si Lovable no recibe el primer webhook de sincronización.
6. Validar en Lovable las rutas, el diagnóstico y el formulario de HubSpot.

Ejemplo, reemplazando la URL por la del repositorio creado por Lovable:

```bash
git remote add lovable <URL_DEL_REPOSITORIO_NUEVO>
git push lovable lovable-migration:main
```

Después del primer push, Lovable y GitHub pueden trabajar con sincronización bidireccional sobre la rama activa.

## Desarrollo local

```bash
npm install
npm run dev
npm run build
npm run preview
```

La salida de producción se genera en `dist/`.

## Variables y servicios

No se requieren variables de entorno para la versión actual. Los identificadores públicos de HubSpot están centralizados en `src/lib/hubspot.ts`.

El hosting debe servir `index.html` como fallback para las rutas del SPA. `vercel.json` incluye esa reescritura para despliegues externos en Vercel.

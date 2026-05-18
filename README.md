# EcoAmazónico Perú · Landing + Panel administrativo

Sitio público y panel de administración para **Eco Amazónico Perú SRL**, empresa
peruana dedicada a la gestión de proyectos de desarrollo sostenible, consultoría
ambiental, capacitación y proveeduría agropecuaria.

El proyecto está dividido en dos aplicaciones que viven en el mismo monorepo y se
despliegan como dos sitios distintos del mismo proyecto de Firebase:

| Aplicación | Carpeta | URL (Firebase Hosting) | Para qué sirve |
|---|---|---|---|
| Landing pública | `landing/` | `eco-as.web.app` | Sitio que ven los clientes finales. Hero, servicios, certificaciones, contacto, etc. |
| Panel admin | `frontend/` | `eco-as-admin.web.app` | Editor interno para cambiar textos e imágenes de la landing sin tocar código. |

> **Ambas apps comparten** la misma identidad visual (paleta `eco-lime`, tipografías
> Inter + Poppins) y la misma fuente de datos (Firestore). Cualquier cambio guardado
> desde el panel se refleja en la landing al recargar la página, sin necesidad de
> redeploy.

---

## ✨ Funcionalidad

### Landing pública

- **Astro 5 estático** con islas de React 19 hidratadas donde se necesita interactividad.
- Hero con **video rotativo** (selva, sierra, costa) que cambia cada 15 segundos.
- Carruseles, mapa interactivo del Perú (`react-simple-maps`), animaciones typewriter,
  modal de servicios, botón flotante de WhatsApp, banner de cookies.
- Cada sección editable se **suscribe a Firestore en vivo** y trae fallback hardcodeado
  para que el primer render sea instantáneo y resistente a fallos de red.

### Panel administrativo

- Login con **Firebase Auth** (email + password) y *whitelist* de correos.
- Dashboard con tarjetas por sección. Editores con preview, autoguardado opcional,
  uploader de imágenes a Firebase Storage con barra de progreso, reordenamiento
  drag-free (flechitas), confirmación de borrado in-place y toasts de feedback.
- **8 editores** que cubren todo el contenido visible de la landing:
  - Hero · Sobre Nosotros · ¿Por qué elegirnos? · Servicios (CRUD con modal)
  - Experiencia · Certificaciones · Contacto y oficinas · Hero de /servicios
- Páginas **404** personalizadas con la identidad de cada app.

---

## 🛠 Stack

| Capa | Tecnología |
|---|---|
| Framework UI | Astro 5 + React 19 |
| Estilos | Tailwind CSS v4 |
| Tipografía | Inter (cuerpo) + Poppins (display) |
| Backend | Firebase (Auth + Firestore + Storage + Hosting) |
| Lenguaje | TypeScript estricto |
| Build / monorepo | npm workspaces |
| Hosting | Firebase Hosting multi-site |
| Scripts admin | Node + `firebase-admin` SDK |

---

## 📁 Estructura del repo

```
landing-page-ecoamazonico/
├── landing/                    Sitio público (Astro + React)
│   ├── src/
│   │   ├── pages/              index.astro · servicios.astro · 404.astro
│   │   ├── components/         Componentes públicos (HeroContent, ServicesGrid, …)
│   │   ├── layouts/            Layout.astro principal con loader y CookieConsent
│   │   ├── lib/                firebase.ts · useFirestoreDoc · useFirestoreCollection · types
│   │   ├── styles/             Tailwind global + tema eco-lime
│   │   └── assets/             Imágenes locales que se usan como fallback en build
│   └── public/                 Videos del hero + favicons
│
├── frontend/                   Panel admin (Astro + React)
│   ├── src/
│   │   ├── pages/
│   │   │   ├── index.astro     Redirige a /dashboard o /login según sesión
│   │   │   ├── login.astro     Login editorial split-screen
│   │   │   ├── dashboard.astro Tarjetas de cada sección editable
│   │   │   ├── 404.astro       404 con identidad admin
│   │   │   └── editar/         Una página por editor de sección
│   │   ├── components/
│   │   │   ├── editors/        Un editor por sección (HeroEditor, ServicesEditor, …)
│   │   │   ├── ui/             Primitivas reusables (TextField, Modal, Toast, …)
│   │   │   ├── AdminShell.tsx  Layout autenticado: topbar + sidebar + main
│   │   │   └── DashboardHome.tsx
│   │   └── lib/                firebase.ts · useAuth · useRequireAuth · useDocEditor · sections · types
│   └── public/                 Logo + favicons
│
├── scripts/                    Scripts node one-shot (admin SDK)
│   ├── seed.js                 Pobla Firestore con el contenido inicial
│   ├── upload-images.js        Sube landing/src/assets/* a Storage bajo /site/seed/
│   ├── verify-admins.js        Marca emailVerified=true en los usuarios admin
│   └── service-account.json    🔒 (no committeado) credencial Admin SDK
│
├── firebase.json               Configuración multi-site + reglas Firestore/Storage
├── .firebaserc                 Mapeo de hosting targets a sites de Firebase
├── firestore.rules             Reglas: lectura pública, escritura solo admins verificados
├── storage.rules               Reglas: lectura pública en /site/, escritura solo admins
├── firestore.indexes.json      Índices compuestos (vacío por ahora)
└── package.json                Workspaces + scripts de orquestación
```

---

## 🗄 Esquema de datos

### Firestore

```
siteContent/ (colección — un doc por sección editable)
├── hero               { title, paragraph, ctaPrimary, ctaSecondary, videos[], posterUrl }
├── nosotros           { badge, titlePrefix, typewriterWords[], paragraph,
│                        mision: {title,text}, vision: {title,text}, images[3] }
├── porQueElegirnos    { badge, titlePrefix, typewriterWords[], paragraph,
│                        carouselImages[], items[]: {title, description, icon} }
├── experiencia        { badge, titlePrefix, typewriterWords[], paragraphFull,
│                        stats[]: {value, label, icon} }
├── certificaciones    { badge, title, backgroundUrl,
│                        items[]: {name, logoUrl, description} }
├── footer             { phone, email,
│                        social[]: {platform, url},
│                        offices[]: {name, address, mapEmbedUrl, primary} }
└── servicesPageHero   { title, subtitle, videoUrl }

services/ (colección — un doc por card de servicio)
└── {auto-id}          { order, title, shortDesc, fullDesc, icon,
                         imageUrl, detailImages[] }
```

### Storage

```
site/
├── seed/              Imágenes iniciales subidas por scripts/upload-images.js
├── hero/              Imágenes subidas desde el editor del Hero
├── services/          Imágenes principales de cada card de servicio
├── nosotros/          Las 3 imágenes del bloque Sobre Nosotros
├── por-que-elegirnos/ Carrusel de la sección oscura
└── certificaciones/   Logos de SENACE, INIA, etc. + fondo
```

Todas las imágenes son **públicas** (lectura sin auth), la escritura solo se permite
a los emails admin verificados.

### Seguridad (Firestore + Storage)

Definida en `firestore.rules` y `storage.rules`. Resumen:

- **Lectura pública** en `siteContent/*`, `services/*` y `site/*` para que la landing
  pueda renderizar sin sesión.
- **Escritura solo** si `request.auth.token.email` está en la whitelist de admins
  Y `request.auth.token.email_verified == true`.
- Storage acepta solo imágenes (`image/*`) hasta 10 MB.

La whitelist de emails admin está duplicada en tres lugares (defensa en profundidad):

1. `firestore.rules` y `storage.rules` (servidor — fuente de verdad).
2. `frontend/src/lib/admins.ts` (cliente — para esconder UI a quien no debe verla).
3. `scripts/verify-admins.js` (one-shot — marca emailVerified).

Si agregás un admin nuevo, **actualiza los tres lugares** y vuelve a desplegar reglas.

---

## 🚀 Setup local

### Requisitos

- Node 18+
- npm 10+
- Acceso al proyecto Firebase `eco-as`

### Pasos

```bash
# 1. Clonar e instalar
git clone <repo>
cd landing-page-ecoamazonico
npm install --legacy-peer-deps

# 2. Variables de entorno
cp landing/.env.example landing/.env
cp frontend/.env.example frontend/.env
# Edita ambos archivos con la config de Firebase (Project Settings → Web app)
# En frontend/.env también ajusta PUBLIC_LANDING_URL si vas a producción.

# 3. Levantar en dev (en dos terminales)
npm run dev:landing    # http://localhost:4321
npm run dev:admin      # http://localhost:4322
```

> Los peer-deps requieren `--legacy-peer-deps` por `react-simple-maps` aún no
> declarando soporte oficial para React 19. Funciona en runtime sin problemas.

---

## 🧰 Comandos disponibles

Todos se corren desde la raíz del monorepo.

| Comando | Qué hace |
|---|---|
| `npm run dev:landing` | Astro dev de la landing en `:4321` |
| `npm run dev:admin` | Astro dev del panel admin en `:4322` |
| `npm run build:landing` | Build estático de la landing → `landing/dist/` |
| `npm run build:admin` | Build estático del admin → `frontend/dist/` |
| `npm run build:all` | Build de ambos workspaces |
| `npm run deploy:landing` | Build + deploy solo de la landing a Firebase |
| `npm run deploy:admin` | Build + deploy solo del admin a Firebase |
| `npm run deploy:all` | Build + deploy de ambos sites |

### Scripts one-shot (carpeta `scripts/`)

Requieren `scripts/service-account.json` (descargar de Firebase Console → Project
Settings → Service accounts → Generate new private key — **no committear**).

```bash
cd scripts
npm install
npm run upload-images   # Sube landing/src/assets/* a Storage bajo /site/seed/
npm run seed            # Pobla Firestore con el contenido inicial
npm run verify-admins   # Marca emailVerified=true en los usuarios admin
```

---

## 🧪 Flujo de edición → publicación

```
┌─────────────────┐    ┌──────────────┐    ┌─────────────┐    ┌─────────────────┐
│  Admin edita    │ →  │  Firestore   │ →  │  Landing    │ →  │  Cliente final  │
│  (admin.site)   │    │  guarda doc  │    │  onSnapshot │    │  ve el cambio   │
└─────────────────┘    └──────────────┘    └─────────────┘    └─────────────────┘
        │                                          ▲
        ▼                                          │
┌─────────────────┐                                │
│  Storage sube   │────────────── URL pública ─────┘
│  imágenes       │
└─────────────────┘
```

- **Sin redeploy**: cambios de texto e imágenes son inmediatos al refrescar la landing.
- **Con redeploy**: solo si tocás código (componentes, estilos, lógica).

---

## 🔐 Cuentas de administrador

| Email | Quién |
|---|---|
| `gerardogonzalezm1403@gmail.com` | Desarrollador |
| `admin@ecoamazonico.com` | Cliente |

Para agregar un nuevo admin:

1. Crear el usuario en Firebase Console → Authentication → Add user.
2. Agregar el email a `firestore.rules`, `storage.rules` y `frontend/src/lib/admins.ts`.
3. Agregar el email a `scripts/verify-admins.js` y correr `npm run verify-admins`
   (porque Firebase Console no expone un toggle de emailVerified).
4. Redesplegar reglas: `firebase deploy --only firestore:rules,storage`.
5. Redesplegar admin: `npm run deploy:admin`.

---

## 🌐 Despliegue

```bash
npm run deploy:all
```

Eso construye ambas apps y las publica a:

- Landing → `https://eco-as.web.app`
- Admin → `https://eco-as-admin.web.app`

### Conectar dominios custom

Cuando se contrate `ecoamazonico.com`:

1. Firebase Console → Hosting → cada sitio → **Add custom domain**.
2. Apuntar DNS según las instrucciones (TXT para verificar, A records para servir).
3. Agregar los dominios en Auth → Settings → **Authorized domains** (sino el login
   del admin se rompe en producción).
4. Actualizar `frontend/.env`:
   ```
   PUBLIC_LANDING_URL=https://ecoamazonico.com
   ```
5. Redesplegar el admin: `npm run deploy:admin`.

### Despliegues parciales útiles

```bash
firebase deploy --only firestore:rules,storage   # Solo reglas
firebase deploy --only hosting:landing           # Solo landing
firebase deploy --only hosting:admin             # Solo admin
```

---

## 🧩 Decisiones de diseño relevantes

**¿Por qué Astro + islas de React en lugar de Next.js o Vite + React?**
La landing es 95 % contenido estático con interactividad puntual. Astro genera HTML
mínimo + hidrata solo los componentes que lo necesitan (`client:load`,
`client:only="react"`), lo que da TTI bajísimo, SEO perfecto y peso de bundle reducido.
El admin podría haber sido SPA pura pero usar Astro para ambas apps significa una sola
configuración de Tailwind, tipografías y estilos compartidos.

**¿Por qué hooks `onSnapshot` en vez de fetch + revalidate?**
El editor del admin guarda → la landing en otra pestaña ve el cambio sin recargar.
Buena DX para verificar que los cambios funcionan, y el costo de Firestore para una
landing de bajo tráfico es despreciable (caben miles de reads gratuitos por día).

**¿Por qué fallback en HTML estático si todo viene de Firestore?**
Tres razones: (1) primer render instantáneo sin esperar la red, (2) SEO — el bot ve
contenido real en el HTML inicial, (3) si Firestore falla la landing sigue mostrando
algo coherente en lugar de un esqueleto vacío.

**¿Por qué npm workspaces en vez de pnpm o turbo?**
Mantiene la herramienta nativa de Node sin agregar dependencias de build. Para dos
workspaces no se justifica el overhead de turbo/nx.

**¿Por qué reglas con `email_verified` exigido?**
Defensa en profundidad: si por error la whitelist se filtra y alguien crea una
cuenta con un email autorizado pero sin verificarlo, las reglas siguen bloqueando.
Por eso el script `verify-admins.js`.

---

## 📜 Licencia y propiedad

Proyecto propietario de **Eco Amazónico Perú SRL**. Todos los derechos reservados.

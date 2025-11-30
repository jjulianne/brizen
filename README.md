# Brizen - Frontend

**Brizen** es una plataforma web premium diseñada para la personalización y visualización de indumentaria en tiempo real. Este proyecto combina una interfaz moderna y minimalista con tecnologías 3D para ofrecer una experiencia de usuario inmersiva.

---

## Estado del proyecto

Actualemente estamos en una etapa avanzada de desarrollo frontend. Las funcionalidades clave, como el **visualizador 3D interactivo** (cambio de color, aplicación de logos, rotación), el sistema de **internacionalización (Español/Inglés)**, el **modo oscuro** y el **catálogo de productos**, están completamente implementadas. Hoy en dia se está trabajando en la optimización de assets y la integración final de flujos de contacto.

---

## Stack Tecnológico

El proyecto utiliza un stack moderno enfocado en el rendimiento y la experiencia visual:

* **Core:** Vite + React + TypeScript
* **Estilos y UI:** Tailwind CSS + Framer Motion (Animaciones)
* **3D / WebGL:** React Three Fiber (R3F) + @react-three/drei + Three.js
* **Navegación:** React Router DOM
* **Internacionalización:** i18next (react-i18next)
* **Iconos:** Lucide React

---

## Instalación y ejecución local

### 1. Clonar el repositorio

```bash
git clone [https://github.com/jjulianne/brizen.git]
cd brizen
```

---
### 2. Instalar dependencias
Se recomienda usar pnpm (aunque npm también funciona):

```bash
pnpm install
# o
npm install
```

---
### 3. Configuración de Assets
Asegúrate de que los siguientes archivos existan en la carpeta /public para el correcto funcionamiento del visualizador 3D y el branding:

* shirt.glb (Modelo 3D optimizado)
* brizen-logo.svg (Logo para modo claro)
* brizen-logo-white.svg (Logo para modo oscuro)

---

### 4. Ejecutar servidor de desarrollo

```bash
pnpm dev
# o
npm run dev
```

---

### 5. Abrir en el navegador
Visita http://localhost:5173 para ver la aplicación.

---

## Funcionalidades y Uso
### Diseñador 3D:

- Navega a la sección "Diseña tu Remera".
- Arrastra el mouse para rotar la prenda y usa el scroll para hacer zoom.
- Selecciona un color base de la paleta.
- Sube tu propio logo (.png) para ver cómo queda estampado en tiempo real.

### Catálogo:

- Explora los productos con filtros animados por categoría.
- Haz clic en "Ver Info" para abrir un modal con detalles.
- Usa el botón de WhatsApp para consultar stock directamente.

### Configuración Global:

- Alterna entre Modo Claro/Oscuro desde el Navbar.
- Cambia el idioma (ES/EN) instantáneamente.

---

## Estructura del proyecto

    brizen/
    ├─ public/              # Assets estáticos (Modelos 3D, Logos, Favicon)
    ├─ src/
    │  ├─ components/       # Componentes reutilizables (Navbar, Hero, DesignSection, Catalog...)
    │  ├─ locales/          # (Opcional) Archivos de traducción json si se separan
    │  ├─ App.tsx           # Configuración de Rutas
    │  ├─ main.tsx          # Punto de entrada y providers
    │  ├─ index.css         # Configuración de Tailwind y fuentes
    │  └─ i18n.ts           # Configuración de idiomas
    ├─ package.json
    ├─ tsconfig.json
    ├─ tailwind.config.js
    └─ vite.config.ts

---

# Travabus

Travabus es una plataforma para conectar empresas de autobuses con rutas vacías y empresas que necesitan transporte en Europa.

## Características

- Publicación de rutas vacías de autobuses
- Sistema de búsqueda y coincidencia de rutas
- Perfiles de empresa verificados
- Sistema de comisiones integrado con Stripe
- Soporte multilingüe (español, inglés, alemán, francés, italiano, portugués)
- Modo oscuro
- Panel de administración

## Tecnologías utilizadas

- React
- Vite
- i18next (para internacionalización)
- React Router DOM
- Stripe (para pagos)
- Base de datos local (IndexedDB simulado con localStorage)

## Instalación

1. Clona el repositorio
2. Instala las dependencias: `npm install`
3. Inicia el servidor de desarrollo: `npm run dev`

## Configuración de Stripe

Para habilitar los pagos con Stripe:

1. Crea una cuenta en [Stripe](https://stripe.com)
2. Obten tus claves de publicable y secreta
3. Configura las claves en el panel de administración de la aplicación

## Arquitectura

- `/src/components` - Componentes de interfaz de usuario
- `/src/pages` - Páginas principales de la aplicación
- `/src/utils` - Funciones de utilidad y servicios
- `/src/i18n` - Archivos de traducción
- `/public/assets/css` - Archivos de estilo

## Funcionalidades clave

### Para usuarios:
- Registro e inicio de sesión
- Publicación de anuncios de rutas vacías
- Seguimiento de anuncios
- Expresión de interés en anuncios
- Perfil de empresa con datos fiscales

### Para administradores:
- Gestión de usuarios
- Gestión de anuncios
- Marcado de anuncios como destacados
- Generación de anuncios aleatorios
- Configuración de integración con Stripe

### Sistema de comisiones:
- Comisión del 5% con mínimo de 25€
- Pagos procesados a través de Stripe
- Sistema de seguimiento de transacciones

## Internacionalización

La aplicación soporta múltiples idiomas:
- Español (idioma por defecto)
- Inglés
- Alemán
- Francés
- Italiano
- Portugués

## Modo oscuro

La aplicación incluye un modo oscuro que se puede activar/desactivar desde el encabezado.

## Seguridad

- Validación de datos en el cliente
- Almacenamiento seguro de credenciales
- Sistema de roles (usuarios normales y administradores)
- Comunicación segura con servicios de terceros

## Estado del proyecto

Esta es una versión MVP (Producto Mínimo Viable) que implementa todas las funcionalidades básicas. Las características futuras incluyen:
- Integración completa con Stripe
- Validación de identidad empresarial
- Sistema de calificaciones
- Notificaciones push
- Aplicación móvil nativa
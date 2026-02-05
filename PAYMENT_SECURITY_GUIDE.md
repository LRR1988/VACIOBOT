# Guía de Seguridad para Pagos con Stripe en Travabus

## Introducción

Esta guía explica cómo mantener segura la integración de pagos de Stripe en la aplicación Travabus.

## Principios de Seguridad

### 1. Separación de claves
- **Claves públicas**: Pueden exponerse en el frontend (comienzan con `pk_`)
- **Claves secretas**: Deben mantenerse exclusivamente en el backend (comienzan con `sk_`)
- **Claves de webhook**: Deben mantenerse en el backend para validar eventos (comienzan con `whsec_`)

### 2. Uso de variables de entorno
- Todas las claves sensibles deben almacenarse en variables de entorno
- Nunca codificar claves directamente en el código fuente
- Usar archivos `.env` (que deben estar en `.gitignore`)

### 3. Validación de webhooks
- Los webhooks de Stripe deben validarse usando la clave de firma
- Esto previene falsificación de eventos de pago
- La aplicación actual ya implementa esta validación

## Configuración Segura

### Archivo .env
```
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Frontend
- La clave pública de Stripe puede cargarse en el frontend
- Se recomienda cargarla desde el backend en lugar de tenerla en el código

### Backend
- La clave secreta debe usarse únicamente en el backend
- Los webhooks deben validarse con la clave de firma
- Las respuestas a los webhooks deben ser rápidas y seguras

## Buenas Prácticas

1. **Rotación de claves**: Cambia tus claves periódicamente
2. **Monitoreo**: Observa el uso de tus claves en el dashboard de Stripe
3. **Alcance mínimo**: Usa claves con permisos mínimos necesarios
4. **Entornos separados**: Usa claves de test para desarrollo y producción para producción

## Prevención de Vulnerabilidades

- No exponer claves en repositorios públicos
- Validar siempre las entradas del usuario
- Usar HTTPS para todas las comunicaciones
- Implementar límites de tasa para prevenir abusos
- Registrar adecuadamente los eventos de pago

## Verificación de Seguridad

Antes de desplegar, verifica que:
- [ ] No hay claves en el código fuente
- [ ] Las variables de entorno están configuradas correctamente
- [ ] Los webhooks están protegidos
- [ ] Las dependencias están actualizadas
- [ ] Se han eliminado archivos de prueba con claves

## Procedimiento de Emergencia

Si accidentalmente se expone una clave:
1. Revoca inmediatamente la clave comprometida en el dashboard de Stripe
2. Genera una nueva clave
3. Actualiza la configuración
4. Realiza un nuevo despliegue

## Revisión de Código

Todos los commits deben revisarse para asegurar que:
- No contengan claves hardcodeadas
- No expongan información sensible
- Sigan las prácticas de seguridad establecidas
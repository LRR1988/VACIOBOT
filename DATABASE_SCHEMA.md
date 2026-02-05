# Esquema de Base de Datos Local - Travabus

La aplicación utiliza una base de datos local simulada con localStorage para almacenar datos de manera persistente en el navegador.

## Tablas

### 1. users
Almacena la información de los usuarios/empresas

Campos:
- `id` (string): Identificador único del usuario
- `username` (string): Nombre de usuario único
- `password` (string): Contraseña del usuario (en una implementación real se almacenaría con hash)
- `role` (string): Rol del usuario ('user' o 'admin')
- `company_name` (string): Nombre de la empresa
- `tax_data` (string): Datos fiscales de la empresa
- `bank_account` (string): Número de cuenta bancaria
- `bic_swift` (string): Código BIC/SWIFT
- `company_id` (string): CIF de la empresa
- `ownership_certificate` (string): Ruta/documento del certificado de titularidad real
- `email` (string): Correo electrónico
- `phone` (string): Teléfono de contacto
- `created_at` (string): Fecha de creación del usuario
- `updated_at` (string): Fecha de última actualización

### 2. ads
Almacena los anuncios de rutas vacías

Campos:
- `id` (string): Identificador único del anuncio
- `user_id` (string): ID del usuario que creó el anuncio
- `ad_type` (string): Tipo de anuncio ('offer' para oferta de bus vacío)
- `route_from` (string): Ciudad de origen
- `route_to` (string): Ciudad de destino
- `start_date` (string): Fecha de inicio
- `end_date` (string): Fecha de finalización
- `start_time` (string): Hora de inicio
- `end_time` (string): Hora de finalización
- `price` (number): Precio del servicio
- `expenses_by` (string): Quién paga los gastos ('sender', 'receiver', 'shared')
- `bus_count` (number): Número de autobuses
- `bus_age` (number): Antigüedad de los autobuses en años
- `seats` (number): Número de plazas
- `observations` (string): Observaciones adicionales
- `circuit` (boolean): Indica si es un circuito
- `status` (string): Estado del anuncio ('active', 'inactive', 'booked', 'pending_payment', 'blocked')
- `featured` (boolean): Indica si el anuncio es destacado
- `country` (string): País del anuncio (para filtrado)
- `created_at` (string): Fecha de creación del anuncio
- `updated_at` (string): Fecha de última actualización

### 3. ad_followers
Relación de usuarios que siguen anuncios

Campos:
- `id` (string): Identificador único del registro
- `user_id` (string): ID del usuario que sigue
- `ad_id` (string): ID del anuncio seguido
- `created_at` (string): Fecha de seguimiento

### 4. ad_interests
Intereses expresados por usuarios en anuncios

Campos:
- `id` (string): Identificador único del interés
- `user_id` (string): ID del usuario interesado
- `ad_id` (string): ID del anuncio en el que está interesado
- `message` (string): Mensaje opcional del usuario
- `status` (string): Estado del interés ('pending', 'accepted', 'rejected')
- `created_at` (string): Fecha de expresión de interés
- `updated_at` (string): Fecha de última actualización

### 5. notifications
Notificaciones para los usuarios

Campos:
- `id` (string): Identificador único de la notificación
- `user_id` (string): ID del usuario receptor
- `type` (string): Tipo de notificación ('new_interest', 'new_follow', 'offer_accepted', etc.)
- `message` (string): Mensaje de la notificación
- `related_id` (string): ID relacionado (puede ser de ad, user, etc.)
- `read` (boolean): Indica si la notificación ha sido leída
- `created_at` (string): Fecha de creación
- `updated_at` (string): Fecha de última actualización

### 6. transactions
Transacciones financieras (para integración con Stripe)

Campos:
- `id` (string): Identificador único de la transacción
- `user_id` (string): ID del usuario involucrado
- `ad_id` (string): ID del anuncio relacionado (si aplica)
- `amount` (number): Monto de la transacción
- `original_amount` (number): Monto original antes de comisiones
- `commission` (number): Comisión aplicada
- `type` (string): Tipo de transacción ('commission', 'payment', 'refund')
- `status` (string): Estado de la transacción ('created', 'pending', 'succeeded', 'failed', 'canceled')
- `stripe_payment_id` (string): ID de pago en Stripe
- `description` (string): Descripción de la transacción
- `created_at` (string): Fecha de creación
- `updated_at` (string): Fecha de última actualización

## Relaciones

- `users` - `ads`: Uno a muchos (un usuario puede crear múltiples anuncios)
- `users` - `ad_followers`: Uno a muchos (un usuario puede seguir múltiples anuncios)
- `ads` - `ad_followers`: Uno a muchos (un anuncio puede ser seguido por múltiples usuarios)
- `users` - `ad_interests`: Uno a muchos (un usuario puede expresar interés en múltiples anuncios)
- `ads` - `ad_interests`: Uno a muchos (un anuncio puede tener múltiples interesados)
- `users` - `notifications`: Uno a muchos (un usuario puede recibir múltiples notificaciones)
- `users` - `transactions`: Uno a muchos (un usuario puede tener múltiples transacciones)
- `ads` - `transactions`: Uno a muchos (un anuncio puede tener múltiples transacciones relacionadas)

## Consideraciones de seguridad

- En una implementación real, las contraseñas se almacenarían con hash
- La base de datos local no es adecuada para datos sensibles en producción
- Para producción, se recomienda usar una base de datos en servidor con cifrado
- Las claves de Stripe se almacenan localmente solo con fines de demostración
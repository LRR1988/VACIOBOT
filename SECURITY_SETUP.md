# Configuración de Seguridad para Travabus

## Configuración de Stripe

Para que la aplicación funcione correctamente con pagos mediante Stripe, debes configurar tus propias claves de API.

### Pasos para obtener tus claves de Stripe

1. Ve a [https://dashboard.stripe.com/test/apikeys](https://dashboard.stripe.com/test/apikeys) (modo test) o [https://dashboard.stripe.com/apikeys](https://dashboard.stripe.com/apikeys) (modo producción)

2. Copia las siguientes claves:
   - **Publishable Key**: Comienza con `pk_test_` o `pk_live_`
   - **Secret Key**: Comienza con `sk_test_` o `sk_live_`
   - **Webhook Signing Secret**: Comienza con `whsec_`

### Configuración en el servidor

1. Crea un archivo `.env` en la raíz del proyecto con el siguiente contenido:

```env
STRIPE_PUBLISHABLE_KEY=tu_clave_publica_aqui
STRIPE_SECRET_KEY=tu_clave_secreta_aqui
STRIPE_WEBHOOK_SECRET=tu_clave_webhook_aqui
SUPABASE_URL=tu_url_supabase_aqui
SUPABASE_SERVICE_ROLE_KEY=tu_clave_servicio_supabase_aqui
```

2. Asegúrate de que el archivo `.env` esté en `.gitignore` para que no se suba al repositorio.

### Configuración del webhook

1. En el dashboard de Stripe, ve a Developers > Webhooks
2. Haz clic en "Add endpoint"
3. En la URL, introduce: `http://tu_dominio_o_ip:3000/webhook`
4. Selecciona los eventos que deseas recibir, especialmente `checkout.session.completed`
5. Copia la "Signing secret" y úsala en la variable de entorno `STRIPE_WEBHOOK_SECRET`

### Notas importantes

- Nunca compartas tus claves de API públicamente
- Las claves de test (`*_test_*`) solo funcionan en modo test
- Las claves de producción (`*_live_*`) son para uso en producción
- Mantén siempre tus claves en variables de entorno, nunca en el código fuente

## Variables de entorno requeridas

La aplicación requiere las siguientes variables de entorno:

- `STRIPE_PUBLISHABLE_KEY`: Clave pública de Stripe (frontend)
- `STRIPE_SECRET_KEY`: Clave secreta de Stripe (backend)
- `STRIPE_WEBHOOK_SECRET`: Clave de firma del webhook de Stripe
- `SUPABASE_URL`: URL de tu proyecto en Supabase
- `SUPABASE_SERVICE_ROLE_KEY`: Clave de rol de servicio de Supabase
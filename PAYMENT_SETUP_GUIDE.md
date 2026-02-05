# Guía de Configuración del Sistema de Pagos de Travabus

## 1. Configuración de Variables de Entorno

### Paso 1: Crear archivo .env
Copia el archivo `.env.example` a `.env`:
```bash
cp .env.example .env
```

### Paso 2: Obtener claves de Stripe
1. Accede a tu cuenta de [Stripe Dashboard](https://dashboard.stripe.com/)
2. Ve a Developers > API Keys para obtener tu `STRIPE_SECRET_KEY`
3. Ve a Developers > Webhooks para crear un nuevo endpoint:
   - URL: `https://[TU_DOMINIO]/webhook` (o `http://localhost:3000/webhook` para pruebas locales)
   - Eventos a escuchar: `checkout.session.completed`, `payment_intent.succeeded`, `payment_intent.payment_failed`
   - Copia la `Signing secret` que se genera

### Paso 3: Configurar las variables
Actualiza el archivo `.env` con tus claves reales:
```env
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxxxxxxxxxxxxx
```

## 2. Configuración del Webhook

### Opción A: Stripe CLI (solo para pruebas locales)
Si estás probando localmente, puedes usar Stripe CLI:
```bash
# Instala Stripe CLI
npm install -g stripe

# Autentica (necesitas un API key de prueba)
stripe login

# Escucha webhooks y reenvía al servidor local
stripe listen --forward-to localhost:3000/webhook
```

### Opción B: Configuración en Stripe Dashboard (producción)
1. Ve a [Stripe Dashboard](https://dashboard.stripe.com/)
2. Navega a Developers > Webhooks
3. Haz clic en "Add endpoint"
4. Ingresa la URL: `https://[TU_DOMINIO]/webhook`
5. Selecciona los eventos:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
6. Guarda el endpoint

## 3. Validación de la Configuración

Después de configurar las variables, puedes verificar la configuración:
```bash
node verify_config.js
```

## 4. Reiniciar el Servidor

Después de cambiar las variables de entorno, reinicia el servidor:
```bash
# Si estás usando pm2
pm2 restart all

# Si estás corriendo directamente
# Detén el proceso actual (Ctrl+C) y vuelve a iniciarlo
node server.js
```

## 5. Prueba del Flujo Completo

1. Realiza una prueba de pago con una tarjeta de prueba de Stripe:
   - `4242 4242 4242 4242` con cualquier CVV y fecha futura
2. Verifica que:
   - El pago se complete en Stripe
   - El webhook reciba el evento `checkout.session.completed`
   - La transacción se registre como "completed" en la base de datos
   - El anuncio se marque como contratado

## 6. Resolución de Problemas Comunes

### Problema: "Invalid API Key provided"
- Verifica que la `STRIPE_SECRET_KEY` esté correctamente copiada
- Asegúrate de que no haya espacios adicionales en la variable

### Problema: "Webhook signature verification failed"
- Confirma que la `STRIPE_WEBHOOK_SECRET` coincida con la que aparece en Stripe Dashboard
- Verifica que estés usando la clave correcta (signing secret, no endpoint secret)

### Problema: El webhook no recibe eventos
- Asegúrate de que la URL esté accesible públicamente
- Verifica que el puerto 3000 esté abierto y accesible
- Confirma que no haya firewall bloqueando las conexiones entrantes

## 7. Seguridad

- Nunca compartas tus claves API en el código fuente
- Mantén el archivo `.env` en `.gitignore` para evitar subirlo al repositorio
- Usa claves de prueba durante el desarrollo
- Cambia a claves de producción solo cuando estés listo para lanzar
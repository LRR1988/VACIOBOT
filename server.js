// Servidor simple para servir la aplicación Travabus (compilada)
require('dotenv').config(); // Cargar variables de entorno
const express = require('express');
const path = require('path');
const fs = require('fs');
const Stripe = require('stripe');

// Inicializar Stripe con la clave secreta
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'YOUR_STRIPE_SECRET_KEY');

const app = express();
const PORT = process.env.PORT || 3000;

// Inicializar Supabase para el backend
const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = process.env.SUPABASE_URL || 'https://aynmblthitrfqcfvclot.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF5bm1ibHRoaXRyZnFjZnZjbG90Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDIxMjc2OCwiZXhwIjoyMDg1Nzg4NzY4fQ.x37WqDmMivdRMfsXNK4RNYHy_t_NNYRTMUaERbS46EA';
const supabase = createClient(supabaseUrl, supabaseKey);

// Función para verificar si ya existe una transacción para un anuncio por cualquier usuario
async function checkExistingTransaction(userId, adId) {
  try {
    // Consultar la base de datos para ver si ya existe una transacción completada para este anuncio por cualquier usuario
    // Usar solo los campos que sabemos que existen en la tabla transactions
    const { data, error } = await supabase
      .from('transactions')
      .select('id')
      .eq('related_ad_id', adId)
      .eq('status', 'completed'); // Solo transacciones completadas cuentan como contrato

    if (error) {
      console.error('Error checking existing transaction:', error);
      return false; // Permitimos la transacción en caso de error
    }

    // Si hay al menos una transacción completada, significa que ya se contrató el servicio
    return data && data.length > 0;
  } catch (error) {
    console.error('Error checking existing transaction:', error);
    return false; // Permitimos la transacción en caso de error
  }
}

const distPath = path.join(__dirname, 'dist');
const indexPath = path.join(distPath, 'index.html');

// Middleware para parsear JSON y raw body para webhooks
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(distPath));

// Función para verificar si un anuncio ha sido contratado por cualquier usuario
async function checkAdHiredByAnyUser(adId) {
  try {
    // Consultar la base de datos para ver si ya existe una transacción completada para este anuncio por cualquier usuario
    const { data, error } = await supabase
      .from('transactions')
      .select('id')
      .eq('related_ad_id', adId)
      .eq('status', 'completed'); // Solo transacciones completadas cuentan como contrato

    if (error) {
      console.error('Error checking if ad is hired by any user:', error);
      return false; // Permitimos la transacción en caso de error
    }

    // Si hay al menos una transacción completada, significa que ya se contrató el servicio
    return data && data.length > 0;
  } catch (error) {
    console.error('Error checking if ad is hired by any user:', error);
    return false; // Permitimos la transacción en caso de error
  }
}

// Ruta para crear sesión de checkout de Stripe
app.post('/api/create-checkout-session', async (req, res) => {
  try {
    const { adId, userId, price, productName, productDescription, commission } = req.body;

    // Verificar si el usuario ya ha contratado este anuncio
    const existingTransaction = await checkExistingTransaction(userId, adId);
    if (existingTransaction) {
      return res.status(400).json({
        success: false,
        error: 'Ya has contratado este servicio'
      });
    }

    // Verificar si el anuncio ya ha sido contratado por cualquier otro usuario
    const adHiredByOtherUser = await checkAdHiredByAnyUser(adId);
    if (adHiredByOtherUser) {
      return res.status(400).json({
        success: false,
        error: 'Este anuncio ya ha sido contratado por otro usuario'
      });
    }

    // Calcular el monto total (precio del anuncio)
    const totalAmount = parseFloat(price);
    
    // Crear la sesión de checkout en Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'eur',
          product_data: {
            name: productName,
            description: productDescription
          },
          unit_amount: Math.round(totalAmount * 100), // Stripe usa centavos
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${req.protocol}://${req.get('host')}/dashboard?session_id={CHECKOUT_SESSION_ID}&payment=success`,
      cancel_url: `${req.protocol}://${req.get('host')}/dashboard?payment=cancelled`,
      metadata: {
        adId: adId,
        userId: userId,
        commission: commission.toString(),
        netToOwner: (totalAmount - parseFloat(commission)).toString()
      },
      client_reference_id: adId, // Agregar referencia del anuncio para facilitar la identificación
      automatic_tax: { enabled: true },
      billing_address_collection: 'required',
    });

    res.json({
      sessionId: session.id,
      url: session.url,
      success: true
    });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Ruta para verificar el estado del pago
app.get('/api/payment-status/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    res.json({
      sessionId: session.id,
      status: session.payment_status,
      amount: session.amount_total / 100,
      currency: session.currency,
      customerEmail: session.customer_details?.email,
      success: true
    });
  } catch (error) {
    console.error('Error getting payment status:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Endpoint para webhook de Stripe
app.post('/webhook', express.raw({ type: 'application/json' }), async (request, response) => {
  const sig = request.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || 'whsec_f536e102447acc97105cb8450cc6d3b1fe8d9fa42e568fd792cd92a9c1f173bc';

  let event;

  try {
    event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
  } catch (err) {
    console.error('Error verifying webhook signature:', err);
    return response.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log('Webhook recibido:', event.type, 'para sesión:', event.data.object.id);

  // Manejar el evento
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      console.log('Pago completado para la sesión:', session.id);
      console.log('Metadatos de la sesión:', session.metadata);
      console.log('Amount total:', session.amount_total);
      
      // Registrar la transacción en nuestra base de datos
      // y podríamos enviar notificaciones al usuario
      try {
        // Extraer los metadatos de la sesión
        const { adId, userId, commission, netToOwner } = session.metadata || {};
        console.log('Metadatos extraídos - adId:', adId, 'userId:', userId, 'commission:', commission, 'netToOwner:', netToOwner);
        
        // Verificar que tengamos los metadatos necesarios
        if (!adId || !userId) {
          console.error('Metadatos insuficientes para procesar la transacción:', session.metadata);
          return response.status(400).send('Metadatos insuficientes');
        }
        
        const amount = session.amount_total / 100; // Convertir de céntimos a euros
        console.log('Cantidad a registrar:', amount);
        
        // Verificar si ya existe una transacción con este ID de sesión de Stripe para evitar duplicados
        const { data: existingTransaction, error: existingError } = await supabase
          .from('transactions')
          .select('id')
          .eq('stripe_transaction_id', session.id)
          .single();

        if (existingTransaction && !existingError) {
          console.log('⚠️ Transacción ya existe para esta sesión de Stripe:', session.id);
        } else {
          // Registrar la transacción en Supabase con los nombres de columna correctos
          const { data, error } = await supabase
            .from('transactions')
            .insert([{
              user_id: userId,
              related_ad_id: adId,  // Usar el nombre correcto del campo
              amount: amount,
              commission_amount: parseFloat(commission) || 0,  // Nombre correcto
              stripe_transaction_id: session.id,  // Nombre correcto
              status: 'completed',
              currency: session.currency || 'eur'
            }]);
          
          if (error) {
            console.error('Error registrando transacción en Supabase:', error);
          } else {
            console.log('✓ Transacción registrada exitosamente en Supabase:', data);
          }
        }
      } catch (dbError) {
        console.error('Error registrando transacción:', dbError);
      }
      break;
      
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log('Intento de pago exitoso:', paymentIntent.id);
      break;
      
    case 'payment_intent.payment_failed':
      const failedPaymentIntent = event.data.object;
      console.log('Intento de pago fallido:', failedPaymentIntent.id);
      break;
      
    default:
      console.log(`Evento no manejado: ${event.type}`);
  }

  response.json({ received: true });
});

// Ruta para servir el archivo de pruebas
app.get('/test', (req, res) => {
  const filePath = path.join(__dirname, 'dist', 'test_database.html');
  if(fs.existsSync(filePath)) {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        res.status(500).send('Test file not found');
      } else {
        res.setHeader('Content-Type', 'text/html');
        res.send(data);
      }
    });
  } else {
    res.status(404).send('Test file not found');
  }
});

// Middleware para manejar rutas SPA
const spaRoutes = ['/about', '/contact', '/publish', '/profile', '/dashboard', '/admin', '/all-ads', '/payments', '/how-it-works', '/login', '/register', '/stripe-config'];

app.get(/^\/(?!assets|api|static)/, (req, res) => {
  // Leer y enviar el contenido del archivo index.html
  fs.readFile(indexPath, 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Index file not found');
    } else {
      res.setHeader('Content-Type', 'text/html');
      res.send(data);
    }
  });
});

// Iniciar el servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor Travabus escuchando en http://0.0.0.0:${PORT}`);
  console.log(`Ruta de pruebas: http://0.0.0.0:${PORT}/test`);
  console.log(`Webhook de Stripe disponible en: http://0.0.0.0:${PORT}/webhook`);
});
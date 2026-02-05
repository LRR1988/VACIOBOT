// Script para probar el endpoint de creación de checkout
const axios = require('axios');

async function testCheckoutAPI() {
  console.log("=== PRUEBA DEL ENDPOINT DE CREACIÓN DE CHECKOUT ===\n");
  
  // Datos de prueba para el anuncio Sevilla2 → Granada2
  const testData = {
    adId: "e3ed6ebd-3607-4f3e-9555-5ca5a439e99b",  // ID del anuncio Sevilla2 → Granada2
    userId: "d351f18b-c409-43eb-9071-cee2cc81118b",  // ID del usuario que no es el dueño
    price: 150,
    productName: "Servicio de transporte - Sevilla2 a Granada2",
    productDescription: "Contratación del servicio",
    commission: "7.5"  // 5% de 150
  };
  
  console.log("Datos de prueba:");
  console.log("- adId:", testData.adId);
  console.log("- userId:", testData.userId);
  console.log("- price:", testData.price);
  console.log("- commission:", testData.commission);
  console.log();
  
  try {
    console.log("Llamando al endpoint /api/create-checkout-session...");
    
    const response = await axios.post('http://localhost:3000/api/create-checkout-session', testData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log("Respuesta del servidor:");
    console.log(response.data);
    
    if (response.data.success) {
      console.log("\n✓ Sesión de checkout creada exitosamente");
      console.log("- Session ID:", response.data.sessionId);
      console.log("- URL:", response.data.url);
    } else {
      console.log("\n✗ Error al crear sesión de checkout:");
      console.log("- Error:", response.data.error);
    }
  } catch (error) {
    console.error("Error en la llamada al API:", error.response?.data || error.message);
  }
}

testCheckoutAPI()
  .then(() => {
    console.log("\nPrueba completada.");
  })
  .catch(error => {
    console.error("Error:", error);
  });
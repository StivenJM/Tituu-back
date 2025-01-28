import paypal from '@paypal/checkout-server-sdk';
import dotenv from 'dotenv';

// Cargar las variables de entorno
dotenv.config();

// Configuración del entorno de PayPal
const environment = new paypal.core.SandboxEnvironment(
  process.env.PAYPAL_CLIENT_ID,
  process.env.PAYPAL_CLIENT_SECRET
);
const client = new paypal.core.PayPalHttpClient(environment);

export { client };
console.log('Cliente de PayPal configurado', client);
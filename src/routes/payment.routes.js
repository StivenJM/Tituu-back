import { Router } from "express";
import { client } from '../libs/paypalClient.js';
import paypal from '@paypal/checkout-server-sdk';  // Importar el módulo de PayPal

const router = Router();

// Ruta para crear una orden de pago
router.post('/create-payment', async (req, res) => {
    const { totalAmount } = req.body;   // Obtiene el monto total del cuerpo de la solicitud
    console.log('Monto total del pago:', totalAmount);
    
    // Crea una solicitud de creación de orden de PayPal
    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");    // Especifica que se desea una representación completa de la orden en la respuesta
    request.requestBody({
        intent: 'CAPTURE',  // Define la intención de la orden como "captura" (para capturar el pago)
        purchase_units: [{
            amount: {
                currency_code: 'USD',   // Establece la moneda como USD
                value: totalAmount  // Establece el valor del pago con el monto proporcionado
            }
        }],
        application_context: {
            //return_url: 'http://localhost:3000/payment-success',
            //cancel_url: 'http://localhost:3000/payment-cancel'   
            return_url: `${process.env.FRONTEND_URL}/payment-success`,
            cancel_url: `${process.env.FRONTEND_URL}/payment-cancel`
        }
    });

    try {
        // Ejecuta la solicitud de creación de orden en PayPal
        const order = await client.execute(request);
        res.status(200).json({ id: order.result.id });  // Responde con el ID de la orden creada
        console.log('Orden creada:', order.result.id);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Ruta para capturar una orden de pago
router.post('/capture-payment', async (req, res) => {
    const { orderID } = req.body;   // Obtiene el ID de la orden del cuerpo de la solicitud
    console.log('ID de la orden capturada:', orderID);
    // Crea una solicitud de captura de orden de PayPal
    const request = new paypal.orders.OrdersCaptureRequest(orderID);
    request.requestBody({});    // El cuerpo de la solicitud está vacío ya que no se necesitan datos adicionales
    console.log('Solicitud de captura de orden:', request);

    try {
        // Ejecuta la solicitud de captura de orden en PayPal
        const capture = await client.execute(request);
        res.status(200).json({ status: capture.result.status });    // Responde con el estado de la captura
        console.log('Estado de la captura:', capture.result.status);
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log('Error al capturar la orden:', error);
    }
});

export default router;

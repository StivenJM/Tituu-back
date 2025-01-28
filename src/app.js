import express from "express";
import morgan from "morgan";
import cors from "cors";
import bodyParser from "body-parser";
import { connectDB } from "./db.js";
import cookieParser from "cookie-parser";

/* Importar rutas */
import indexRoutes from "./routes/index.routes.js";
import clientRoutes from "./routes/client.routes.js"; 
import catalogRoutes from './routes/catalog.routes.js';
import operatorRoutes from "./routes/operator.routes.js";
import adminRoutes from "./routes/admin.routes.js"; 
import authRoutes from "./routes/auth.routes.js"; 
import dotenv from 'dotenv';

// Cargar las variables de entorno desde el archivo .env
dotenv.config();

import { fileURLToPath } from 'url';

// Importación para probar la contraseña del operador y administrador por correo, se va a borrar luego. Att. Daniel Lorences
import path from 'path';
///////////////////////////////
import loginRoutes from "./routes/login.routes.js"
import paymentRoutes from './routes/payment.routes.js';

// Inicializar Express
//para manejar spocitudes http
const app = express();

// Dependencias necesarias
app.use(morgan("dev"));
app.use(express.json());
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(bodyParser.json());
app.use(cookieParser())

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Uso de rutas
app.use("", indexRoutes);
app.use("/api/clients", clientRoutes);  // Ruta del cliente
app.use('/api/catalog', catalogRoutes);         // Endpoints para el catalogo (categorias y productos)
app.use("/api/operators", operatorRoutes); // Ruta del operador
app.use("/api/admins", adminRoutes); // Ruta del administrador
app.use("/api/login", loginRoutes);
app.use('/api/payments', paymentRoutes); // Ruta del pago en PayPal
app.use('/api/auth', authRoutes); // Rutas para autenticar un usuario
/*Ruta para probar la contraseña del operador y administrador por correo, se va a borrar luego. Att. Daniel Lorences
app.get("/reset-password", (req, res) => {
  res.sendFile('http://localhost:4200/reset-password');
}); */
// Ruta para manejar el éxito del pago y fallido, se van a borrar luego. Att: Daniel Lorences
app.get('/payment-success', (req, res) => {
  res.sendFile(path.resolve('src/public/payment-success.html'));
});
app.get('/payment-canel', (req, res) => {
  res.sendFile(path.resolve('src/public/payment-cancel.html'));
});
// Directorio de carga de archivos para las imágenes
app.use('/uploads', express.static(path.resolve(__dirname, 'uploads')));


// Exportar app
export default app;

import { Router } from "express";
import { createClient, getAllClients, activateClient, setPassword, requestPasswordChange } from "../controllers/client.controller.js";

const router = Router();

// Crear un nuevo cliente
router.post("/register", createClient);

// Obtener todos los clientes
router.get("/", getAllClients);

// Activar cuenta
router.get("/activate/:token", activateClient);

// Configurar la contraseña
router.post("/set-password/:token", setPassword);

// Solicitar cambio de contraseña
router.post("/request-password-change", requestPasswordChange);


export default router;

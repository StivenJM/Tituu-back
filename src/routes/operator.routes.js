import { Router } from "express";
import { createOperator, getOperators, setPassword, requestPasswordChange } from "../controllers/operator.controller.js";

const router = Router();

// Crear un operador
router.post("/register", createOperator);

// Configurar la contraseña
router.post("/set-password/:token", setPassword);

// Solicitar cambio de contraseña
router.post("/request-password-change", requestPasswordChange);

// Obtener todos los operadores
router.get("/", getOperators);

export default router;

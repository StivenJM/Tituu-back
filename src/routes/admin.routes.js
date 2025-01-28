import { Router } from "express";
import { createAdmin, getAdmins, setPassword, requestPasswordChange } from "../controllers/admin.controller.js";

const router = Router();

// Crear un administrador
router.post("/register", createAdmin);

// Configurar la contraseña
router.post("/set-password/:token", setPassword);

// Solicitar cambio de contraseña
router.post("/request-password-change", requestPasswordChange);

// Obtener todos los administradores
router.get("/", getAdmins);

export default router;

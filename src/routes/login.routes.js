import { Router } from "express";
import { login } from "../controllers/login.controller.js"; // Controlador de inicio de sesión

const router = Router();

// Ruta para manejar el inicio de sesión
router.post("/", login);


export default router;

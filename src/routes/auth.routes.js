import { Router } from "express";
import { getData, logout, validateToken, getUserData } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

// Obtener informacion basica del token de login
router.get("/data", authMiddleware, getData);

// Validar un token con true o false
router.get('/validate', authMiddleware, validateToken);

// Ruta para obtener los datos del usuario
router.get('/user/data', authMiddleware, getUserData);

router.post('/logout', logout);

export default router;

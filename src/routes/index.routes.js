import { Router } from "express";
import { index } from "../controllers/index.controller.js";
import clientRoutes from "./client.routes.js";

const router = Router();

// Ruta principal de prueba
router.get("/", index);

router.use("/clients", clientRoutes); // Rutas relacionadas con clientes

export default router;

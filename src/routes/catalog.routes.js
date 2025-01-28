import { Router } from "express";

import {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProducts,
  updateStockAfterPurchase,
  getCategoriesProducts,
} from "../controllers/catalog.controller.js";
import productModel from "../models/product.model.js";
import { getProductsForTable, getProductIdsAndCategories } from "../controllers/poductsTable.controller.js";
import upload from '../libs/multerUpload.js';

const router = Router();

/* Rutas especializadas */
/* -------------------- */

// Endpoint para obtener productos dada una categoria
router.get('/categories/:id/products', getCategoriesProducts);
// Endpoint para buscar productos
router.get("/products/search", searchProducts);
// Endpoint para autocompletar productos
/*
router.get('/products/autocomplete', async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ message: "El término de búsqueda es requerido." });
    }

    const results = await productModel.find({
      $or: [
        { tags: { $regex: `^${query}`, $options: "i" } },
      ],
    }).limit(10); // Limita el número de resultados

    // Aplanar los tags de todos los productos en un solo conjunto
    const allTags = results.flatMap(product => product.tags); // Aplana todos los tags
    const uniqueTags = [...new Set(allTags)]; // Elimina duplicados

    // Filtrar los tags que coinciden con el query usando regex
    const matchingTags = uniqueTags.filter(tag => tag.match(new RegExp(query, "i")));

    res.json(matchingTags); // Devuelve solo los tags que coinciden con el query
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
*/



/* Rutas temporales de prueba para la creacion de categorias y productos */
router.get('/categories', getCategories);
router.get('/categories/:id', getCategory);
router.post('/categories', createCategory);
router.delete('/categories/:id', deleteCategory);
router.put('/categories/:id', updateCategory);
router.get('/products', getProducts);
router.get('/products/:id', getProduct);
// Ruta para obtener productos con categorías para llenar la tabla
router.get('/inventory/table', getProductsForTable);
// Ruta para obtener productos con categorías para llenar la tabla
router.get('/inventory/getId', getProductIdsAndCategories);
// Ruta para agregar un producto con multer
router.post('/products', upload.single('image'), createProduct);
// Ruta para actualizar un producto  con multer
router.put('/products/:id', upload.single('image'), updateProduct);
// Ruta para eliminar un producto
router.delete('/products/:id', deleteProduct);

// Nueva ruta para actualizar el stock después de una compra
router.post('/products/update-stock', (req, res) => {
  console.log('Ruta POST /products/update-stock alcanzada');
  updateStockAfterPurchase(req, res);  // Llamada al controlador
});

export default router;
import Product from '../models/product.model.js';
import Category from '../models/category.model.js';

/**
 * Controlador para obtener productos con nombres de categoría para la tabla
 */
export const getProductsForTable = async (req, res) => {
  try {
    // Obtener todos los productos con la categoría poblada (solo nombre)
    const products = await Product.find().populate({
      path: 'category',
      select: 'name' // Solo traer el nombre de la categoría
    });

    // Formatear los datos para la tabla
    const formattedProducts = products.map(product => ({
      name: product.name,
      category: product.category.name, // Acceder al nombre de la categoría
      description: product.description,
      price: product.price,
      stock: product.stock,
      image: product.image
    }));

    res.status(200).json(formattedProducts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Controlador para obtener solo el id, nombre y categoría de los productos
 */
export const getProductIdsAndCategories = async (req, res) => {
  try {
    // Obtener todos los productos con el id y la categoría poblada (solo nombre)
    const products = await Product.find().populate({
      path: 'category',
      select: 'name' // Solo traer el nombre de la categoría
    });

    // Formatear los datos para devolver solo el id, nombre y categoría
    const formattedProducts = products.map(product => ({
      id: product._id, // El id del producto
      name: product.name,
      category: product.category.name // Nombre de la categoría
    }));

    res.status(200).json(formattedProducts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
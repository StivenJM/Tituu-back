import Category from '../models/category.model.js';
import Product from '../models/product.model.js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const BASE_URL = process.env.BASE_URL;

export const getCategoriesProducts = async (req, res) => {
  try {
    const { id } = req.params; 

    // Verifica si la categoría existe
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Obtener limit y offset del query string, con valores predeterminados
    const limit = parseInt(req.query.limit, 10) || null; // null significa sin límite
    const offset = parseInt(req.query.offset, 10) || 0;  // 0 como valor predeterminado para el desplazamiento

    // Validar que limit y offset sean números válidos
    if ((limit !== null && isNaN(limit)) || isNaN(offset)) {
      return res.status(400).json({ error: "Invalid limit or offset value" });
    }

    // Calcular el total sin limit ni offset
    const total = await Product.countDocuments({ category: id });

    // Construir la consulta con limit y offset
    const query = Product.find({ category: id });
    if (limit !== null) {
      query.limit(limit);
    }
    query.skip(offset);

    // Ejecutar la consulta
    const products = await query;
    res.json({ products, total });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}

/* CRUD de categorias */
// ----------------------

export const getCategories = async (req, res) => {
  try {
    // Buscar todas las categorias y devolver un json
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { name, description, image } = req.body;

    const newCategory = new Category({
      name,
      description,
      image
    });

    const savedCategory = await newCategory.save();
    res.json(savedCategory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    return res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


/* CRUD de productos */
// ----------------------

export const getProducts = async (req, res) => {
  try {
    // Obtener limit y offset del query string, con valores predeterminados
    const limit = parseInt(req.query.limit, 10) || null; // null significa sin límite
    const offset = parseInt(req.query.offset, 10) || 0;  // 0 como valor predeterminado para el desplazamiento

    // Validar que limit y offset sean números válidos
    if ((limit !== null && isNaN(limit)) || isNaN(offset)) {
      return res.status(400).json({ error: "Invalid limit or offset value" });
    }

    // Calcular el total sin limit ni offset
    const total = await Product.countDocuments();

    // Construir la consulta con limit y offset
    const query = Product.find();
    if (limit !== null) {
      query.limit(limit);
    }
    query.skip(offset);

    // Ejecutar la consulta
    const products = await query;
    res.json({ products, total });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createProduct = async (req, res) => {
  console.log(BASE_URL);
  try {
    const { name, category, description, price, stock } = req.body;

    const existingProduct = await Product.findOne({ name, category });
    if (existingProduct) {
      return res.status(400).json({ message: 'El producto ya existe en esta categoría' });
    }

    // Generar la URL completa de la imagen
    const imagePath = req.file ? `${BASE_URL}/uploads/${req.file.filename}` : null;

    const newProduct = new Product({
      name,
      category,
      description,
      price,
      stock,
      image: imagePath,
    });

    // Guardar el producto en la base de datos
    const savedProduct = await newProduct.save();
    res.status(201).json({
      message: 'Producto creado exitosamente',
      product: savedProduct,
    });
  } catch (error) {
    console.error('Error al crear el producto:', error);
    res.status(500).json({ error: error.message });
  }
};


export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Buscar el producto
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Eliminar la imagen del sistema de archivos
    if (product.image) {
      const imagePath = path.resolve(`./${product.image}`);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath); // Borrar el archivo
      }
    }

    // Eliminar el producto de la base de datos
    await Product.findByIdAndDelete(id);

    res.json({ message: 'Producto eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar el producto:', error);
    res.status(500).json({ error: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Buscar el producto existente
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Si hay una nueva imagen cargada
    let imagePath = product.image; // Mantener la imagen actual por defecto
    if (req.file) {
      // Generar la nueva ruta de la imagen
      imagePath = `${BASE_URL}/uploads/${req.file.filename}`;

      // Eliminar la imagen anterior del sistema de archivos
      const oldImagePath = path.resolve(`./${product.image}`);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath); // Borrar la imagen anterior
      }
    }

    // Actualizar los campos del producto
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        ...req.body, // Actualizar los campos enviados en el cuerpo
        image: imagePath, // Actualizar la imagen si se envió
      },
      { new: true } // Devolver el producto actualizado
    );

    res.json({
      message: 'Producto actualizado exitosamente',
      product: updatedProduct,
    });
  } catch (error) {
    console.error('Error al actualizar el producto:', error);
    res.status(500).json({ error: error.message });
  }
};



/* Buscar productos basado en el nombre, descripcion o tags */
/* -------------------------------------------------------- */

export const searchProducts = async (req, res) => {
  try {
    // Recibimos parametros del query string
    // -------------------------------------
    const { query, sort, lowPrice, highPrice } = req.query;
    const limit = parseInt(req.query.limit, 10) || null; // null significa sin límite
    const offset = parseInt(req.query.offset, 10) || 0;  // 0 como valor predeterminado para el desplazamiento


    console.log(req.query);
    // Validamos los parametros
    // ------------------------
    // Verificamos que el query no esté vacío
    if (!query) {
      return res.status(400).json({ message: "El término de búsqueda es requerido." });
    }

    // Validar que sort tenga un valor permitido si fue enviado
    const validSortValues = ['price-asc', 'price-desc'];
    if (sort && !validSortValues.includes(sort)) {
      return res.status(400).json({ error: `El valor de sort debe ser uno de: ${validSortValues.join(', ')}.` });
    }

    // Validar que lowPrice y highPrice sean números si fueron enviados
    if (lowPrice && isNaN(Number(lowPrice))) {
      return res.status(400).json({ error: 'lowPrice debe ser un número válido.' });
    }
    if (highPrice && isNaN(Number(highPrice))) {
      return res.status(400).json({ error: 'highPrice debe ser un número válido.' });
    }

    // Validar que limit y offset sean números válidos
    if ((limit !== null && isNaN(limit)) || isNaN(offset)) {
      return res.status(400).json({ error: "Invalid limit or offset value" });
    }


    // Construir parametros de filtrado
    // --------------------------------
    // Construir el filtro dinámico para la consulta
    const filters = {};
    if (query) {
      filters.$or = [
         // Filtrar por nombre, descripcion o tags (búsqueda insensible a mayúsculas/minúsculas)
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { tags: { $regex: query, $options: 'i' } },
      ];
    }
    if (lowPrice) {
      filters.price = { ...filters.price, $gte: Number(lowPrice) }; // Precio mínimo
    }
    if (highPrice) {
      filters.price = { ...filters.price, $lte: Number(highPrice) }; // Precio máximo
    }

    // Construir el ordenamiento (sort)
    let sortOption = {};
    if (sort === 'price-asc') {
      sortOption.price = 1; // Orden ascendente por precio
    } else if (sort === 'price-desc') {
      sortOption.price = -1; // Orden descendente por precio
    }    


    // Realizar consultas
    // ------------------
    // Calcular el total sin limit ni offset
    const total = await Product.countDocuments(filters);

    // Obtener el precio más alto para el query
    const maxPriceProduct = await Product.findOne({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { tags: { $regex: query, $options: 'i' } },
      ],
    })
      .sort({ price: -1 }) // Ordenar por precio descendente
      .select('price') // Seleccionar solo el precio
      .lean(); // Usar lean para optimizar la consulta
    const maxPrice = maxPriceProduct ? Math.ceil(maxPriceProduct.price) : 100;

    // Realizar consulta de productos
    const queryProducts = Product.find(filters).sort(sortOption);
    if (limit !== null) {
      queryProducts.limit(limit);
    }
    queryProducts.skip(offset);
    const products = await queryProducts;


    // Enviar resultados
    // -----------------
    res.status(200).json({ products, total, maxPrice });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* Actualizar stock de productos */
/* ----------------------------- */
// Función para reducir el stock de los productos después de una compra

export const updateStockAfterPurchase = async (req, res) => {
  const items = req.body.items; // Los productos y cantidades compradas
  console.log('Items:', items);

  try {
    for (let item of items) {
      const product = await Product.findById(item.productId);
      console.log('Producto:', product);

      if (!product) {
        return res.status(404).json({ message: `Producto con ID ${item.productId} no encontrado` });
      }

      // Reducir el stock
      product.stock -= item.quantity;
      console.log('Stock actual:', product.stock);

      // Asegurarse de que el stock no sea negativo
      if (product.stock < 0) {
        product.stock = 0;
      }

      // Guardar el producto actualizado
      await product.save();
    }

    res.status(200).json({ message: 'Stock actualizado correctamente' });
  } catch (error) {
    console.error('Error al actualizar el stock:', error);
    res.status(500).json({ message: 'Error al actualizar el stock', error: error.message });
  }
};



/* Autocompletado de productos */
/* --------------------------- */
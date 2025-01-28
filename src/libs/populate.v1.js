// USO: node src/libs/populate.js

import mongoose from "mongoose";
import dotenv from "dotenv";
import Category from "../models/category.model.js";
import Product from "../models/product.model.js";
import { faker } from "@faker-js/faker";

// Cargar las variables de entorno
dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Conectado a MongoDB Atlas");
  } catch (error) {
    console.error("Error al conectar a MongoDB Atlas:", error);
    process.exit(1); // Salir si no se puede conectar
  }
};

const populateDatabase = async () => {
  try {
    // Limpiar las colecciones
    await Category.deleteMany({});
    await Product.deleteMany({});
    console.log("Colecciones limpiadas.");

    // Crear categorías de prueba
    const categories = [];
    for (let i = 0; i < 5; i++) {
      const category = new Category({
        name: faker.commerce.department(),
        description: faker.lorem.sentence(),
        image: faker.image.url(),
      });
      await category.save();
      categories.push(category);
    }
    console.log("Categorías creadas.");

    // Crear productos de prueba
    for (let i = 0; i < 50; i++) {
      const product = new Product({
        name: faker.commerce.productName(),
        category: categories[Math.floor(Math.random() * categories.length)]._id,
        description: faker.commerce.productDescription(),
        price: faker.commerce.price(10, 100, 2),
        stock: faker.number.int({ min: 1, max: 50 }),
        image: faker.image.url(),
      });
      await product.save();
    }
    console.log("Productos creados.");
  } catch (error) {
    console.error("Error poblando la base de datos:", error);
  } finally {
    mongoose.connection.close(); // Cierra la conexión al terminar
  }
};

// Ejecutar el script
const run = async () => {
  await connectDB();
  await populateDatabase();
};

run();

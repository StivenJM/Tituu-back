import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  image: { type: String, required: false }, // URL o ruta de la imagen
  tags: [String],
});

// Indices para las consultas con regex
ProductSchema.index({ name: 1 }); 
ProductSchema.index({ description: 1 });
ProductSchema.index({ tags: 1 });

export default mongoose.model("Product", ProductSchema);
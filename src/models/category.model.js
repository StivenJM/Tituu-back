import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, unique: true },
  description: { type: String, required: true },
  image: { type: String, required: true } // URL o ruta de la imagen
});

export default mongoose.model("Category", CategorySchema);
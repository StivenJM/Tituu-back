import mongoose from "mongoose";
import { hashPassword } from "../libs/hashPassword.js";

const ClientSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  homeAddress: { type: String, required: false },
  phoneNumber: { type: String, required: false },
  password: { type: String, required: true },
  //activada por correo electronico
  isActive: { type: Boolean, default: false },
  //bloqueo contrasenia incorrecta
  failedAttempts: { type: Number, default: 0 }, // Intentos fallidos
  isLocked: { type: Boolean, default: false }, // Estado de bloqueo
  lockUntil: { type: Date, default: null }, // Tiempo de desbloqueo
  //desabilitada por 6 meses inactiva
  lastLogin: { type: Date, default: null }, // Última vez que inició sesión
  isEnabled: { type: Boolean, default: false } //esta habilitada o no
});

// Índice parcial para el teléfono que evita números repetidos, pero permite "null"
ClientSchema.index(
  { phoneNumber: 1 },
  {
    unique: true,
    partialFilterExpression: { phoneNumber: { $exists: true } }, 
  }
);

// Usar el middleware del hash
ClientSchema.pre("save", hashPassword);

const Client = mongoose.model("Client", ClientSchema);

export default Client;

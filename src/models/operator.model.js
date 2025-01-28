import mongoose from "mongoose";
import { hashPassword } from "../libs/hashPassword.js";

const OperatorSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  homeAddress: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  password: { type: String, required: false }, // Ocional para poder crear el operador sin contraseña y que este la defina por correo
  lastLogin: { type: Date, default: Date.now }, // Última fecha de inicio de sesión
  isEnabled: { type: Boolean, default: true }, // Controla si la cuenta está activa
  failedAttempts: { type: Number, default: 0 }, // Intentos fallidos de inicio de sesión
  isLocked: { type: Boolean, default: false }, // Indica si la cuenta está bloqueada
  lockUntil: { type: Date, default: null }, // Fecha y hora en que se desbloquea la cuenta
});

// Usar el middleware del hash
OperatorSchema.pre("save", hashPassword);

const Operator = mongoose.model("Operator", OperatorSchema);

export default Operator;

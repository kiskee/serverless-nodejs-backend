const Joi = require("joi");

const resetPasswordSchema = Joi.object({
  token: Joi.string().trim().required().messages({
    "string.empty": "El token es obligatorio",
    "any.required": "El token es obligatorio",
  }),
  newPassword: Joi.string().trim().min(8).required().messages({
    "string.empty": "La nueva contraseña es obligatoria",
    "string.min": "La nueva contraseña debe tener al menos 8 caracteres",
    "any.required": "La nueva contraseña es obligatoria",
  }),
});

module.exports = resetPasswordSchema;

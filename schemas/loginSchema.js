const Joi = require("joi");

const loginSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .max(100)
    .required()
    .messages({
      "string.email": "El formato del correo electrónico no es válido",
      "string.max": "El correo electrónico no puede exceder los 100 caracteres",
      "any.required": "El correo electrónico es obligatorio",
      "string.empty": "El correo electrónico no puede estar vacío",
    }),

  password: Joi.string()
    .min(8)
    .max(50)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
    .required()
    .messages({
      "string.min": "La contraseña debe tener al menos 8 caracteres",
      "string.max": "La contraseña no debe exceder los 50 caracteres",
      "string.pattern.base":
        "La contraseña debe incluir al menos una letra mayúscula, una letra minúscula, un número y un carácter especial",
      "any.required": "La contraseña es obligatoria",
      "string.empty": "La contraseña no puede estar vacía",
    }),
});

module.exports = loginSchema;

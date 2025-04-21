const Joi = require("joi");

const createUserSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "El correo electrónico proporcionado no es válido",
    "any.required": "El correo electrónico es obligatorio",
  }),
  email_verified: Joi.boolean().optional(),
  family_name: Joi.string().optional(),
  given_name: Joi.string().optional(),
  name: Joi.string().required().messages({
    "any.required": "El nombre completo es obligatorio",
  }),
  picture: Joi.string().optional(),
  sub: Joi.string().optional(),
  password: Joi.string()
    .min(8)
    .max(50)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
    .messages({
      "string.min": "La contraseña debe tener al menos 8 caracteres",
      "string.max": "La contraseña no debe exceder los 50 caracteres",
      "string.pattern.base":
        "La contraseña debe tener al menos una mayúscula, una minúscula, un número y un carácter especial",
    })
    .optional(),
});

module.exports = createUserSchema;

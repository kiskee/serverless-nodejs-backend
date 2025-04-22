const Joi = require("joi");

const googleSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "El correo electrónico proporcionado no es válido",
    "any.required": "El correo electrónico es obligatorio",
  }),
  email_verified: Joi.boolean().required().messages({
    "any.required": "El email debe estar verificado",
    "boolean.base": "El email debe estar verificado",
  }),
  family_name: Joi.string().optional().messages({
    "string.base": "family_name debe ser una cadena de texto",
  }),
  given_name: Joi.string().optional().messages({
    "string.base": "given_name debe ser una cadena de texto",
  }),
  name: Joi.string().required().messages({
    "any.required": "El nombre completo es obligatorio",
    "string.empty": "El nombre completo es obligatorio",
  }),
  picture: Joi.string().optional().messages({
    "string.base": "picture debe ser una cadena de texto",
  }),
  sub: Joi.string().required().messages({
    "any.required": "sub es obligatorio y debe ser una cadena de texto",
    "string.base": "sub es obligatorio y debe ser una cadena de texto",
  }),
});

module.exports = googleSchema;

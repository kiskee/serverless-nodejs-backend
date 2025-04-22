const Joi = require("joi");

const sendEmailSchema = Joi.object({
  recipients: Joi.alternatives()
    .try(
      Joi.string().email().messages({
        "string.email": "El destinatario debe ser un correo electrónico válido",
        "string.empty": 'El campo "recipients" es requerido',
      }),
      Joi.array().items(
        Joi.string().email().messages({
          "string.email": "Cada destinatario debe ser un correo electrónico válido",
        })
      )
    )
    .required()
    .messages({
      "any.required": 'El campo "recipients" es requerido',
    }),

  subject: Joi.string().trim().required().messages({
    "string.base": 'El campo "subject" debe ser una cadena de texto',
    "string.empty": 'El campo "subject" es requerido',
    "any.required": 'El campo "subject" es requerido',
  }),

  template: Joi.string().trim().required().messages({
    "string.base": 'El campo "template" debe ser una cadena de texto',
    "string.empty": 'El campo "template" es requerido',
    "any.required": 'El campo "template" es requerido',
  }),

  context: Joi.object().optional(),
});

module.exports = sendEmailSchema;

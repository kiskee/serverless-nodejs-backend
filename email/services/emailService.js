const nodemailer = require("nodemailer");
const  EmailTemplates  = require("../templates/email-templates");

class EmailService {
  constructor() {}

  // Crea el transporte de nodemailer con las variables de entorno
  emailTransport() {
    return nodemailer.createTransport({
      host: process.env.GOOGLE_HOST,
      port: Number(process.env.GOOGLE_PORT),
      secure: false,
      auth: {
        user: process.env.GOOGLE_EMA,
        pass: process.env.GOOGLE_PS,
      },
    });
  }

  // Renderiza el HTML del correo según el template y contexto
  renderTemplate(template, context) {
    let html;

    switch (template) {
      case 'welcome':
        html = EmailTemplates.WELCOME;
        break;
      case 'reset-password':
        html = EmailTemplates.RESET_PASSWORD;
        break;
      default:
        throw new Error('Template not found');
    }

    for (const key in context) {
      const placeholder = `{{${key}}}`;
      html = html.replace(new RegExp(placeholder, 'g'), context[key]);
    }

    return html;
  }

  // Envía el email usando los datos proporcionados
  async sendEmail(dto) {
    const { recipients, subject, template, context } = dto;

    const transport = this.emailTransport();
    const html = this.renderTemplate(template, context);

    const options = {
      from: process.env.GOOGLE_EMA,
      to: recipients,
      subject: subject,
      html: html,
    };

    try {
      await transport.sendMail(options);
     // this.logger.log(`Email sent to ${recipients}`);
    } catch (error) {
      //this.logger.error(`Failed to send email to ${recipients}`, error);
      throw new Error('Failed to send email');
    }
  }

}

module.exports = EmailService;

// src/common/templates/email-templates.ts
const EmailTemplates = {
  WELCOME: `
 <!DOCTYPE html>
<html>
<head>
    <title>Bienvenido a Emas Pro Trader</title>
    <style>
        body {
            font-family: 'Poppins', Arial, sans-serif;
            background-color: #f4f4f4;
            color: #333;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #fff;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            padding-bottom: 20px;
            border-bottom: 1px solid #e0e0e0;
            margin-bottom: 20px;
            background-color: #333;
            border-radius: 8px 8px 0 0;
            padding-top: 20px;
        }
        .header img {
            max-width: 200px;
            height: auto;
        }
        h1 {
            color: #FFD700;
            text-align: center;
            margin-top: 20px;
            font-weight: 700;
        }
        p {
            line-height: 1.6;
            font-size: 16px;
            color: #555;
        }
        .cta-text {
            display: block;
            margin: 20px auto;
            padding: 12px 24px;
            background-color: #FFD700;
            color: #333;
            border-radius: 6px;
            font-size: 16px;
            text-align: center;
            font-weight: bold;
        }
        .features {
            display: flex;
            justify-content: space-between;
            margin: 25px 0;
            flex-wrap: wrap;
        }
        .feature {
            flex-basis: 30%;
            text-align: center;
            margin-bottom: 15px;
        }
        .feature h3 {
            margin: 5px 0;
            color: #333;
        }
        .footer {
            text-align: center;
            margin-top: 20px;
            font-size: 0.9em;
            color: #777;
            padding-top: 20px;
            border-top: 1px solid #e0e0e0;
        }
        .highlight {
            color: #FFD700;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Encabezado con el logo -->
        <div class="header">
            <img src="https://firebasestorage.googleapis.com/v0/b/swimi-2be7a.firebasestorage.app/o/avatars%2Femasprotrader2.png?alt=media&token=eeae4d67-56c6-496d-a47d-3d0816e90be6" alt="Logo de Emas Pro Trader">
        </div>

        <!-- Mensaje de bienvenida -->
        <h1>¡Bienvenido, {{name}}!</h1>
        <p>Gracias por unirte a <strong>Emas Pro Trader</strong>, tu puerta de entrada al mundo del trading profesional. Estamos emocionados de tenerte a bordo y ayudarte a desarrollar tus habilidades para convertirte en un trader exitoso.</p>
        
        <p>En Emas Pro Trader, nos especializamos en <span class="highlight">estrategias basadas en las Medias Móviles Exponenciales (EMAs)</span> que han demostrado resultados consistentes en los mercados financieros.</p>

        <!-- Características principales -->
        <div class="features">
            <div class="feature">
                <h3>Análisis técnico</h3>
                <p>Aprende a identificar patrones y señales en los gráficos</p>
            </div>
            <div class="feature">
                <h3>Trading en vivo</h3>
                <p>Sesiones en tiempo real con traders profesionales</p>
            </div>
            <div class="feature">
                <h3>Comunidad exclusiva</h3>
                <p>Acceso a nuestra comunidad de traders</p>
            </div>
        </div>

        <p>Nuestro programa está diseñado para ofrecerte las herramientas y el conocimiento necesario para destacarte en los mercados financieros. Con nuestra metodología probada, te guiaremos paso a paso hacia la consistencia en tus operaciones.</p>

        <!-- Llamado a la acción (texto plano) -->
        <div style="text-align: center;">
            <div class="cta-text">Inicia sesión en tu Dashboard ahora</div>
        </div>

        <p>Recuerda que puedes acceder a todo nuestro contenido educativo, webinars y análisis de mercado desde tu panel personal. Si tienes alguna pregunta, escríbenos directamente a nuestro correo de soporte.</p>

        <!-- Pie de página -->
        <div class="footer">
            <p>Atentamente,<br>El equipo de Emas Pro Trader</p>
            <p>© 2025 Emas Pro Trader - Todos los derechos reservados</p>
            <p><small>Este correo fue enviado porque te registraste en nuestros servicios.</small></p>
        </div>
    </div>
</body>
</html>
  `,
  RESET_PASSWORD: `
  <!DOCTYPE html>
<html>
<head>
    <title>Restablecer contraseña - Emas Pro Trader</title>
    <style>
        body {
            font-family: 'Poppins', Arial, sans-serif;
            background-color: #f4f4f4;
            color: #333;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #fff;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            padding-bottom: 20px;
            border-bottom: 1px solid #e0e0e0;
            margin-bottom: 20px;
            background-color: #333;
            border-radius: 8px 8px 0 0;
            padding-top: 20px;
        }
        .header img {
            max-width: 200px;
            height: auto;
        }
        h1 {
            color: #FFD700;
            text-align: center;
            margin-top: 20px;
            font-weight: 700;
        }
        p {
            line-height: 1.6;
            font-size: 16px;
            color: #555;
            text-align: center;
        }
        .code-container {
            margin: 30px auto;
            text-align: center;
        }
        .reset-code {
            background-color: #f4f4f4;
            border: 1px solid #ddd;
            padding: 15px 25px;
            font-size: 24px;
            font-weight: bold;
            letter-spacing: 5px;
            border-radius: 5px;
            color: #333;
            display: inline-block;
        }
        .cta-text {
            display: block;
            width: 80%;
            margin: 20px auto;
            padding: 12px 24px;
            background-color: #FFD700;
            color: #333;
            border-radius: 6px;
            font-size: 16px;
            text-align: center;
            font-weight: bold;
        }
        .footer {
            text-align: center;
            margin-top: 20px;
            font-size: 0.9em;
            color: #777;
            padding-top: 20px;
            border-top: 1px solid #e0e0e0;
        }
        .highlight {
            color: #FFD700;
            font-weight: bold;
        }
        .instruction {
            margin: 25px 0;
            padding: 15px;
            background-color: #f9f9f9;
            border-radius: 6px;
        }
        .instruction ol {
            text-align: left;
            padding-left: 30px;
        }
        .instruction li {
            margin-bottom: 10px;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Encabezado con el logo -->
        <div class="header">
            <img src="https://firebasestorage.googleapis.com/v0/b/swimi-2be7a.firebasestorage.app/o/avatars%2Femasprotrader2.png?alt=media&token=eeae4d67-56c6-496d-a47d-3d0816e90be6" alt="Logo de Emas Pro Trader">
        </div>

        <!-- Título y mensaje -->
        <h1>Restablecer contraseña</h1>
        <p>Hemos recibido una solicitud para restablecer tu contraseña. Utiliza el siguiente código para completar el proceso:</p>

        <!-- Código de restablecimiento en lugar de botón -->
        <div class="code-container">
            <div class="reset-code">{{resetCode}}</div>
        </div>

        <!-- Instrucciones -->
        <div class="instruction">
            <p>Para completar el proceso de restablecimiento:</p>
            <ol>
                <li>Ingresa a la plataforma de Emas Pro Trader</li>
                <li>Selecciona la opción "Olvidé mi contraseña"</li>
                <li>Introduce el código que aparece arriba</li>
                <li>Crea y confirma tu nueva contraseña</li>
            </ol>
        </div>

        <!-- Mensaje adicional -->
        <p>Este código vencerá en 30 minutos. Si no solicitaste este cambio, puedes ignorar este correo. Tu contraseña no se modificará.</p>

        <!-- Texto de llamada a la acción (sin enlace) -->
        <div style="text-align: center;">
            <div class="cta-text">Ingresa el código para restablecer tu contraseña</div>
        </div>

        <!-- Pie de página -->
        <div class="footer">
            <p>Atentamente,<br>El equipo de Emas Pro Trader</p>
            <p>© 2025 Emas Pro Trader - Todos los derechos reservados</p>
        </div>
    </div>
</body>
</html>
  `,
};

module.exports = EmailTemplates;

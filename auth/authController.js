const AuthService = require('./services/authService');
const buildResponse = require('../utils/buildResponse');
const LoginDto = require('./dtos/loginDto');
const GoogleDto = require('./dtos/googleDto');
const ResetPasswordDto = require('./dtos/resetPasswordDto');

// Instancia del servicio de autenticación
const authService = new AuthService();

exports.handler = async (event) => {
  const { httpMethod, path, pathParameters, queryStringParameters, headers } = event;

  try {
    if (httpMethod === 'POST' && path.endsWith('/auth/login')) {
      return await login(event);
    }

    if (httpMethod === 'POST' && path.endsWith('/auth/login-google')) {
      return await loginGoogle(event);
    }

    if (httpMethod === 'POST' && path.endsWith('/auth/logout')) {
      return await logout(headers);
    }

    if (httpMethod === 'POST' && path.endsWith('/auth/renew-token')) {
      return await renewToken(event);
    }

    if (httpMethod === 'GET' && path.includes('/auth/signature')) {
      return await getSignature(event);
    }

    if (httpMethod === 'POST' && path.startsWith('/auth/forgot-password/')) {
      const email = pathParameters?.email;
      return await forgotPassword(email);
    }

    if (httpMethod === 'POST' && path.endsWith('/auth/reset-password')) {
      return await resetPassword(event);
    }

    return buildResponse(404, { message: 'Ruta no encontrada' });
  } catch (error) {
    console.error('Error en AuthController:', error);
    return buildResponse(500, {
      message: 'Error interno del servidor',
      error: error.message,
    });
  }
};

// --------- FUNCIONES CONTROLADORAS ---------

async function login(event) {
  const data = JSON.parse(event.body);
  const dto = new LoginDto(data);
  const errors = dto.validate();
  if (errors.length) return buildResponse(400, { message: 'Validación fallida', errors });

  const result = await authService.login(data);
  return buildResponse(200, result);
}

async function loginGoogle(event) {
  const data = JSON.parse(event.body);
  const dto = new GoogleDto(data);
  const errors = dto.validate();
  if (errors.length) return buildResponse(400, { message: 'Validación fallida', errors });

  const result = await authService.loginGoogle(data);
  return buildResponse(200, result);
}

async function logout(headers) {
  console.log('headers', headers);
  const token = headers?.authorization?.replace('Bearer ', '');
  if (!token) return buildResponse(401, { message: 'Token no proporcionado' });

  const result = await authService.logout(token);
  return buildResponse(200, result);
}

async function renewToken(event) {
  const { refreshToken } = JSON.parse(event.body || '{}');
  if (!refreshToken) return buildResponse(401, { message: 'Refresh token no proporcionado' });

  const result = await authService.renewToken(refreshToken);
  return buildResponse(200, result);
}


async function resetPassword(event) {
  const data = JSON.parse(event.body);
  const dto = new ResetPasswordDto(data);
  const errors = dto.validate();
  if (errors.length) return buildResponse(400, { message: 'Validación fallida', errors });

  const result = await authService.resetPassword(data.token, data.newPassword);
  return buildResponse(200, result);
}

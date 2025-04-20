const { v4: uuidv4 } = require("uuid");
const UserService = require("./services/userService");
const CreateUserDto = require("./dtos/CreateUserDto");
const buildResponse = require("../utils/buildResponse");

// Inicializar el servicio de usuarios
const userService = new UserService();

// Controlador principal que enruta a las diferentes funciones CRUD
exports.handler = async (event) => {
  console.log("Received event:", JSON.stringify(event, null, 2));

  const { httpMethod, path, pathParameters } = event;

  try {
    // Enrutamiento basado en método y ruta
    if (httpMethod === "POST" && path.endsWith("/users")) {
      return await createUser(event);
    } else if (httpMethod === "GET" && pathParameters && pathParameters.id) {
      return await getUser(event);
    } else if (httpMethod === "GET" && path.includes("/users/email/")) {
      return await findUserByEmail(event);
    } else if (httpMethod === "GET" && path.endsWith("/users")) {
      return await listUsers(event);
    } else if (httpMethod === "PUT" && pathParameters && pathParameters.id) {
      return await updateUser(event);
    } else if (httpMethod === "DELETE" && pathParameters && pathParameters.id) {
      return await deleteUser(event);
    }

    // Si no coincide con ninguna ruta
    return buildResponse(404, { message: "Ruta no encontrada" });
  } catch (error) {
    console.error("Error en el controlador principal:", error);
    return buildResponse(500, {
      message: "Error interno del servidor",
      error: error.message,
    });
  }
};

// Función para crear un usuario
async function createUser(event) {
  try {
    const data = JSON.parse(event.body);
    const userDto = new CreateUserDto(data);

    // Validate user data
    const validationErrors = userDto.validate();
    if (validationErrors.length > 0) {
      return buildResponse(400, {
        message: "Validation failed",
        errors: validationErrors,
      });
    }

    const result = await userService.createUser(userDto);
    if (result.error) {
      return buildResponse(result.statusCode || 400, result);
    }

    return buildResponse(201, {
      message: "Usuario creado exitosamente",
      user: result.user,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    return buildResponse(500, {
      message: "No se pudo crear el usuario",
      error: error.message,
    });
  }
}

// Función para obtener un usuario por ID
async function getUser(event) {
  try {
    const userId = event.pathParameters.id;
    const user = await userService.getUserById(userId);

    if (!user) {
      return buildResponse(404, { message: "Usuario no encontrado" });
    }

    return buildResponse(200, user);
  } catch (error) {
    console.error("Error getting user:", error);
    return buildResponse(500, {
      message: "Error al obtener el usuario",
      error: error.message,
    });
  }
}

// Función para buscar un usuario por email
async function findUserByEmail(event) {
  try {
    const email = decodeURIComponent(event.pathParameters.email);
    const user = await userService.getUserByEmail(email);

    if (!user) {
      return buildResponse(404, {
        message: "Usuario no encontrado con ese email",
      });
    }

    return buildResponse(200, user);
  } catch (error) {
    console.error("Error finding user by email:", error);
    return buildResponse(500, {
      message: "Error al buscar usuario por email",
      error: error.message,
    });
  }
}

// Función para listar todos los usuarios
async function listUsers() {
  try {
    const users = await userService.getAllUsers();
    return buildResponse(200, users);
  } catch (error) {
    console.error("Error listing users:", error);
    return buildResponse(500, {
      message: "Error al listar usuarios",
      error: error.message,
    });
  }
}

// Función para actualizar un usuario
async function updateUser(event) {
  try {
    const userId = event.pathParameters.id;
    const data = JSON.parse(event.body);

    const result = await userService.updateUser(userId, data);
    
    if (result.error) {
      return buildResponse(result.statusCode || 400, result);
    }

    return buildResponse(200, {
      message: "Usuario actualizado exitosamente",
      user: result.user,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return buildResponse(500, {
      message: "Error al actualizar el usuario",
      error: error.message,
    });
  }
}

// Función para eliminar un usuario
async function deleteUser(event) {
  try {
    const userId = event.pathParameters.id;
    const result = await userService.deleteUser(userId);

    if (result.error) {
      return buildResponse(result.statusCode || 400, result);
    }

    return buildResponse(200, { message: "Usuario eliminado exitosamente" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return buildResponse(500, {
      message: "Error al eliminar el usuario",
      error: error.message,
    });
  }
}
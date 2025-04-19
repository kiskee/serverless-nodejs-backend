const { v4: uuidv4 } = require("uuid");
const AWS = require("aws-sdk");
const bcrypt = require("bcryptjs");

// Inicializar DynamoDB
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const USERS_TABLE = process.env.USERS_TABLE;

// DTO para validación
class CreateUserDto {
  constructor(data) {
    this.email = data.email;
    this.email_verified = data.email_verified || false;
    this.family_name = data.family_name;
    this.given_name = data.given_name;
    this.name = data.name;
    this.picture = data.picture;
    this.sub = data.sub;
    this.password = data.password;
  }

  validate() {
    const errors = [];

    // Email validation
    if (!this.email || !this.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      errors.push("El correo electrónico proporcionado no es válido");
    }

    // Name validation
    if (!this.name || this.name.trim() === "") {
      errors.push("El nombre completo es obligatorio");
    }

    // Password validation if provided
    if (this.password !== undefined) {
      if (this.password.length < 8) {
        errors.push("La contraseña debe tener al menos 8 caracteres");
      } else if (this.password.length > 50) {
        errors.push("La contraseña no debe exceder los 50 caracteres");
      }

      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;
      if (!passwordRegex.test(this.password)) {
        errors.push(
          "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character"
        );
      }
    }

    // Type validation
    if (
      this.email_verified !== undefined &&
      typeof this.email_verified !== "boolean"
    ) {
      errors.push("email_verified debe ser un valor booleano");
    }

    if (
      this.family_name !== undefined &&
      typeof this.family_name !== "string"
    ) {
      errors.push("family_name debe ser una cadena de texto");
    }

    if (this.given_name !== undefined && typeof this.given_name !== "string") {
      errors.push("given_name debe ser una cadena de texto");
    }

    if (this.picture !== undefined && typeof this.picture !== "string") {
      errors.push("picture debe ser una cadena de texto");
    }

    if (this.sub !== undefined && typeof this.sub !== "string") {
      errors.push("sub debe ser una cadena de texto");
    }

    return errors;
  }
}

// Utilidad para respuestas HTTP
const buildResponse = (statusCode, body) => {
  return {
    statusCode,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    },
    body: JSON.stringify(body),
  };
};

// Controlador principal que enruta a las diferentes funciones CRUD
exports.handler = async (event) => {
  console.log("Received event:", JSON.stringify(event, null, 2));

  const { httpMethod, path, pathParameters, body } = event;

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

    // Check if user with this email already exists
    const emailCheck = await dynamoDb
      .query({
        TableName: USERS_TABLE,
        IndexName: "EmailIndex",
        KeyConditionExpression: "email = :email",
        ExpressionAttributeValues: {
          ":email": userDto.email,
        },
      })
      .promise();

    if (emailCheck.Items.length > 0) {
      return buildResponse(409, {
        message: "Un usuario con este correo ya existe",
      });
    }

    // Hash password if provided
    if (userDto.password) {
      userDto.password = await bcrypt.hash(userDto.password, 10);
    }

    const timestamp = new Date().getTime();
    const userId = uuidv4();

    const newUser = {
      id: userId,
      email: userDto.email,
      email_verified: userDto.email_verified,
      family_name: userDto.family_name,
      given_name: userDto.given_name,
      name: userDto.name,
      picture: userDto.picture,
      sub: userDto.sub,
      password: userDto.password,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    await dynamoDb
      .put({
        TableName: USERS_TABLE,
        Item: newUser,
      })
      .promise();

    // Don't return the password in the response
    delete newUser.password;

    return buildResponse(201, {
      message: "Usuario creado exitosamente",
      user: newUser,
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

    const result = await dynamoDb
      .get({
        TableName: USERS_TABLE,
        Key: { id: userId },
      })
      .promise();

    if (!result.Item) {
      return buildResponse(404, { message: "Usuario no encontrado" });
    }

    // Don't return the password
    delete result.Item.password;

    return buildResponse(200, result.Item);
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

    // Utilizamos el índice EmailIndex para buscar eficientemente por email
    const result = await dynamoDb
      .query({
        TableName: USERS_TABLE,
        IndexName: "EmailIndex",
        KeyConditionExpression: "email = :email",
        ExpressionAttributeValues: {
          ":email": email,
        },
      })
      .promise();

    if (!result.Items || result.Items.length === 0) {
      return buildResponse(404, {
        message: "Usuario no encontrado con ese email",
      });
    }

    // Si hay múltiples usuarios con el mismo email (lo cual no debería suceder),
    // tomamos el primero
    const user = result.Items[0];

    // No devolver la contraseña en la respuesta
    delete user.password;

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
    const result = await dynamoDb
      .scan({
        TableName: USERS_TABLE,
      })
      .promise();
    return buildResponse(200, result.Items);
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

    // First check if user exists
    const userCheck = await dynamoDb
      .get({
        TableName: USERS_TABLE,
        Key: { id: userId },
      })
      .promise();

    if (!userCheck.Item) {
      return buildResponse(404, { message: "Usuario no encontrado" });
    }

    // Validate update data
    const userDto = new CreateUserDto({
      ...userCheck.Item,
      ...data,
    });

    const validationErrors = userDto.validate();
    if (validationErrors.length > 0) {
      return buildResponse(400, {
        message: "Validation failed",
        errors: validationErrors,
      });
    }

    // If email is being changed, check if it already exists
    if (data.email && data.email !== userCheck.Item.email) {
      const emailCheck = await dynamoDb
        .query({
          TableName: USERS_TABLE,
          IndexName: "EmailIndex",
          KeyConditionExpression: "email = :email",
          ExpressionAttributeValues: {
            ":email": data.email,
          },
        })
        .promise();

      if (emailCheck.Items.length > 0) {
        return buildResponse(409, {
          message: "Un usuario con este correo ya existe",
        });
      }
    }

    // Hash password if provided
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    // Build update expression safely
    let updateExpression = "set #updatedAt = :updatedAt";
    const expressionAttributeValues = {
      ":updatedAt": new Date().getTime(),
    };
    const expressionAttributeNames = {
      "#updatedAt": "updatedAt",
    };

    Object.keys(data).forEach((key) => {
      const attributeName = `#${key}`;
      const attributeValue = `:${key}`;

      updateExpression += `, ${attributeName} = ${attributeValue}`;
      expressionAttributeValues[attributeValue] = data[key];
      expressionAttributeNames[attributeName] = key;
    });

    // Perform update
    await dynamoDb
      .update({
        TableName: USERS_TABLE,
        Key: { id: userId },
        UpdateExpression: updateExpression,
        ExpressionAttributeValues: expressionAttributeValues,
        ExpressionAttributeNames: expressionAttributeNames,
        ReturnValues: "ALL_NEW",
      })
      .promise();

    // Get the updated user
    const updatedUser = await dynamoDb
      .get({
        TableName: USERS_TABLE,
        Key: { id: userId },
      })
      .promise();

    // Don't return the password
    delete updatedUser.Item.password;

    return buildResponse(200, {
      message: "Usuario actualizado exitosamente",
      user: updatedUser.Item,
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

    // Check if user exists first
    const userCheck = await dynamoDb
      .get({
        TableName: USERS_TABLE,
        Key: { id: userId },
      })
      .promise();

    if (!userCheck.Item) {
      return buildResponse(404, { message: "Usuario no encontrado" });
    }

    await dynamoDb
      .delete({
        TableName: USERS_TABLE,
        Key: { id: userId },
      })
      .promise();

    return buildResponse(200, { message: "Usuario eliminado exitosamente" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return buildResponse(500, {
      message: "Error al eliminar el usuario",
      error: error.message,
    });
  }
}

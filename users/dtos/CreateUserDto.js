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

module.exports = CreateUserDto;

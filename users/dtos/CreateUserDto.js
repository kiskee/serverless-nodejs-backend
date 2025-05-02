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

    // Validar email
    if (!this.email) {
      errors.push('El email es requerido');
    } else if (!this.isValidEmail(this.email)) {
      errors.push('El formato del email es inválido');
    }

    // Validar nombre
    if (!this.name) {
      errors.push('El nombre es requerido');
    }

    // Si se está creando un usuario nuevo (no actualización), validar password
    if (this.isNewUser() && !this.password) {
      errors.push('La contraseña es requerida para nuevos usuarios');
    }

    // Puedes agregar más validaciones según tus requerimientos

    return errors;
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  isNewUser() {
    // Si no tiene sub o id, asumimos que es un usuario nuevo
    return !this.sub;
  }
}

module.exports = CreateUserDto;
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
}

module.exports = CreateUserDto;

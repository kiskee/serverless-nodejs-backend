class ResetPasswordDto {
  constructor(data) {
    this.token = data.token;
    this.newPassword = data.newPassword;
  }
}

module.exports = ResetPasswordDto;
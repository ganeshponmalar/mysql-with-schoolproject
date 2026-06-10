export class RegisterPage {
  constructor(page) {
    this.page = page;

    this.fullNameInput = page.getByLabel('Full Name');

    this.emailInput = page.getByLabel(
      'Email Address'
    );

    this.passwordInput = page.getByLabel(
      'Password'
    );

    this.roleDropdown = page.getByLabel(
      'Register As'
    );

    this.signUpBtn = page.getByRole('button', {
      name: 'Sign Up'
    });
  }

  async navigate() {
    await this.page.goto(
      'http://localhost:5173/register'
    );
  }

  async registerUser(user) {
    await this.fullNameInput.fill(user.name);

    await this.emailInput.fill(user.email);

    await this.passwordInput.fill(user.password);

    await this.roleDropdown.selectOption(
      user.role
    );

    await this.signUpBtn.click();
  }
}
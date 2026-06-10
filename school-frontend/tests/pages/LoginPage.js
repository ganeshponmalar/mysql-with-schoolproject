export class LoginPage {
  constructor(page) {
    this.page = page;

    this.teacherBtn = page.getByRole('button', {
      name: 'teacher',
      exact: true
    });

    this.emailInput = page.getByPlaceholder('name@school.com');

    this.passwordInput = page.getByPlaceholder('••••••••');

    this.loginBtn = page.getByRole('button', {
      name: /login/i
    });
  }

  async navigate() {
    await this.page.goto('http://localhost:5173/login');
  }

  async login(email, password) {
    await this.teacherBtn.click();
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginBtn.click();
  }
}
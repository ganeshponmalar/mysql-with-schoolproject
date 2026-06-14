export class AuthPage {

  constructor(page) {
    this.page = page;

    this.username =
      page.locator('[data-test="username"]');

    this.password =
      page.locator('[data-test="password"]');

    this.loginBtn =
      page.locator('[data-test="login-button"]');
  }

  async openApplication() {
    await this.page.goto(
      'https://www.saucedemo.com/'
    );
  }

  async signIn(username, password) {

    await this.username.fill(username);

    await this.password.fill(password);

    await this.loginBtn.click();
  }
}
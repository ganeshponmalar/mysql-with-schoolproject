import { expect } from '@playwright/test';

export class PracticePage {
  constructor(page) {
    this.page = page;

    this.countryInput = page.locator('#autocomplete');
    this.dropdown = page.locator('#dropdown-class-example');

    this.checkbox1 = page.locator('#checkBoxOption1');
    this.checkbox2 = page.locator('#checkBoxOption2');
    this.checkbox3 = page.locator('#checkBoxOption3');

    this.hideBtn = page.locator('#hide-textbox');
    this.showBtn = page.locator('#show-textbox');

    this.alertBtn = page.locator('#alertbtn');
    this.confirmBtn = page.locator('#confirmbtn');
  }

  async navigate() {
    await this.page.goto(
      'https://rahulshettyacademy.com/AutomationPractice/#top'
    );
  }

  async selectRadioButton(value) {
    await this.page
      .locator(`#radio-btn-example input[value="${value}"]`)
      .check();
  }

  async selectCountry(country, option) {
    await this.countryInput.fill(country);

    await this.page
      .locator('.ui-menu-item div')
      .filter({ hasText: option })
      .first()
      .click();
  }

  async selectDropdown(value) {
    await this.dropdown.selectOption(value);
  }

  async selectAllCheckboxes() {
    await this.checkbox1.check();
    await this.checkbox2.check();
    await this.checkbox3.check();
  }

  async uncheckCheckbox3() {
    await this.checkbox3.uncheck();
  }

  async openWindow() {
    const [popup] = await Promise.all([
      this.page.context().waitForEvent('page'),
      this.page.locator('#openwindow').click()
    ]);

    await popup.waitForLoadState();
    console.log(await popup.title());

    await popup.close();
  }

  async openTab() {
    const [popup] = await Promise.all([
      this.page.context().waitForEvent('page'),
      this.page.locator('#opentab').click()
    ]);

    await popup.waitForLoadState();
    console.log(await popup.title());

    await popup.close();
  }

  async hideAndShowTextbox() {
    await this.hideBtn.click();
    await this.showBtn.click({ force: true });
  }

  async mouseHoverTop() {
    await this.page.locator('#mousehover').hover();

    await this.page
      .locator('.mouse-hover-content a')
      .filter({ hasText: 'Top' })
      .click();
  }

  async handleAlert() {
    this.page.once('dialog', async dialog => {
      console.log(dialog.message());
      await dialog.accept();
    });

    await this.alertBtn.click();
  }

  async handleConfirm() {
    this.page.once('dialog', async dialog => {
      console.log(dialog.message());
      await dialog.dismiss();
    });

    await this.confirmBtn.click();
  }

  async printTableRows() {
    const rows = this.page.locator('.table-display tr');

    console.log(
      'Row Count:',
      await rows.count()
    );
  }

  async handleIframe() {
    await this.page
      .locator('#courses-iframe')
      .waitFor();

    const frame =
      this.page.frameLocator('#courses-iframe');

    await frame
      .getByRole('link', { name: 'Courses' })
      .first()
      .click();
  }

  async verifyCheckbox1Checked() {
    await expect(this.checkbox1)
      .toBeChecked();
  }

  async verifyDropdownValue(value) {
    await expect(this.dropdown)
      .toHaveValue(value);
  }
}
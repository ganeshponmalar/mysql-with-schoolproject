// tests/pages/ManageTeacherPage.js

export class ManageTeacherPage {
  constructor(page) {
    this.page = page;

    this.manageTeachersLink = page.getByRole('link', {
      name: 'Manage Teachers'
    });

    this.appointFacultyBtn = page.getByRole('button', {
      name: /appoint faculty/i
    });

    this.idNumber = page.getByPlaceholder('ID Number...');
    this.userId = page.getByPlaceholder('Optional User ID...');
    this.name = page.getByPlaceholder('e.g. Jane Doe');
    this.department = page.getByPlaceholder('e.g. Mathematics');
    this.specialization = page.getByPlaceholder('e.g. Sciences');
    this.qualification = page.getByPlaceholder('e.g. Ph.D. in Physics');
  }

  async openManageTeachers() {
    await this.manageTeachersLink.click();
  }

  async openAppointmentModal() {
    await this.appointFacultyBtn.click();
  }

  async fillFacultyForm(data) {
    await this.idNumber.fill(data.idNumber);
    await this.userId.fill(data.userId);
    await this.name.fill(data.name);
    await this.department.fill(data.department);
    await this.specialization.fill(data.specialization);
    await this.qualification.fill(data.qualification);
  }

  async submitForm() {
    await this.page.locator('form')
      .evaluate(form => form.requestSubmit());
  }
}
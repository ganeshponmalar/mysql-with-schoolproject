import { test, expect } from './fixtures/schoolFixture.js';


test('Teacher appointment flow', async ({
  loginPage,
  manageTeacherPage
}) => {

  await loginPage.navigate();

  await loginPage.login(
    'james@gmail.com',
    'james123'
  );

  await manageTeacherPage.openManageTeachers();

  await manageTeacherPage.openAppointmentModal();

  await manageTeacherPage.fillFacultyForm({
    idNumber: '1001',
    userId: '1',
    name: 'James',
    department: 'Mathematics',
    specialization: 'Sciences',
    qualification: 'Ph.D. in Physics'
  });

  await manageTeacherPage.submitForm();
});

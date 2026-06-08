import { test } from "../tests/fixtures/practiceFixture.js";
import { practiceData } from '../tests/utils/testData.js';

test.setTimeout(120000);

test(
  'Rahul Shetty Practice Page',
  async ({ practicePage }) => {

    await practicePage.navigate();

    // Radio Buttons
    await practicePage.selectRadioButton('radio1');
    await practicePage.selectRadioButton('radio2');
    await practicePage.selectRadioButton('radio3');

    // Auto Suggestion
    await practicePage.selectCountry(
      practiceData.country,
      practiceData.countryOption
    );

    // Dropdown
    await practicePage.selectDropdown(
      practiceData.dropdownValue
    );

    // Checkboxes
    await practicePage.selectAllCheckboxes();
    await practicePage.uncheckCheckbox3();

    // Window
    await practicePage.openWindow();

    // Tab
    await practicePage.openTab();

    // Hide / Show
    await practicePage.hideAndShowTextbox();

    // Mouse Hover
    await practicePage.mouseHoverTop();

    // Alert
    await practicePage.handleAlert();

    // Confirm
    await practicePage.handleConfirm();

    // Table
    await practicePage.printTableRows();

    // Iframe
    await practicePage.handleIframe();

    // Assertions
    await practicePage.verifyCheckbox1Checked();

    await practicePage.verifyDropdownValue(
      practiceData.dropdownValue
    );
  }
);
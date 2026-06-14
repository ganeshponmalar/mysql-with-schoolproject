Playwright tests folder structure

Recommended layout for this project (inside `tests/`):

- specs/            -> test files (e.g. todo.spec.js, booking.spec.js)
- pages/            -> Page Object classes (e.g. todoPage.js)
- fixtures/         -> custom fixtures and test extensions
- utils/            -> test utilities and test data
- reports/          -> generated reports (gitignored)

Run tests:

- `npm test` - run Playwright tests
- `npm run test:headed` - run with headed browsers
- `npm run test:report` - open the latest HTML report
- `npm run test:debug` - run with PWDEBUG enabled

Notes:
- `playwright.config.js` uses `testDir: './tests'` so all subfolders are scanned.
- Keep spec files under `tests/specs` for clarity, or continue using `tests/` root if preferred.

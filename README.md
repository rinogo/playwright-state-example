# playwright-state-example

This example shows how to use Playwright's new [`browserContext.storageState()`](https://playwright.dev/#version=master&path=docs%2Fapi.md&q=browsercontextstoragestate) and corresponding [`browser.newContext({storageState})`](https://playwright.dev/#version=master&path=docs%2Fapi.md&q=browsercontextstoragestate) functionality.

## Usage
This example uses features that are currently only available on the `master` branch of Playwright.
For this code to work, you must manually [install and build playwright](https://github.com/microsoft/playwright/blob/master/CONTRIBUTING.md#getting-code) in the `playwright` directory. E.g:
1. `git clone https://github.com/microsoft/playwright`
1. `cd playwright`
1. `npm install`
1. `npm run build`

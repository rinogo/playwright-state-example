# playwright-state-example

This example shows how to use Playwright's new [`browserContext.storageState()`](https://playwright.dev/#version=master&path=docs%2Fapi.md&q=browsercontextstoragestate) and corresponding [`browser.newContext({storageState})`](https://playwright.dev/#version=master&path=docs%2Fapi.md&q=browsercontextstoragestate) functionality.

## Installation
This example uses features that are currently only available on the `master` branch of Playwright.
For this code to work, you must manually [install and build playwright](https://github.com/microsoft/playwright/blob/master/CONTRIBUTING.md#getting-code) in the `playwright` directory. E.g:
1. `git clone https://github.com/microsoft/playwright`
1. `cd playwright`
1. `npm install`
1. `npm run build`

## Usage
Every time you run the script, you should notice the visit counter increasing. This is stored in LocalStorage by the page the Playwright accesses.

```console
Rinogo:playwright-state-example rinogo$ node example.js 
You have been here...

LocalStorage: 10 time(s).
Rinogo:playwright-state-example rinogo$ node example.js 
You have been here...

LocalStorage: 11 time(s).
Rinogo:playwright-state-example rinogo$ node example.js 
You have been here...

LocalStorage: 12 time(s).
```

You can clear the saved state in the `savedState` file to see the counter reset:

```console
Rinogo:playwright-state-example rinogo$ rm savedState 
Rinogo:playwright-state-example rinogo$ node example.js 
You have been here...

LocalStorage: 1 time(s).
```
## Awesome
That's it. Thanks to the Playwright team for such a sweet tool. Now, go build something!

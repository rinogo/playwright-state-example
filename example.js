const { chromium } = require("./playwright");
const fs = require("fs").promises;

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ storageState: await loadState() }); //Create a new context from the saved state.
  const page = await context.newPage();
  await page.goto("https://raw.githack.com/rinogo/playwright-state-example/main/example.html");
  await page.screenshot({ path: "example.png" });
  await saveState(context); //Save the updated state
  await browser.close();
})();

//Load the state stored in `path`.
const loadState = async (path = "savedState") =>  {
  let json;
  try {
    json = await fs.readFile(path, "utf8");
  } catch (e) {
    json = "{}";
  }

  return JSON.parse(json);
}

//Save the state of `context` to `path`. If `merge` is true, the new state will be merged into any pre-existing state.
const saveState = async (context, path = "savedState", merge = true) =>  {
  let state = await context.storageState();

  //Merge `state` into `oldState` (the state currently stored at `path`).
  if(merge) {
    let oldState = await loadState(path);
    console.log(JSON.stringify(oldState));
    newState = {
      cookies: [
        ...(oldState.cookies || []),
        ...state.cookies
      ],
      origins: [
        ...(oldState.origins || []),
        ...state.origins
      ]
    };
  } else {
    newState = state;
  }

  console.log(JSON.stringify(newState, null, 2));

  await fs.writeFile(path, JSON.stringify(newState), "utf8");
}

const { chromium } = require("./playwright");
const { stat } = require("fs");
const fs = require("fs").promises;

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ storageState: await loadState() }); //Create a new context from the saved state.
  const page = await context.newPage();
  await page.goto("https://raw.githack.com/rinogo/playwright-state-example/main/example.html");
  console.log(await (await page.$("body")).innerText());
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
//NOTE: This function is a bit "racy". There's a chance of losing any changes that are made between the time that the state is reloaded and saved back. Also, there may be concurrency issues when multiple Playwright scripts are consistently modifying the same state values. If this is a problem, a better storage solution (as opposed to a flat file) might be warranted.
const saveState = async (context, path = "savedState", merge = true) =>  {
  let state = await context.storageState();
  let newState;

  //Merge `state` into `oldState` (the state currently stored at `path`).
  if(merge) {
    //Load state again (important in case it has changed on disk since we last loaded it)
    let oldState = await loadState(path);

    newState = {
      cookies: uniqBy([
        ...state.cookies,
        ...(oldState.cookies || [])
      ], (o) => o["domain"] + ":" + o["name"] ),
      origins: mergeLocalStorage([
        ...state.origins,
        ...(oldState.origins || [])
      ])
    };
  } else {
    newState = state;
  }

  if(Object.keys(newState.cookies).length === 0) {
    delete newState.cookies;
  }
  if(Object.keys(newState.origins).length === 0) {
    delete newState.origins;
  }

  let newStateJson = JSON.stringify(newState, null, 2);

  // console.log("\nnewState:");
  // console.log(newStateJson);

  await fs.writeFile(path, newStateJson, "utf8");
}

//uniqBy() from https://stackoverflow.com/a/40808569/114558
//NOTE: In the case of duplicates, the object that is encountered first is retained. (This differs from usage of the spread operator on primitives, in which the last-specified primitive is retained)
const uniqBy = (arr, predicate) => {
  const cb = typeof predicate === 'function' ? predicate : (o) => o[predicate];
  
  return [...arr.reduce((map, item) => {
    const key = (item === null || item === undefined) ? 
      item : cb(item);
    
    map.has(key) || map.set(key, item);
    
    return map;
  }, new Map()).values()];
};

const mergeLocalStorage = (originsParam) => {
  let originsByUrl = {};
  for(let i = 0; i < originsParam.length; i++) {
    let obj = originsParam[i];
    if(!originsByUrl[obj.origin]) {
      originsByUrl[obj.origin] = [];
    }

    originsByUrl[obj.origin].push(...obj.localStorage);
  }

  let r = [];
  for(const [url, origins] of Object.entries(originsByUrl)) {
    originsByUrl[url] = uniqBy(origins, "name");
    r.push({
      origin: url,
      localStorage: originsByUrl[url]
    })
  }

  return r;
}
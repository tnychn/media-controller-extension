window.__tabs__ = {};

function applyPopupViews(func, args) {
  const views = browser.extension.getViews({ type: "popup" });
  for (const view of views) {
    view[func].apply(view, args);
  }
}

async function init(tab) {
  if (typeof tab === "number") {
    tab = await browser.tabs.get(tab);
  }
  const url = new URL(tab.url);
  return {
    id: tab.id,
    wid: tab.windowId,
    media: null,
    title: tab.title,
    favicon: tab.favIconUrl,
    hostname: url.hostname,
    thumbnail: await (async () => {
      if (url.hostname === "www.youtube.com") {
        const vid = tab.url.match(/\/(?:watch\?v=|embed\/|shorts\/)([A-Za-z0-9_-]{11})/)[1];
        return `https://i.ytimg.com/vi/${vid}/hqdefault.jpg`;
      }
      return (
        await browser.tabs.executeScript(tab.id, {
          code: `document.querySelector("meta[property='og:image']")?.getAttribute("content");`,
        })
      )[0];
    })(),
  };
}

async function register(tid) {
  window.__tabs__[tid] = await init(tid);
  applyPopupViews("add", [window.__tabs__[tid]]);
  await browser.browserAction.enable();
  await browser.browserAction.setBadgeText({
    text: String(Object.keys(window.__tabs__).length),
  });
  await browser.tabs.executeScript(tid, { file: "inject.js" });
}

async function unregister(tid) {
  delete window.__tabs__[tid];
  applyPopupViews("del", [tid]);
  const length = Object.keys(window.__tabs__).length;
  length === 0 && (await browser.browserAction.disable());
  await browser.browserAction.setBadgeText({
    text: length > 0 ? String(length) : null,
  });
  await browser.tabs.sendMessage(tid, "@unhook");
}

browser.browserAction.disable();
browser.browserAction.setBadgeTextColor({ color: "white" });
browser.browserAction.setBadgeBackgroundColor({ color: "gray" });

browser.tabs.query({ audible: true, status: "complete" }).then(async (tabs) => {
  for (const { id } of tabs) {
    await register(id);
  }
});

browser.tabs.onUpdated.addListener(
  async (tid, { audible }) => {
    if (audible && !(tid in window.__tabs__)) {
      await register(tid);
    }
  },
  { properties: ["audible"] }
);

browser.tabs.onUpdated.addListener(
  async (tid) => {
    if (tid in window.__tabs__) {
      await unregister(tid);
      await new Promise((r) => setTimeout(r, 4500));
      const tab = await browser.tabs.get(tid);
      if (tab.audible) {
        await register(tid);
      }
    }
  },
  { properties: ["url", "status"] }
);

browser.tabs.onUpdated.addListener(
  async (tid, { title }) => {
    if (tid in window.__tabs__) {
      window.__tabs__[tid].title = title;
      applyPopupViews("update", [window.__tabs__[tid]]);
    }
  },
  { properties: ["title"] }
);

browser.tabs.onRemoved.addListener(async (tid) => {
  if (tid in window.__tabs__) {
    await unregister(tid);
  }
});

browser.runtime.onMessage.addListener(async (message, sender) => {
  const tid = sender.tab.id;
  console.log(message.type);
  if (message.type === "@hook") {
    window.__tabs__[tid].media = message.media;
    await browser.tabs.executeScript(tid, { file: "hook.js" });
  } else if (message.type === "play") {
    window.__tabs__[tid].media.paused = false;
  } else if (message.type === "pause") {
    window.__tabs__[tid].media.paused = true;
  } else if (message.type === "volumechange") {
    window.__tabs__[tid].media.muted = message.volume === null;
  } else return;
  applyPopupViews("update", [window.__tabs__[tid]]);
});

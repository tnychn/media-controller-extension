/* global Utils */

window.__tabs__ = {};

const getTabThumbnail = async (tid) =>
  (
    await browser.tabs.executeScript(tid, {
      code: `document.head.querySelector("meta[property=\\"og:image\\"]")?.getAttribute("content");`,
    })
  )[0];

const getTabState = async (tid) =>
  (
    await browser.tabs.executeScript(tid, {
      code: `var $$media = () => document.querySelector("[mcx-media]"); var $media = $$media();
      $media === null ? undefined : !$media.paused;`,
    })
  )[0];

const getTabVolume = async (tid) =>
  (
    await browser.tabs.executeScript(tid, {
      code: `var $$media = () => document.querySelector("[mcx-media]"); var $media = $$media();
      $media === null ? undefined : $media.muted ? null : $media.volume;`,
    })
  )[0];

async function getTab(tab) {
  if (typeof tab === "number") tab = await browser.tabs.get(tab);
  const state = await getTabState(tab.id);
  const volume = await getTabVolume(tab.id);
  const thumbnail = await getTabThumbnail(tab.id);
  return {
    id: tab.id,
    title: tab.title,
    audible: tab.audible,
    favicon: tab.favIconUrl,
    hostname: new URL(tab.url).hostname,
    state, // playing: true; paused: false; unavailable: undefined
    volume, // muted: null; unmuted: number; unavailable: undefined
    thumbnail,
    color: await Utils.extractImageColor(thumbnail),
  };
}

async function updatePopupView(func, args) {
  const popups = browser.extension.getViews({ type: "popup" });
  for (const popup of popups) popup[func].apply(popup, args);
}

async function registerTab(tab) {
  window.__tabs__[tab.id] = tab;
  await updatePopupView("ADD", [tab]);
  await browser.browserAction.enable();
  await browser.browserAction.setBadgeText({
    text: String(Object.keys(window.__tabs__).length),
  });
  await browser.tabs.executeScript(tab.id, { file: "inject.js" });
}

async function unregisterTab(tid) {
  delete window.__tabs__[tid];
  await updatePopupView("DEL", [tid]);
  const length = Object.keys(window.__tabs__).length;
  length === 0 && (await browser.browserAction.disable());
  await browser.browserAction.setBadgeText({
    text: length > 0 ? String(length) : null,
  });
  await browser.tabs.executeScript(tid, { code: `window.dispatchEvent(new Event("MCX_unhook"));` });
}

browser.browserAction.disable();
browser.browserAction.setBadgeTextColor({ color: "white" });
browser.browserAction.setBadgeBackgroundColor({ color: "gray" });

browser.tabs.query({ audible: true, status: "complete" }, async (tabs) =>
  tabs.forEach(async (tab) => await registerTab(await getTab(tab)))
);

browser.tabs.onUpdated.addListener(
  // update tab when its url changes and still audible, unregister otherwise
  async (tid) => {
    await unregisterTab(tid); // unregister tab before throttling
    // throttling: SPAs take time to load after url changes
    // (tab is no longer audible 4500ms after the media stopped)
    await new Promise((r) => setTimeout(r, 4500));
    // register tab again if it is still audible
    const tab = await getTab(tid);
    if (tab.audible) await registerTab(tab);
  },
  { properties: ["url", "status"] }
);

browser.tabs.onUpdated.addListener(
  // register tab when it starts playing media (audible)
  async (tid, changeset) => {
    if (!changeset.audible) return;
    await registerTab(await getTab(tid));
  },
  { properties: ["audible"] }
);

browser.tabs.onRemoved.addListener(async (tid) => {
  // unregister tab when it is closed
  await unregisterTab(tid);
});

browser.runtime.onMessage.addListener(async (message, { tab: { id: tid } }) => {
  // update tab when hooked media
  if (message.event === "@hook") window.__tabs__[tid] = await getTab(tid);
  // update tab when its media is paused/played/(un)muted
  if (["pause", "play"].includes(message.event)) window.__tabs__[tid].state = message.event === "pause" ? false : true;
  else if (message.event === "volumechange") window.__tabs__[tid].volume = message.volume;
  await updatePopupView("UPDATE", [window.__tabs__[tid]]);
});

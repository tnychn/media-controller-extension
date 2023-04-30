/* global Icons, Utils */

const $main = document.querySelector("main");

const $tab = (tab) => {
  const $ = document.createElement("div");
  $.className = "tab";
  $.dataset.tid = tab.id;
  const bgColor = tab.color;
  const fgColor = Utils.invertColorHex(bgColor);
  $.innerHTML = `
  <div class="tab-meta" style="background-color: rgba(${bgColor.join(",")}); color: ${fgColor};">
    <div class="tab-meta-url">
      <img src="${tab.favicon}" width="16px" height="16px" />
      <span style="margin-left: 0.25em;">${tab.hostname}</span>
    </div>
    <div class="tab-meta-title">${tab.title}</div>
    <div class="tab-meta-controls" style="display: ${tab.state === undefined ? "none" : "block"};">
      <button class="control-backward" style="color: ${fgColor};">
        ${Icons.backward}
      </button>
      <button class="control-playpause" style="color: ${fgColor}; margin: 0 0.75em;">
        ${tab.state ? Icons.pause : Icons.play}
      </button>
      <button class="control-forward" style="color: ${fgColor};">
        ${Icons.forward}
      </button>
      <button class="control-mute" style="color: ${fgColor}; margin-left: 1.5em;">
        ${tab.volume === null ? Icons.muted : Icons.unmuted}
      </button>
    </div>
  </div>
  <div class="tab-thumbnail">
    <img src="${tab.thumbnail}" width="100%" height="100%" />
  </div>`;
  $.querySelector("div.tab-meta-title").onclick = () => activiate(tab.id);
  $.querySelector("button.control-playpause").onclick = () => playpause(tab.id, !tab.state);
  $.querySelector("button.control-backward").onclick = () => backward(tab.id);
  $.querySelector("button.control-forward").onclick = () => forward(tab.id);
  $.querySelector("button.control-mute").onclick = () => mute(tab.id);
  return $;
};

// eslint-disable-next-line no-unused-vars
async function activiate(tid) {
  await browser.tabs.update(tid, { active: true });
}

// eslint-disable-next-line no-unused-vars
async function playpause(tid, toggle) {
  await browser.tabs.executeScript(tid, {
    code: `var $media = $$media(); ${toggle ? "$media.play();" : "$media.pause();"}`,
  });
}

// eslint-disable-next-line no-unused-vars
async function backward(tid) {
  await browser.tabs.executeScript(tid, {
    code: "var $media = $$media(); $media.fastSeek(Math.max($media.currentTime-5, 0));",
  });
}

// eslint-disable-next-line no-unused-vars
async function forward(tid) {
  await browser.tabs.executeScript(tid, {
    code: "var $media = $$media(); $media.fastSeek($media.currentTime+5);",
  });
}

// eslint-disable-next-line no-unused-vars
async function mute(tid) {
  await browser.tabs.executeScript(tid, {
    code: "var $media = $$media(); $media.muted = !$media.muted;",
  });
}

// eslint-disable-next-line no-unused-vars
async function ADD(tab) {
  if ($main.querySelector(`div[data-tid="${tab.id}"]`) === null) $main.append($tab(tab));
}

// eslint-disable-next-line no-unused-vars
function DEL(tid) {
  $main.querySelector(`div[data-tid="${tid}"]`)?.remove();
}

// eslint-disable-next-line no-unused-vars
async function UPDATE(tab) {
  $main.querySelector(`div[data-tid="${tab.id}"]`)?.replaceWith($tab(tab));
}

(async () => {
  const background = await browser.runtime.getBackgroundPage();
  Object.values(background.__tabs__).forEach((tab) => ADD(tab));
})();

import Icons from "./icons.js";

const $main = document.querySelector("main");

const $tab = async (tab) => {
  const $ = document.createElement("div");
  $.className = "tab";
  $.dataset.tid = tab.id;

  const fgColor = (([r, g, b]) => {
    function padZero(str, len) {
      len = len || 2;
      var zeros = new Array(len).join("0");
      return (zeros + str).slice(-len);
    }
    r = (255 - r).toString(16);
    g = (255 - g).toString(16);
    b = (255 - b).toString(16);
    return "#" + padZero(r) + padZero(g) + padZero(b);
  })(tab.color);

  $.innerHTML = `
  <div class="tab-meta" style="background-color: rgba(${tab.color.join(",")}); color: ${fgColor};">
    <div class="tab-meta-info">
      <div class="tab-meta-info-url">
        <img src="${tab.favicon}" width="16px" height="16px" />
        <span>${tab.hostname}</span>
      </div>
      <div class="tab-meta-info-title">${tab.title}</div>
    </div>
    <div class="tab-meta-controls" style="display: ${tab.media === null ? "none" : "inline-flex"};">
      <button class="control-backward" style="color: ${fgColor};">
        ${Icons.backward}
      </button>
      <button class="control-playpause" style="color: ${fgColor};">
        ${tab.media?.paused ? Icons.play : Icons.pause}
      </button>
      <button class="control-forward" style="color: ${fgColor};">
        ${Icons.forward}
      </button>
      <button class="control-mute" style="color: ${fgColor};">
        ${tab.media?.muted ? Icons.muted : Icons.unmuted}
      </button>
      <button class="control-close" style="color: ${fgColor};">
        ${Icons.close}
      </button>
    </div>
  </div>
  <div class="tab-thumbnail" style="background-color: rgba(${tab.color.join(",")})">
    ${tab.thumbnail ? `<img src="${tab.thumbnail}" width="100%" height="100%" />` : ""}
  </div>`;

  $.querySelector("div.tab-meta-info-title").onclick = () => {
    browser.tabs.update(tab.id, { active: true });
    browser.windows.update(tab.wid, { focused: true });
  };
  $.querySelector("button.control-playpause").onclick = () =>
    browser.tabs.executeScript(tab.id, {
      code: `${tab.media.paused ? "window.$media.play();" : "window.$media.pause();"}`,
    });
  $.querySelector("button.control-backward").onclick = () => {
    browser.tabs.executeScript(tab.id, {
      code: "window.$media.fastSeek(Math.max(window.$media.currentTime-5, 0));",
    });
  };
  $.querySelector("button.control-forward").onclick = () => {
    browser.tabs.executeScript(tab.id, {
      code: "window.$media.fastSeek(window.$media.currentTime+5);",
    });
  };
  $.querySelector("button.control-mute").onclick = () => {
    browser.tabs.executeScript(tab.id, {
      code: "window.$media.muted = !window.$media.muted;",
    });
  };
  $.querySelector("button.control-close").onclick = () => {
    browser.tabs.remove(tab.id);
  };
  return $;
};

window["add"] = async function (tab) {
  if ($main.querySelector(`div[data-tid="${tab.id}"]`) === null) {
    $main.append(await $tab(tab));
  }
};

window["del"] = async function (tid) {
  $main.querySelector(`div[data-tid="${tid}"]`)?.remove();
};

window["update"] = async function (tab) {
  $main.querySelector(`div[data-tid="${tab.id}"]`)?.replaceWith(await $tab(tab));
};

(async () => {
  const background = await browser.runtime.getBackgroundPage();
  Array.from(background.__tabs__.values()).reverse().forEach(window["add"]);
})();

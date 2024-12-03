import Icons from "./icons.js";

let background;

const $main = document.querySelector("main");

const $tab = (tab) => {
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
      <div class="tab-meta-info-title">
        <span title="${tab.title}">${tab.title}</span>
      </div>
    </div>
    <div class="tab-meta-controls" style="visibility: ${tab.media === null ? "hidden" : "visible"};">
      <button title="Seek Backward" class="control-backward" style="color: ${fgColor};">
        ${Icons.backward}
      </button>
      <button title="${tab.media?.paused ? "Play" : "Pause"}" class="control-playpause" style="color: ${fgColor};">
        ${tab.media?.paused ? Icons.play : Icons.pause}
      </button>
      <button title="Seek Forward" class="control-forward" style="color: ${fgColor};">
        ${Icons.forward}
      </button>
      <button title="${tab.media?.muted ? "Unmute" : "Mute"}" class="control-mute" style="color: ${fgColor};">
        ${tab.media?.muted ? Icons.muted : Icons.unmuted}
      </button>
    </div>
    <div class="tab-meta-life">
      <button title="Remove from List" class="life-remove" style="color: ${fgColor};">
        ${Icons.remove}
      </button>
      <button title="Close Tab" class="life-close" style="color: ${fgColor};">
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
  $.querySelector("button.life-remove").onclick = () => {
    if (background.__tabs__.has(tab.id)) {
      background.unregister(tab.id);
    }
  };
  $.querySelector("button.life-close").onclick = () => {
    browser.tabs.remove(tab.id);
  };
  return $;
};

window["add"] = async function (tab) {
  if ($main.querySelector(`div[data-tid="${tab.id}"]`) === null) {
    $main.prepend($tab(tab));
  }
};

window["del"] = async function (tid) {
  $main.querySelector(`div[data-tid="${tid}"]`)?.remove();
};

window["update"] = async function (tab) {
  $main.querySelector(`div[data-tid="${tab.id}"]`)?.replaceWith($tab(tab));
};

(async () => {
  background = await browser.runtime.getBackgroundPage();
  Array.from(background.__tabs__.values()).reverse().forEach(window["add"]);
})();

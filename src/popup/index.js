/* global Icons */

const $main = document.querySelector("main");

const $tab = async (tab) => {
  const $ = document.createElement("div");
  $.className = "tab";
  $.dataset.tid = tab.id;

  const bgColor = await (async (src) => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    return new Promise((resolve) => {
      const image = new Image();
      image.onload = () => {
        canvas.width = image.width;
        canvas.height = image.height;
        context.drawImage(image, 0, 0, 1, 1);
        resolve(context.getImageData(0, 0, 1, 1).data);
      };
      image.src = src;
    });
  })(tab.thumbnail || tab.favicon);
  const fgColor = (0xffffff ^ ((1 << 24) | (bgColor[0] << 16) | (bgColor[1] << 8) | bgColor[2])).toString(16).slice(1);

  $.innerHTML = `
  <div class="tab-meta" style="background-color: rgba(${bgColor.join(",")}); color: #${fgColor};">
    <div class="tab-meta-url">
      <img src="${tab.favicon}" width="16px" height="16px" />
      <span style="margin-left: 0.25em;">${tab.hostname}</span>
    </div>
    <div class="tab-meta-title">${tab.title}</div>
    <div class="tab-meta-controls" style="display: ${tab.media === null ? "none" : "block"};">
      <button class="control-backward" style="color: #${fgColor};">
        ${Icons.backward}
      </button>
      <button class="control-playpause" style="color: #${fgColor}; margin: 0 0.75em;">
        ${tab.media?.paused ? Icons.play : Icons.pause}
      </button>
      <button class="control-forward" style="color: #${fgColor};">
        ${Icons.forward}
      </button>
      <button class="control-mute" style="color: #${fgColor}; margin-left: 1.5em;">
        ${tab.media?.muted ? Icons.muted : Icons.unmuted}
      </button>
    </div>
  </div>
  <div class="tab-thumbnail" style="background-color: rgba(${bgColor.join(",")})">
    ${tab.thumbnail ? `<img src="${tab.thumbnail}" width="100%" height="100%" />` : ""}
  </div>`;

  $.querySelector("div.tab-meta-title").onclick = () => {
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
  return $;
};

// eslint-disable-next-line no-unused-vars
async function add(tab) {
  if ($main.querySelector(`div[data-tid="${tab.id}"]`) === null) {
    $main.append(await $tab(tab));
  }
}

// eslint-disable-next-line no-unused-vars
async function del(tid) {
  $main.querySelector(`div[data-tid="${tid}"]`)?.remove();
}

// eslint-disable-next-line no-unused-vars
async function update(tab) {
  $main.querySelector(`div[data-tid="${tab.id}"]`)?.replaceWith(await $tab(tab));
}

(async () => {
  const background = await browser.runtime.getBackgroundPage();
  Object.values(background.__tabs__).forEach((tab) => add(tab));
})();

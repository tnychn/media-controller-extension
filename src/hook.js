(() => {
  if (window.listeners === undefined) {
    window.listeners = {};
    ["play", "pause", "volumechange"].forEach((type) => {
      if (!(type in window.listeners))
        window.listeners[type] = async () => {
          const message = { type };
          if (type === "volumechange") {
            message.volume = window.$media.muted ? null : window.$media.volume;
          }
          await browser.runtime.sendMessage(message);
        };
    });
  }

  if (window.$media === undefined) {
    window.$media = document.querySelector("[mcx-media]");
    for (const [type, listener] of Object.entries(window.listeners)) {
      window.$media.addEventListener(type, listener);
    }
    browser.runtime.onMessage.addListener((message) => {
      if (message === "@unhook") {
        const $media = document.querySelector("[mcx-media]");
        if ($media !== null) {
          for (const [type, listener] of Object.entries(window.listeners)) {
            $media.removeEventListener(type, listener);
          }
          $media.toggleAttribute("mcx-media", false);
          window.$media = undefined;
        }
      }
    });
  }
})();

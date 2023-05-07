(() => {
  let $script = document.querySelector("script#mcx-inject");
  if ($script === null) {
    window.addEventListener("hook", async () => {
      const $media = document.querySelector("[mcx-media]");
      await browser.runtime.sendMessage({
        type: "@hook",
        media: {
          paused: $media.paused,
          muted: $media.muted,
        },
      });
    });
  } else {
    $script.remove();
    $script = undefined;
  }
  $script = document.createElement("script");
  $script.id = "mcx-inject";
  $script.src = browser.runtime.getURL("media.js");
  document.head.appendChild($script);
})();

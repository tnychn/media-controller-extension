(() => {
  var s = document.createElement("script");
  s.src = browser.runtime.getURL("media.js");
  s.onload = () => s.remove();
  document.head.appendChild(s);
})();

// TODO: avoid adding duplicated event listeners by removing listener when not used anymore

// forward media events to background
window.addEventListener("MCX_hook", async () => await browser.runtime.sendMessage({ event: "@hook" }));
["play", "pause"].forEach((event) =>
  window.addEventListener(`MCX_$media_${event}`, async () => await browser.runtime.sendMessage({ event }))
);
window.addEventListener("MCX_$media_volumechange", async ({ detail: { volume } }) => {
  await browser.runtime.sendMessage({
    event: "volumechange",
    volume,
  });
});

(() => {
  // hook necessary event listeners to the media
  const hook = ($media) => {
    window.MCX_$media = $media;
    window.MCX_$media.toggleAttribute("mcx-media", true);

    window.dispatchEvent(new Event("MCX_hook"));

    // add it to DOM for easy referencing
    if (!document.contains($media)) document.body.appendChild($media);

    ["pause", "play"].forEach((event) =>
      window.MCX_$media.addEventListener(event, () => window.dispatchEvent(new CustomEvent(`MCX_$media_${event}`)))
    );
    window.MCX_$media.addEventListener("volumechange", function () {
      window.dispatchEvent(
        new CustomEvent("MCX_$media_volumechange", {
          detail: { volume: this.muted ? null : this.volume },
        })
      );
    });
  };

  if (window.MCX_$media === undefined) {
    // find and choose the most suitable onscreen media element to hook
    // TODO: improve algorithm
    const nodes = document.querySelectorAll("video,audio");
    if (nodes.length > 0) {
      for (const $media of nodes) {
        if (!$media.paused || !$media.muted || !$media.ended) {
          hook($media);
          break;
        }
      }
    } else {
      // fallback: hijack offscreen audio objects via prototype
      const originalAudioPrototype = Audio.prototype;
      ["pause", "play"].forEach((method) => {
        const originalMethod = Audio.prototype[method];
        Audio.prototype[method] = function () {
          window.dispatchEvent(new CustomEvent(`MCX_$media_${method}`));
          hook(this);
          Audio.prototype = originalAudioPrototype;
          return originalMethod.apply(this, arguments);
        };
      });
    }
  }

  window.addEventListener("MCX_unhook", () => {
    window.MCX_$media.toggleAttribute("mcx-media", false);
    window.MCX_$media = undefined;
  });
})();

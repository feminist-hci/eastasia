// Main JS for feminist-hci site

document.addEventListener("DOMContentLoaded", () => {
  // AnchorJS: add link icons to headings (if the library is loaded)
  if (window.anchors && typeof window.anchors.add === "function") {
    window.anchors.add();
  }

  initMeetupGalleryLightbox();
  initMeetupGalleryHoverPreview();
  initSummaryThemeTransitions();
});

function initSummaryThemeTransitions() {
  const themes = document.querySelectorAll(".summary-theme");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduceMotion || !themes.length) {
    return;
  }

  themes.forEach((theme) => {
    const content = theme.querySelector(".summary-theme__content");
    if (!content) return;

    theme.addEventListener("toggle", () => {
      content.style.overflow = "hidden";
      content.style.transition = "height 420ms cubic-bezier(0.22, 1, 0.36, 1), opacity 320ms ease, transform 420ms cubic-bezier(0.22, 1, 0.36, 1)";

      if (theme.open) {
        content.style.setProperty("display", "block", "important");
        content.style.height = "0px";
        content.style.opacity = "0";
        content.style.transform = "translateY(-8px)";
        void content.offsetHeight;

        requestAnimationFrame(() => {
          content.style.height = `${content.scrollHeight}px`;
          content.style.opacity = "1";
          content.style.transform = "translateY(0)";
        });
      } else {
        content.style.setProperty("display", "block", "important");
        content.style.height = `${content.scrollHeight}px`;
        content.style.opacity = "1";
        content.style.transform = "translateY(0)";
        void content.offsetHeight;

        requestAnimationFrame(() => {
          content.style.height = "0px";
          content.style.opacity = "0";
          content.style.transform = "translateY(-8px)";
        });
      }

      const finishTransition = (event) => {
        if (event.propertyName !== "height") return;

        if (theme.open) {
          content.style.height = "auto";
        } else {
          content.style.removeProperty("display");
          content.style.height = "";
        }
        content.style.overflow = "";
        content.style.transition = "";
        content.style.opacity = "";
        content.style.transform = "";
        content.removeEventListener("transitionend", finishTransition);
      };

      content.addEventListener("transitionend", finishTransition);
    });
  });
}
function initMeetupGalleryLightbox() {
  const lightbox = document.getElementById("gallery-lightbox");
  const lightboxImg = document.getElementById("gallery-lightbox-img");
  const lightboxCaption = document.getElementById("gallery-lightbox-caption");
  const triggers = document.querySelectorAll(".meetup-gallery__trigger");

  if (!lightbox || !lightboxImg || !lightboxCaption || !triggers.length) {
    return;
  }

  const backdrop = lightbox.querySelector(".gallery-lightbox__backdrop");
  const closeBtn = lightbox.querySelector(".gallery-lightbox__close");
  let lastFocused = null;

  function openLightbox(trigger) {
    const img = trigger.querySelector("img");
    if (!img) return;

    lastFocused = document.activeElement;
    lightboxImg.src = img.currentSrc || img.src;
    lightboxImg.alt = img.alt || "";
    lightboxCaption.textContent = trigger.getAttribute("data-caption") || img.alt || "";

    lightbox.hidden = false;
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    closeBtn.focus();
  }

  function closeLightbox() {
    lightbox.hidden = true;
    lightbox.setAttribute("aria-hidden", "true");
    lightboxImg.src = "";
    document.body.style.overflow = "";
    if (lastFocused && typeof lastFocused.focus === "function") {
      lastFocused.focus();
    }
  }

  triggers.forEach((trigger) => {
    trigger.addEventListener("click", () => openLightbox(trigger));
  });

  backdrop.addEventListener("click", closeLightbox);
  closeBtn.addEventListener("click", closeLightbox);

  document.addEventListener("keydown", (event) => {
    if (lightbox.hidden) return;
    if (event.key === "Escape") {
      closeLightbox();
    }
  });
}

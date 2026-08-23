export const BOOK_MODEL_PATH = "/models/broscience-book.glb?v=16";
export const LOGO_PATH = "/brand/logo.png";
export const BOOK_PREVIEW_PATH = "/models/previews/broscience-book-preview.png";

const CRITICAL_IMAGES = [LOGO_PATH, BOOK_PREVIEW_PATH];

function notifyBookReady() {
  if (typeof window === "undefined") return;
  window.__bsBookReady = true;
  window.dispatchEvent(new CustomEvent("bs-book-ready"));
}

export function markBookReady() {
  notifyBookReady();
}

export function isBookReady() {
  return typeof window !== "undefined" && window.__bsBookReady === true;
}

export function onBookReady(callback) {
  if (isBookReady()) {
    callback();
    return () => {};
  }
  const handler = () => callback();
  window.addEventListener("bs-book-ready", handler, { once: true });
  return () => window.removeEventListener("bs-book-ready", handler);
}

async function loadImage(src) {
  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () => resolve(true);
    image.onerror = () => resolve(false);
    image.src = src;
  });
}

export function startAssetPreload(onProgress) {
  const weights = {
    fonts: 0.35,
    images: 0.45,
    document: 0.2,
  };

  const scores = {
    fonts: 0,
    images: 0,
    document: document.readyState === "complete" ? 1 : 0.4,
  };

  const emit = () => {
    const value =
      scores.fonts * weights.fonts +
      scores.images * weights.images +
      scores.document * weights.document;
    onProgress(Math.min(0.99, value));
  };

  emit();

  const fonts = document.fonts?.ready
    ? document.fonts.ready.then(() => {
        scores.fonts = 1;
        emit();
      })
    : Promise.resolve().then(() => {
        scores.fonts = 1;
        emit();
      });

  const images = Promise.all(CRITICAL_IMAGES.map(loadImage)).then(() => {
    scores.images = 1;
    emit();
  });

  const onReady = () => {
    scores.document = 1;
    emit();
  };
  if (document.readyState === "complete") onReady();
  else window.addEventListener("load", onReady, { once: true });

  return Promise.all([fonts, images]).then(() => {
    scores.fonts = 1;
    scores.images = 1;
    scores.document = 1;
    onProgress(1);
    return true;
  });
}

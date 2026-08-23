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

async function loadBinary(url, onChunk) {
  try {
    const response = await fetch(url, { cache: "force-cache" });
    if (!response.ok) return false;
    if (!response.body) {
      await response.arrayBuffer();
      onChunk?.(1);
      return true;
    }

    const total = Number(response.headers.get("content-length")) || 0;
    const reader = response.body.getReader();
    let received = 0;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      received += value?.byteLength ?? 0;
      if (total > 0) onChunk?.(Math.min(1, received / total));
      else onChunk?.(Math.min(0.92, received / 8_000_000));
    }

    onChunk?.(1);
    return true;
  } catch {
    onChunk?.(1);
    return false;
  }
}

export function startAssetPreload(onProgress) {
  const weights = {
    fonts: 0.12,
    images: 0.16,
    book: 0.62,
    document: 0.1,
  };

  const scores = {
    fonts: 0,
    images: 0,
    book: 0,
    document: document.readyState === "complete" ? 1 : 0.4,
  };

  const emit = () => {
    const value =
      scores.fonts * weights.fonts +
      scores.images * weights.images +
      scores.book * weights.book +
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

  const book = loadBinary(BOOK_MODEL_PATH, (ratio) => {
    scores.book = Math.max(scores.book, ratio);
    emit();
  }).then((ok) => {
    if (ok) markBookReady();
    return ok;
  });

  const onReady = () => {
    scores.document = 1;
    emit();
  };
  if (document.readyState === "complete") onReady();
  else window.addEventListener("load", onReady, { once: true });

  import("@react-three/drei")
    .then(({ useGLTF }) => {
      useGLTF.preload(BOOK_MODEL_PATH);
    })
    .catch(() => {});

  return Promise.all([fonts, images, book]).then(() => {
    scores.fonts = 1;
    scores.images = 1;
    scores.book = Math.max(scores.book, 1);
    scores.document = 1;
    onProgress(1);
    return true;
  });
}

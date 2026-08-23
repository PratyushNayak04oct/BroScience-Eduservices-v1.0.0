const SESSION_KEY = "bs-intro-complete";

export function hasSeenIntro() {
  if (typeof window === "undefined") return false;
  try {
    return sessionStorage.getItem(SESSION_KEY) === "1";
  } catch {
    return false;
  }
}

export function markIntroSeen() {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(SESSION_KEY, "1");
  } catch {
    /* private mode */
  }
}

export function getLoaderMode() {
  if (typeof window === "undefined") return "cinematic";
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return "reduced";
  return "cinematic";
}

function pathMatches(expectedPath) {
  if (!expectedPath) return true;
  return window.location.pathname === expectedPath;
}

function hasRealPage(expectedPath) {
  const page = document.querySelector("[data-page]");
  if (!page) return false;
  if (expectedPath && page.getAttribute("data-page") !== expectedPath) return false;
  if (page.querySelector("[data-skeleton]")) return false;
  return Boolean(page.querySelector("h1, h2"));
}

export function waitForRouteReady(expectedPath, { timeout = 8000 } = {}) {
  return new Promise((resolve) => {
    let settled = false;

    const finish = () => {
      if (settled) return;
      settled = true;
      window.clearInterval(poll);
      window.clearTimeout(limit);
      resolve();
    };

    const limit = window.setTimeout(finish, timeout);

    const poll = window.setInterval(() => {
      if (!pathMatches(expectedPath) || !hasRealPage(expectedPath)) return;
      window.clearInterval(poll);
      requestAnimationFrame(() => {
        requestAnimationFrame(finish);
      });
    }, 40);
  });
}

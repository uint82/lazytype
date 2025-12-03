export const updateFavicon = () => {
  const bgPrimary = getComputedStyle(document.documentElement)
    .getPropertyValue("--bg-primary")
    .trim();
  const primary = getComputedStyle(document.documentElement)
    .getPropertyValue("--primary")
    .trim();

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <rect width="100" height="100" fill="${bgPrimary}" rx="20"/>
      <text x="50" y="72" font-size="70" text-anchor="middle"
            fill="${primary}" font-family="monospace">lt</text>
    </svg>
  `;

  const favicon = document.querySelector("link[rel='icon']");
  if (favicon) {
    favicon.href = `data:image/svg+xml,${encodeURIComponent(svg)}`;
  }

  const themeColorMeta = document.querySelector("meta[name='theme-color']");
  if (themeColorMeta) {
    themeColorMeta.content = bgPrimary;
  }
};

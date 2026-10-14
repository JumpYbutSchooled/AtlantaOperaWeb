// For the smaller pages: the light / dark switch and the header shadow.
(() => {
  const themeBtn = document.getElementById("theme-toggle");
  const darkNow = () =>
    document.documentElement.dataset.theme
      ? document.documentElement.dataset.theme === "dark"
      : matchMedia("(prefers-color-scheme: dark)").matches;
  const labelTheme = () => themeBtn.setAttribute("aria-label", darkNow() ? "Switch to light mode" : "Switch to dark mode");
  themeBtn.addEventListener("click", () => {
    const next = darkNow() ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {}
    labelTheme();
  });
  labelTheme();

  // Listings with a deadline (data-until="YYYY-MM-DD") disappear the day after it.
  const now = new Date();
  document.querySelectorAll("[data-until]").forEach((el) => {
    if (now > new Date(`${el.dataset.until}T23:59:59`)) el.remove();
  });

  const header = document.getElementById("site-header");
  const onScroll = () => header.classList.toggle("scrolled", scrollY > 8);
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();
})();

// On small screens the menu folds into a button in the header.
(() => {
  const header = document.getElementById("site-header");
  const btn = document.getElementById("menu-toggle");
  const nav = document.getElementById("main-nav");
  const isOpen = () => header.classList.contains("menu-open");
  const set = (open) => {
    header.classList.toggle("menu-open", open);
    btn.setAttribute("aria-expanded", open);
    btn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  };
  btn.addEventListener("click", () => set(!isOpen()));
  nav.addEventListener("click", (e) => {
    if (e.target.closest("a")) set(false);
  });
  document.addEventListener("click", (e) => {
    if (isOpen() && !header.contains(e.target)) set(false);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isOpen()) {
      set(false);
      btn.focus();
    }
  });
  matchMedia("(min-width: 901px)").addEventListener("change", () => set(false));
})();

(() => {
  const people = window.PEOPLE || [];

  // Group order comes from GROUPS; any group used in PEOPLE but missing there goes at the end.
  const groups = [...(window.GROUPS || [])];
  for (const p of people) if (!groups.includes(p.group)) groups.push(p.group);

  const directory = document.getElementById("directory");
  const search = document.getElementById("search");
  const filters = document.getElementById("filters");
  const empty = document.getElementById("empty");
  const dialog = document.getElementById("person-dialog");

  let activeGroup = "All";

  const escape = (s) =>
    String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

  const SILHOUETTE =
    '<svg viewBox="0 0 80 100" aria-hidden="true"><circle cx="40" cy="38" r="16"/><path d="M8 100c0-20 14-34 32-34s32 14 32 34z"/></svg>';

  const portraitHtml = (p) =>
    p.photo ? `<img src="${escape(p.photo)}" alt="Photo of ${escape(p.name)}" loading="lazy">` : SILHOUETTE;

  // A photo path that doesn't load falls back to the placeholder silhouette.
  document.addEventListener(
    "error",
    (e) => {
      if (e.target.tagName === "IMG" && e.target.closest(".portrait")) e.target.outerHTML = SILHOUETTE;
    },
    true
  );

  function renderFilters() {
    const used = groups.filter((g) => people.some((p) => p.group === g));
    filters.innerHTML = ["All", ...used]
      .map((g) => `<button type="button" data-group="${escape(g)}" aria-pressed="${g === activeGroup}">${escape(g)}</button>`)
      .join("");
  }

  function render() {
    const q = search.value.trim().toLowerCase();
    const matches = people.filter(
      (p) =>
        (activeGroup === "All" || p.group === activeGroup) &&
        (!q || `${p.name} ${p.role} ${p.group}`.toLowerCase().includes(q))
    );

    directory.innerHTML = groups
      .map((g) => {
        const members = matches.filter((p) => p.group === g);
        if (!members.length) return "";
        const cards = members
          .map(
            (p) => `
            <li>
              <button type="button" class="card" data-id="${escape(p.id)}">
                <div class="portrait">${portraitHtml(p)}</div>
                <span class="name">${escape(p.name)}</span>
                <span class="role">${escape(p.role)}</span>
              </button>
            </li>`
          )
          .join("");
        const intro = (!q && (window.GROUP_INTROS || {})[g]) || null;
        const introHtml = intro
          ? `<figure class="group-intro">
              ${intro.photo ? `<img src="${escape(intro.photo)}" alt="The ${escape(g)}" loading="lazy">` : ""}
              ${intro.note ? `<figcaption>${escape(intro.note)}</figcaption>` : ""}
            </figure>`
          : "";
        return `<section class="group"><h3>${escape(g)}</h3>${introHtml}<ul class="grid">${cards}</ul></section>`;
      })
      .join("");

    empty.hidden = matches.length > 0;
  }

  function openPerson(id) {
    const p = people.find((x) => x.id === id);
    if (!p) return;
    document.getElementById("dialog-portrait").innerHTML = portraitHtml(p);
    document.getElementById("dialog-group").textContent = p.group;
    document.getElementById("dialog-name").textContent = p.name;
    document.getElementById("dialog-role").textContent = p.role;
    document.getElementById("dialog-bio").innerHTML = String(p.bio || "Bio coming soon.")
      .split(/\n\s*\n/)
      .map((para) => `<p>${escape(para.trim())}</p>`)
      .join("");
    if (location.hash !== `#${id}`) history.replaceState(null, "", `#${id}`);
    if (!dialog.open) dialog.showModal();
  }

  filters.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-group]");
    if (!btn) return;
    activeGroup = btn.dataset.group;
    renderFilters();
    render();
  });

  search.addEventListener("input", render);

  directory.addEventListener("click", (e) => {
    const card = e.target.closest(".card");
    if (card) openPerson(card.dataset.id);
  });

  // Clicking the dark area outside the dialog closes it.
  dialog.addEventListener("click", (e) => {
    if (e.target === dialog) dialog.close();
  });

  dialog.addEventListener("close", () => {
    history.replaceState(null, "", location.pathname + location.search);
  });

  // Links like yoursite.com/#person-id open that person directly.
  const openFromHash = () => openPerson(decodeURIComponent(location.hash.slice(1)));
  window.addEventListener("hashchange", openFromHash);

  document.getElementById("year").textContent = new Date().getFullYear();
  renderFilters();
  render();
  openFromHash();
})();

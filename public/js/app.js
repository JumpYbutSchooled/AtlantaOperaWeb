(() => {
  const PEOPLE = window.PEOPLE || {};
  const TREE = window.TREE;

  const treeEl = document.getElementById("tree");
  const scroller = document.getElementById("tree-scroll");
  const openAll = document.getElementById("open-all");
  const intro = document.getElementById("intro");
  const dirEl = document.getElementById("directory");
  const filtersEl = document.getElementById("filters");
  const search = document.getElementById("search");
  const resultCount = document.getElementById("result-count");
  const empty = document.getElementById("empty");
  const dialog = document.getElementById("dialog");
  const dialogBody = document.getElementById("dialog-body");

  const escape = (s) =>
    String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

  // ── Prepare the tree: give every branch a key, a parent, and its set of people ──
  const branches = new Map(); // key -> branch
  const places = {}; // person id -> [{ branch, role }]

  (function prep(node, parent) {
    node.key = `b${branches.size}`;
    node.parent = parent;
    node.ids = new Set();
    branches.set(node.key, node);
    node.kids = (node.children || [])
      .map((c) => {
        if (typeof c === "string") c = { id: c };
        if (c.label) {
          prep(c, node);
          c.ids.forEach((id) => node.ids.add(id));
          return c;
        }
        const p = PEOPLE[c.id];
        if (!p) {
          console.warn("TREE mentions an unknown person:", c.id);
          return null;
        }
        const role = c.role || p.role;
        (places[c.id] ||= []).push({ branch: node, role });
        node.ids.add(c.id);
        return { id: c.id, role };
      })
      .filter(Boolean);
    node.isStack = node.kids.length > 0 && node.kids.every((k) => !k.label);
  })(TREE, null);

  const pathOf = (branch) => {
    const labels = [];
    for (let b = branch; b && b.parent; b = b.parent) labels.unshift(b.label);
    return labels;
  };

  // ── State ──
  let open = new Set([TREE.key]);
  let query = "";
  let view = "tree"; // or "directory"
  let dept = "all"; // directory filter: "all" or a department's branch key
  try {
    if (localStorage.getItem("view") === "directory") view = "directory";
  } catch {}

  function setView(v) {
    view = v;
    try {
      localStorage.setItem("view", v);
    } catch {}
    update();
  }

  // Show the current view and draw it.
  function update() {
    const isTree = view === "tree";
    intro.textContent = isTree
      ? "Pick a group to see who’s in it, then pick a name to learn more."
      : "Everyone in the company, sorted by last name. Pick a name to learn more.";
    document.querySelectorAll("[data-view]").forEach((b) => b.setAttribute("aria-pressed", b.dataset.view === view));
    scroller.hidden = !isTree;
    openAll.hidden = !isTree;
    filtersEl.hidden = isTree;
    dirEl.hidden = isTree;
    if (isTree) render();
    else renderDirectory();
  }

  // Opening a branch closes its siblings that have branches of their own, so the tree stays readable.
  function toggle(key) {
    const node = branches.get(key);
    if (open.has(key)) {
      closeDown(node);
    } else {
      if (node.parent && !node.isStack) {
        for (const sib of node.parent.kids) if (sib.label && sib !== node && !sib.isStack) closeDown(sib);
      }
      open.add(key);
    }
    render();
    focusBranch(key);
  }

  function closeDown(node) {
    open.delete(node.key);
    for (const k of node.kids) if (k.label) closeDown(k);
  }

  function reveal(id) {
    const place = places[id]?.[0];
    if (!place) return;
    open = new Set();
    for (let b = place.branch; b; b = b.parent) open.add(b.key);
    if (query) search.value = query = "";
    if (view === "tree") render();
    else setView("tree");
    const card = treeEl.querySelector(`.person[data-id="${CSS.escape(id)}"]`);
    if (card) card.scrollIntoView({ block: "nearest", inline: "center" });
  }

  // ── Search ──
  const personMatches = (id, role) => {
    const p = PEOPLE[id];
    return `${p.name} ${p.role} ${role}`.toLowerCase().includes(query);
  };
  const branchMatches = (node) =>
    node.label.toLowerCase().includes(query) ||
    node.kids.some((k) => (k.label ? branchMatches(k) : personMatches(k.id, k.role)));

  // ── Rendering ──
  const initials = (name) => {
    const words = name.replace(/\b(Dr\.|The Very Reverend|Jr\.|IV)\b|,/g, "").trim().split(/\s+/);
    return (words[0][0] + (words.length > 1 ? words[words.length - 1][0] : "")).toUpperCase();
  };

  const avatar = (p, cls = "avatar") =>
    p.photo
      ? `<span class="${cls}"><img src="${escape(p.photo)}" alt="" loading="lazy"></span>`
      : `<span class="${cls} initials" aria-hidden="true">${escape(initials(p.name))}</span>`;

  const plural = (n) => `${n} ${n === 1 ? "person" : "people"}`;
  const found = (n) => `${plural(n)} found`;

  function personHtml(k, inMatchedBranch) {
    if (query && !inMatchedBranch && !personMatches(k.id, k.role)) return "";
    const p = PEOPLE[k.id];
    const hit = query && personMatches(k.id, k.role) ? " hit" : "";
    return `<li class="leaf"><button type="button" class="person${hit}" data-id="${escape(k.id)}">
        ${avatar(p)}
        <span class="person-text"><span class="person-name">${escape(p.name)}</span><span class="person-role">${escape(k.role)}</span></span>
      </button></li>`;
  }

  function branchHtml(node, depth, inMatchedBranch = false) {
    const labelHit = query && node.label.toLowerCase().includes(query);
    const showAll = inMatchedBranch || labelHit;
    if (query && !showAll && !branchMatches(node)) return "";
    const isOpen = query ? true : open.has(node.key);
    const kids = isOpen
      ? node.kids.map((k) => (k.label ? branchHtml(k, depth + 1, showAll) : personHtml(k, showAll))).join("")
      : "";
    const info = node.note || node.photo
      ? `<button type="button" class="branch-info" data-info="${node.key}" aria-label="About ${escape(node.label)}">About</button>`
      : "";

    let box;
    if (depth === 0) {
      box = `<div class="node root-node"><span class="root-title">${escape(node.label)}</span><span class="root-sub">Founded 1979 · Atlanta, Georgia</span></div>`;
    } else {
      box = `<div class="node branch-node depth-${Math.min(depth, 3)}${isOpen ? " is-open" : ""}" data-key="${node.key}">
          <button type="button" class="branch-toggle" data-toggle="${node.key}" aria-expanded="${isOpen}">
            <span class="branch-label">${labelHit ? "<mark>" + escape(node.label) + "</mark>" : escape(node.label)}</span>
            <span class="branch-count">${plural(node.ids.size)}</span>
          </button>${info}
        </div>`;
    }
    const list = kids ? `<ul class="${node.isStack ? "stack" : "row"}">${kids}</ul>` : "";
    return `<li class="branch">${box}${list}</li>`;
  }

  function render() {
    treeEl.innerHTML = `<ul class="row">${branchHtml(TREE, 0)}</ul>`;
    if (query) {
      const n = new Set([...treeEl.querySelectorAll(".person.hit")].map((b) => b.dataset.id)).size;
      resultCount.textContent = n ? found(n) : "";
      empty.hidden = n > 0 || treeEl.querySelector("mark") !== null;
    } else {
      resultCount.textContent = "";
      empty.hidden = true;
    }
    // Searching opens every group with a match, so the button only matters when not searching.
    openAll.hidden = Boolean(query);
    openAll.textContent = open.size > 1 ? "Close all" : "Open all";
  }

  // ── Directory: everyone at once, by department, A–Z by surname ──
  const depts = TREE.kids.filter((k) => k.label);

  const surname = (name) => {
    const words = name.replace(/,|\b(Dr\.|Jr\.|Sr\.|II|III|IV)(?=\s|$)/g, "").trim().split(/\s+/);
    return words[words.length - 1];
  };
  const byName = (a, b) =>
    surname(a.p.name).localeCompare(surname(b.p.name), undefined, { sensitivity: "base" }) ||
    a.p.name.localeCompare(b.p.name);

  // Where someone sits, in words: "Strings", "Past Studio Artists (2025-26, 2024-25)".
  // Group names their role already says ("Soprano", "Members" for a Board Member) are left out.
  const describeGroups = (paths, role) => {
    const said = (label) => role.toLowerCase().includes(label.toLowerCase().replace(/s$/, ""));
    const byPrefix = new Map();
    for (const path of paths) {
      if (!path.length) continue;
      const prefix = path.slice(0, -1).join(", ");
      const last = path[path.length - 1];
      if (!byPrefix.has(prefix)) byPrefix.set(prefix, []);
      if (!said(last)) byPrefix.get(prefix).push(last);
    }
    return [...byPrefix]
      .map(([prefix, lasts]) => {
        if (!prefix) return lasts.join(", ");
        return lasts.length ? `${prefix} (${lasts.join(", ")})` : prefix;
      })
      .filter(Boolean)
      .join(" · ");
  };

  const isUnder = (branch, dept) => {
    for (let b = branch; b; b = b.parent) if (b === dept) return true;
    return false;
  };

  const directory = depts.map((d) => ({
    dept: d,
    list: [...d.ids]
      .map((id) => {
        const p = PEOPLE[id];
        const mine = places[id].filter((w) => isUnder(w.branch, d));
        const role = p.role;
        const affiliation = (p.details || []).find(([k]) => k === "Affiliation")?.[1] || "";
        const group = describeGroups(mine.map((w) => pathOf(w.branch).slice(1)), role) || affiliation;
        return { id, p, role, group, text: `${p.name} ${role} ${group} ${affiliation}`.toLowerCase() };
      })
      .sort(byName),
  }));

  function renderDirectory() {
    filtersEl.innerHTML = [["all", "All", TREE.ids.size], ...depts.map((d) => [d.key, d.label, d.ids.size])]
      .map(
        ([key, label, n]) =>
          `<button type="button" data-dept="${key}" aria-pressed="${key === dept}">${escape(label)}<span>${n}</span></button>`
      )
      .join("");

    const groups = directory
      .filter((g) => dept === "all" || g.dept.key === dept)
      .map((g) => ({ ...g, list: query ? g.list.filter((x) => x.text.includes(query)) : g.list }))
      .filter((g) => g.list.length);

    dirEl.innerHTML = groups
      .map(
        (g) => `<section class="dir-group" aria-label="${escape(g.dept.label)}">
          <h3>${escape(g.dept.label)}<span>${plural(g.list.length)}</span></h3>
          <ul class="dir-grid">${g.list
            .map(
              (x) => `<li><button type="button" class="person" data-id="${escape(x.id)}">
                ${avatar(x.p)}
                <span class="person-text">
                  <span class="person-name">${escape(x.p.name)}</span>
                  <span class="person-role">${escape(x.role)}</span>
                  ${x.group ? `<span class="person-group">${escape(x.group)}</span>` : ""}
                </span>
              </button></li>`
            )
            .join("")}</ul>
        </section>`
      )
      .join("");

    const n = new Set(groups.flatMap((g) => g.list.map((x) => x.id))).size;
    resultCount.textContent = query ? found(n) : "";
    empty.hidden = n > 0;
  }

  function focusBranch(key) {
    const el = treeEl.querySelector(`.branch-node[data-key="${key}"]`);
    if (!el) return;
    el.querySelector(".branch-toggle").focus({ preventScroll: true });
    el.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
  }

  // ── Dialog ──
  const paragraphs = (text) =>
    String(text || "")
      .split(/\n\s*\n/)
      .filter((t) => t.trim())
      .map((t) => `<p>${escape(t.trim())}</p>`)
      .join("");

  function openPerson(id) {
    const p = PEOPLE[id];
    if (!p) return;
    const where = places[id] || [];
    const details = (p.details || [])
      .map(([k, v]) => `<div><dt>${escape(k)}</dt><dd>${escape(v)}</dd></div>`)
      .join("");
    const placesHtml =
      where.length > 1
        ? `<div><dt>Where you’ll find them</dt><dd><ul class="places">${where
            .map((w) => `<li>${escape(pathOf(w.branch).join(", "))}${w.role === p.role ? "" : ` — ${escape(w.role)}`}</li>`)
            .join("")}</ul></dd></div>`
        : "";
    const link = p.link
      ? `<p class="dialog-link"><a href="${escape(p.link)}" target="_blank" rel="noopener">Visit their website ↗</a></p>`
      : "";

    dialogBody.className = `dialog-body${p.photo ? "" : " no-photo"}`;
    dialogBody.innerHTML = `
      ${p.photo ? `<div class="dialog-portrait"><img src="${escape(p.photo)}" alt="Photo of ${escape(p.name)}"></div>` : ""}
      <div class="dialog-info">
        <p class="eyebrow">${escape(where[0] ? pathOf(where[0].branch)[0] : "")}</p>
        <h2 id="dialog-title">${escape(p.name)}</h2>
        <p class="dialog-role">${escape(p.role)}</p>
        ${details || placesHtml ? `<dl class="dialog-details">${details}${placesHtml}</dl>` : ""}
        <div class="dialog-bio">${paragraphs(p.bio)}</div>
        ${link}
        <p class="dialog-tree-link"><button type="button" data-reveal="${escape(id)}">Find them in the family tree</button></p>
      </div>`;
    if (location.hash !== `#${id}`) history.replaceState(null, "", `#${id}`);
    if (!dialog.open) dialog.showModal();
  }

  function openBranchInfo(key) {
    const b = branches.get(key);
    dialogBody.className = "dialog-body branch-dialog";
    dialogBody.innerHTML = `
      ${b.photo ? `<div class="dialog-banner"><img src="${escape(b.photo)}" alt="The Atlanta Opera ${escape(b.label)}"></div>` : ""}
      <div class="dialog-info">
        <p class="eyebrow">${escape(plural(b.ids.size))}</p>
        <h2 id="dialog-title">${escape(b.label)}</h2>
        <div class="dialog-bio">${(b.note || []).map((t) => `<p>${escape(t)}</p>`).join("")}</div>
      </div>`;
    if (!dialog.open) dialog.showModal();
  }

  // A photo that doesn't load falls back to initials.
  document.addEventListener(
    "error",
    (e) => {
      const img = e.target;
      if (img.tagName !== "IMG") return;
      const holder = img.closest(".avatar, .dialog-portrait");
      if (!holder) return;
      if (holder.classList.contains("dialog-portrait")) {
        holder.remove();
        dialogBody.classList.add("no-photo");
        return;
      }
      const name = holder.closest(".person")?.querySelector(".person-name")?.textContent || "";
      holder.classList.add("initials");
      holder.textContent = initials(name);
    },
    true
  );

  // ── Events ──
  treeEl.addEventListener("click", (e) => {
    const t = e.target.closest("[data-toggle], [data-info], .person");
    if (!t) return;
    if (t.dataset.toggle) toggle(t.dataset.toggle);
    else if (t.dataset.info) openBranchInfo(t.dataset.info);
    else openPerson(t.dataset.id);
  });

  dialog.addEventListener("click", (e) => {
    if (e.target === dialog) dialog.close();
    const r = e.target.closest("[data-reveal]");
    if (r) {
      dialog.close();
      reveal(r.dataset.reveal);
      document.getElementById("family-tree").scrollIntoView({ behavior: "smooth" });
    }
  });

  dialog.addEventListener("close", () => {
    if (location.hash) history.replaceState(null, "", location.pathname + location.search);
  });

  dirEl.addEventListener("click", (e) => {
    const t = e.target.closest(".person");
    if (t) openPerson(t.dataset.id);
  });

  filtersEl.addEventListener("click", (e) => {
    const t = e.target.closest("[data-dept]");
    if (!t) return;
    dept = t.dataset.dept;
    renderDirectory();
  });

  document.querySelectorAll("[data-view]").forEach((b) => b.addEventListener("click", () => setView(b.dataset.view)));

  // Header and hero links that jump to a particular view.
  document.querySelectorAll("[data-show-view]").forEach((a) =>
    a.addEventListener("click", () => {
      if (view !== a.dataset.showView) setView(a.dataset.showView);
    })
  );

  search.addEventListener("input", () => {
    query = search.value.trim().toLowerCase();
    update();
  });

  openAll.addEventListener("click", () => {
    open = open.size > 1 ? new Set([TREE.key]) : new Set(branches.keys());
    render();
  });

  // Links like yoursite.com/#person-id open that person directly.
  const openFromHash = () => {
    const id = decodeURIComponent(location.hash.slice(1));
    if (PEOPLE[id]) {
      reveal(id);
      openPerson(id);
    }
  };
  window.addEventListener("hashchange", openFromHash);

  document.getElementById("year").textContent = new Date().getFullYear();
  query = search.value.trim().toLowerCase(); // browsers can restore the box's text on Back
  update();
  openFromHash();
})();

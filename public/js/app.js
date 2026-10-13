(() => {
  const PEOPLE = window.PEOPLE || {};
  const TREE = window.TREE;

  const treeEl = document.getElementById("tree");
  const scroller = document.getElementById("tree-scroll");
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
    render();
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
      const n = treeEl.querySelectorAll(".person.hit").length;
      resultCount.textContent = n ? `${n} ${n === 1 ? "match" : "matches"}` : "";
      empty.hidden = n > 0 || treeEl.querySelector("mark") !== null;
    } else {
      resultCount.textContent = "";
      empty.hidden = true;
    }
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
        ? `<div><dt>In the family tree</dt><dd><ul class="places">${where
            .map((w) => `<li>${escape(pathOf(w.branch).join(" › "))} — ${escape(w.role)}</li>`)
            .join("")}</ul></dd></div>`
        : "";
    const link = p.link
      ? `<p class="dialog-link"><a href="${escape(p.link)}" target="_blank" rel="noopener">Visit website ↗</a></p>`
      : "";

    dialogBody.className = `dialog-body${p.photo ? "" : " no-photo"}`;
    dialogBody.innerHTML = `
      ${p.photo ? `<div class="dialog-portrait"><img src="${escape(p.photo)}" alt="Photo of ${escape(p.name)}"></div>` : ""}
      <div class="dialog-info">
        <p class="eyebrow">${escape(where[0] ? pathOf(where[0].branch).join(" › ") : "")}</p>
        <h2 id="dialog-title">${escape(p.name)}</h2>
        <p class="dialog-role">${escape(p.role)}</p>
        ${details || placesHtml ? `<dl class="dialog-details">${details}${placesHtml}</dl>` : ""}
        <div class="dialog-bio">${paragraphs(p.bio)}</div>
        ${link}
        <p class="dialog-tree-link"><button type="button" data-reveal="${escape(id)}">Show in family tree</button></p>
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

  search.addEventListener("input", () => {
    query = search.value.trim().toLowerCase();
    render();
  });

  document.getElementById("expand-all").addEventListener("click", () => {
    open = new Set(branches.keys());
    render();
  });
  document.getElementById("collapse-all").addEventListener("click", () => {
    open = new Set([TREE.key]);
    render();
  });

  // Drag the tree sideways with the mouse when it's wider than the screen.
  let drag = null;
  scroller.addEventListener("pointerdown", (e) => {
    if (e.pointerType !== "mouse" || e.target.closest("button, a, input")) return;
    drag = { x: e.clientX, left: scroller.scrollLeft };
    scroller.classList.add("dragging");
  });
  window.addEventListener("pointermove", (e) => {
    if (drag) scroller.scrollLeft = drag.left - (e.clientX - drag.x);
  });
  window.addEventListener("pointerup", () => {
    drag = null;
    scroller.classList.remove("dragging");
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
  render();
  openFromHash();
})();

(() => {
  const PEOPLE = window.PEOPLE || {};
  const TREE = window.TREE;

  const $ = (id) => document.getElementById(id);
  const treeEl = $("tree");
  const scroller = $("tree-scroll");
  const openAll = $("open-all");
  const intro = $("intro");
  const dirEl = $("directory");
  const filtersEl = $("filters");
  const search = $("search");
  const resultCount = $("result-count");
  const empty = $("empty");
  const dialog = $("dialog");
  const dialogBody = $("dialog-body");
  const dialogNav = $("dialog-nav");
  const prevBtn = $("prev");
  const nextBtn = $("next");
  const step = $("step");

  document.documentElement.classList.add("js");

  const escape = (s) =>
    String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

  // Lower case without accents, so "ivan lopez" finds "Iván López".
  const fold = (s) => String(s).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

  // Give every branch a key, a parent and the set of people under it,
  // and note every place each person appears.
  const branches = new Map();
  const places = {};

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
          console.warn("Unknown person in TREE:", c.id);
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

  const depts = TREE.kids.filter((k) => k.label);

  // Each person's department number (for the colour behind their initials) and
  // everything they can be searched by besides their name.
  const deptOf = {};
  const searchText = {};
  for (const [id, list] of Object.entries(places)) {
    const top = pathOf(list[0].branch)[0];
    deptOf[id] = depts.findIndex((d) => d.label === top) + 1;
    searchText[id] = fold(
      [PEOPLE[id].role, ...list.map((w) => `${w.role} ${pathOf(w.branch).join(" ")}`)].join(" ")
    );
  }

  let open = new Set([TREE.key]);
  let query = "";
  let view = "tree"; // or "directory"
  let dept = "all";
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

  // Opening a group closes the other groups beside it, so the tree stays short.
  function toggle(key) {
    const node = branches.get(key);
    if (open.has(key)) {
      closeDown(node);
    } else {
      if (node.parent && !node.isStack) {
        for (const sib of node.parent.kids) if (sib.label && sib !== node && !sib.isStack) closeDown(sib);
      }
      open.add(key);
      justOpened = key;
    }
    render();
    focusBranch(key);
  }

  function closeDown(node) {
    open.delete(node.key);
    for (const k of node.kids) if (k.label) closeDown(k);
  }

  function openGroup(key) {
    open = new Set();
    for (let b = branches.get(key); b; b = b.parent) open.add(b.key);
    if (query) search.value = query = "";
    if (view === "tree") render();
    else setView("tree");
  }

  function reveal(id) {
    const place = places[id]?.[0];
    if (!place) return;
    openGroup(place.branch.key);
    const card = treeEl.querySelector(`.person[data-id="${CSS.escape(id)}"]`);
    if (card) card.scrollIntoView({ block: "nearest", inline: "center" });
  }

  // Search
  const personMatches = (id, role) => {
    const p = PEOPLE[id];
    return fold(`${p.name} ${p.role} ${role}`).includes(query);
  };
  const branchMatches = (node) =>
    fold(node.label).includes(query) ||
    node.kids.some((k) => (k.label ? branchMatches(k) : personMatches(k.id, k.role)));

  // Drawing
  const initials = (name) => {
    const words = name.replace(/\b(Dr\.|The Very Reverend|Jr\.|IV)\b|,/g, "").trim().split(/\s+/);
    return (words[0][0] + (words.length > 1 ? words[words.length - 1][0] : "")).toUpperCase();
  };

  const avatar = (p, id) =>
    p.photo
      ? `<span class="avatar"><img src="${escape(p.photo)}" alt="" width="44" height="44" loading="lazy" decoding="async"></span>`
      : `<span class="avatar initials t${deptOf[id] || 1}" aria-hidden="true">${escape(initials(p.name))}</span>`;

  const plural = (n) => `${n} ${n === 1 ? "person" : "people"}`;
  const found = (n) => `${plural(n)} found`;

  function personHtml(k, inMatchedBranch) {
    if (query && !inMatchedBranch && !personMatches(k.id, k.role)) return "";
    const p = PEOPLE[k.id];
    const hit = query && personMatches(k.id, k.role) ? " hit" : "";
    return `<li class="leaf"><button type="button" class="person${hit}" data-id="${escape(k.id)}">
        ${avatar(p, k.id)}
        <span class="person-text"><span class="person-name">${escape(p.name)}</span><span class="person-role">${escape(k.role)}</span></span>
      </button></li>`;
  }

  function branchHtml(node, depth, inMatchedBranch = false) {
    const labelHit = query && fold(node.label).includes(query);
    const showAll = inMatchedBranch || labelHit;
    if (query && !showAll && !branchMatches(node)) return "";
    const isOpen = query ? true : open.has(node.key);
    const kids = isOpen
      ? node.kids.map((k) => (k.label ? branchHtml(k, depth + 1, showAll) : personHtml(k, showAll))).join("")
      : "";
    const info =
      node.note || node.photo
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
    const list = kids ? `<ul${node.key === justOpened ? ' class="appear"' : ""}>${kids}</ul>` : "";
    return `<li class="branch">${box}${list}</li>`;
  }

  let justOpened = null; // the group to animate on the next draw

  function render() {
    treeEl.innerHTML = `<ul>${branchHtml(TREE, 0)}</ul>`;
    justOpened = null;
    if (query) {
      const n = new Set([...treeEl.querySelectorAll(".person.hit")].map((b) => b.dataset.id)).size;
      resultCount.textContent = n ? found(n) : "";
      empty.hidden = n > 0 || treeEl.querySelector("mark") !== null;
    } else {
      resultCount.textContent = "";
      empty.hidden = true;
    }
    openAll.hidden = Boolean(query); // a search already opens every group with a match
    openAll.textContent = open.size > 1 ? "Close all" : "Open all";
  }

  function focusBranch(key) {
    const el = treeEl.querySelector(`.branch-node[data-key="${key}"]`);
    if (!el) return;
    el.querySelector(".branch-toggle").focus({ preventScroll: true });
    el.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }

  // The "Everyone" list: each department, sorted by last name.
  const surname = (name) => {
    const words = name.replace(/,|\b(Dr\.|Jr\.|Sr\.|II|III|IV)(?=\s|$)/g, "").trim().split(/\s+/);
    return words[words.length - 1];
  };
  const byName = (a, b) =>
    surname(a.p.name).localeCompare(surname(b.p.name), undefined, { sensitivity: "base" }) ||
    a.p.name.localeCompare(b.p.name);

  // Where someone sits, e.g. "Strings" or "Past Studio Artists (2025-26, 2024-25)".
  // Groups their role already names ("Soprano", "Members" for a Board Member) are left out.
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

  const isUnder = (branch, d) => {
    for (let b = branch; b; b = b.parent) if (b === d) return true;
    return false;
  };

  const directory = depts.map((d) => ({
    dept: d,
    list: [...d.ids]
      .map((id) => {
        const p = PEOPLE[id];
        const mine = places[id].filter((w) => isUnder(w.branch, d));
        const affiliation = (p.details || []).find(([k]) => k === "Affiliation")?.[1] || "";
        const group = describeGroups(mine.map((w) => pathOf(w.branch).slice(1)), p.role) || affiliation;
        return { id, p, group, text: fold(`${p.name} ${p.role} ${group} ${affiliation}`) };
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
                ${avatar(x.p, x.id)}
                <span class="person-text">
                  <span class="person-name">${escape(x.p.name)}</span>
                  <span class="person-role">${escape(x.p.role)}</span>
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

  // Profiles
  const paragraphs = (text) =>
    String(text || "")
      .split(/\n\s*\n/)
      .filter((t) => t.trim())
      .map((t) => `<p>${escape(t.trim())}</p>`)
      .join("");

  const svg = (d) => `<svg viewBox="0 0 24 24" aria-hidden="true">${d}</svg>`;
  const icons = {
    globe: svg('<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>'),
    link: svg('<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>'),
    share: svg('<path d="M12 3v12M7 8l5-5 5 5"/><path d="M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6"/>'),
    tree: svg('<circle cx="6" cy="5" r="2"/><circle cx="18" cy="12" r="2"/><circle cx="18" cy="19" r="2"/><path d="M6 7v12h10M6 12h10"/>'),
    check: svg('<path d="M5 12l5 5 9-10"/>'),
  };
  // phones get the system share sheet, computers get "Copy link"
  const canShare = Boolean(navigator.share) && matchMedia("(pointer: coarse)").matches;

  // The last few people someone looked at, shown in the quick search.
  let recent = [];
  try {
    recent = JSON.parse(localStorage.getItem("recent") || "[]").filter((id) => PEOPLE[id]);
  } catch {}
  function remember(id) {
    recent = [id, ...recent.filter((r) => r !== id)].slice(0, 5);
    try {
      localStorage.setItem("recent", JSON.stringify(recent));
    } catch {}
  }

  // The people you can step through with Previous / Next: whoever was next to them on screen.
  let ring = [];
  const siblingsOf = (id) => {
    const branch = places[id]?.[0]?.branch;
    return branch ? branch.kids.filter((k) => !k.label).map((k) => k.id) : [id];
  };
  const firstName = (id) => PEOPLE[id].name.replace(/^Dr\.\s+/, "").split(" ")[0];

  function openPerson(id, list) {
    const p = PEOPLE[id];
    if (!p) return;
    if (list && list.includes(id)) ring = list;
    else if (!ring.includes(id)) ring = siblingsOf(id);

    const where = places[id] || [];
    const details = (p.details || [])
      .map(([k, v]) => `<div><dt>${escape(k)}</dt><dd>${escape(v)}</dd></div>`)
      .join("");
    const placesHtml =
      where.length > 1
        ? `<div><dt>Where you’ll find them</dt><dd><ul class="places">${where
            .map((w) => `<li>${escape(pathOf(w.branch).join(", "))}${w.role === p.role ? "" : ` (${escape(w.role)})`}</li>`)
            .join("")}</ul></dd></div>`
        : "";
    const link = p.link
      ? `<a href="${escape(p.link)}" target="_blank" rel="noopener">${icons.globe}Their website</a>`
      : "";

    dialogBody.className = `dialog-body${p.photo ? "" : " no-photo"}`;
    dialogBody.innerHTML = `
      ${p.photo ? `<div class="dialog-portrait"><img src="${escape(p.photo)}" alt="${escape(p.name)}"></div>` : ""}
      <div class="dialog-info">
        <p class="dialog-dept">${escape(where[0] ? pathOf(where[0].branch)[0] : "")}</p>
        <h2 id="dialog-title">${escape(p.name)}</h2>
        <p class="dialog-role">${escape(p.role)}</p>
        ${details || placesHtml ? `<dl class="dialog-details">${details}${placesHtml}</dl>` : ""}
        <div class="dialog-bio">${paragraphs(p.bio)}</div>
        <p class="dialog-actions">
          ${link}
          <button type="button" data-share="${escape(id)}">${canShare ? icons.share + "Share" : icons.link + "Copy link"}</button>
          <button type="button" data-reveal="${escape(id)}">${icons.tree}Show in the family tree</button>
        </p>
      </div>`;
    remember(id);

    const i = ring.indexOf(id);
    const n = ring.length;
    dialogNav.hidden = n < 2;
    if (n > 1) {
      const prev = ring[(i - 1 + n) % n];
      const next = ring[(i + 1) % n];
      prevBtn.dataset.id = prev;
      nextBtn.dataset.id = next;
      prevBtn.textContent = `‹ ${firstName(prev)}`;
      nextBtn.textContent = `${firstName(next)} ›`;
      prevBtn.setAttribute("aria-label", `Previous: ${PEOPLE[prev].name}`);
      nextBtn.setAttribute("aria-label", `Next: ${PEOPLE[next].name}`);
      step.textContent = `${i + 1} of ${n}`;
    }

    if (location.hash !== `#${id}`) history.replaceState(null, "", `#${id}`);
    dialog.scrollTop = 0;
    if (!dialog.open) dialog.showModal();
  }

  function openBranchInfo(key) {
    const b = branches.get(key);
    dialogNav.hidden = true;
    if (location.hash) history.replaceState(null, "", location.pathname + location.search);
    dialogBody.className = "dialog-body branch-dialog";
    dialogBody.innerHTML = `
      ${b.photo ? `<div class="dialog-banner"><img src="${escape(b.photo)}" alt="The Atlanta Opera ${escape(b.label)}"></div>` : ""}
      <div class="dialog-info">
        <p class="dialog-dept">${escape(plural(b.ids.size))}</p>
        <h2 id="dialog-title">${escape(b.label)}</h2>
        <div class="dialog-bio">${(b.note || []).map((t) => `<p>${escape(t)}</p>`).join("")}</div>
      </div>`;
    dialog.scrollTop = 0;
    if (!dialog.open) dialog.showModal();
  }

  // A photo that won't load falls back to initials.
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

  // The ids of the cards shown alongside this one.
  const neighbours = (card, selector) => [...card.closest(selector).querySelectorAll(".person")].map((b) => b.dataset.id);

  treeEl.addEventListener("click", (e) => {
    const t = e.target.closest("[data-toggle], [data-info], .person");
    if (!t) return;
    if (t.dataset.toggle) toggle(t.dataset.toggle);
    else if (t.dataset.info) openBranchInfo(t.dataset.info);
    else openPerson(t.dataset.id, [...t.closest("ul").children].map((li) => li.querySelector(":scope > .person")?.dataset.id).filter(Boolean));
  });

  dirEl.addEventListener("click", (e) => {
    const t = e.target.closest(".person");
    if (t) openPerson(t.dataset.id, neighbours(t, ".dir-grid"));
  });

  dialog.addEventListener("click", async (e) => {
    if (e.target === dialog) dialog.close();
    const r = e.target.closest("[data-reveal]");
    if (r) {
      dialog.close();
      if (view !== "tree") setView("tree");
      reveal(r.dataset.reveal);
      const card = treeEl.querySelector(`.person[data-id="${CSS.escape(r.dataset.reveal)}"]`);
      card?.scrollIntoView({ block: "center", behavior: "smooth" });
      card?.classList.add("flash");
    }
    const s = e.target.closest("[data-share]");
    if (s) {
      const p = PEOPLE[s.dataset.share];
      const url = `${location.origin}${location.pathname}#${s.dataset.share}`;
      try {
        if (canShare) await navigator.share({ title: p.name, text: `${p.name}, ${p.role}`, url });
        else {
          await navigator.clipboard.writeText(url);
          s.innerHTML = icons.check + "Link copied";
          setTimeout(() => (s.innerHTML = icons.link + "Copy link"), 2000);
        }
      } catch {} // the visitor closed the share sheet, or the clipboard isn't allowed
    }
  });

  prevBtn.addEventListener("click", () => openPerson(prevBtn.dataset.id));
  nextBtn.addEventListener("click", () => openPerson(nextBtn.dataset.id));
  dialog.addEventListener("keydown", (e) => {
    if (dialogNav.hidden) return;
    if (e.key === "ArrowLeft") prevBtn.click();
    if (e.key === "ArrowRight") nextBtn.click();
  });

  // Swipe left or right on a profile to see the next person.
  let touch = null;
  dialog.addEventListener("touchstart", (e) => (touch = e.touches[0]), { passive: true });
  dialog.addEventListener("touchend", (e) => {
    if (!touch || dialogNav.hidden) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touch.clientX;
    if (Math.abs(dx) > 70 && Math.abs(t.clientY - touch.clientY) < 50) (dx < 0 ? nextBtn : prevBtn).click();
    touch = null;
  });

  dialog.addEventListener("close", () => {
    if (location.hash) history.replaceState(null, "", location.pathname + location.search);
  });

  filtersEl.addEventListener("click", (e) => {
    const t = e.target.closest("[data-dept]");
    if (!t) return;
    dept = t.dataset.dept;
    renderDirectory();
  });

  document.querySelectorAll("[data-view]").forEach((b) => b.addEventListener("click", () => setView(b.dataset.view)));

  search.addEventListener("input", () => {
    query = fold(search.value.trim());
    update();
  });

  openAll.addEventListener("click", () => {
    open = open.size > 1 ? new Set([TREE.key]) : new Set(branches.keys());
    render();
  });

  // yoursite/#jane-doe opens Jane's profile; yoursite/#everyone opens the list.
  const openFromHash = () => {
    const id = decodeURIComponent(location.hash.slice(1));
    if (id === "everyone") {
      setView("directory");
      $("people").scrollIntoView();
    } else if (PEOPLE[id]) {
      reveal(id);
      openPerson(id);
    }
  };
  window.addEventListener("hashchange", openFromHash);

  // "Read more" in the About section: the button sits under the extra text.
  document.querySelectorAll(".read-more").forEach((btn) => {
    const more = $(btn.getAttribute("aria-controls"));
    const set = (open) => {
      more.hidden = !open;
      btn.textContent = open ? "Show less" : "Read more";
      btn.setAttribute("aria-expanded", open);
    };
    set(false);
    btn.hidden = false;
    btn.addEventListener("click", () => {
      const opening = more.hidden;
      set(opening);
      if (!opening) btn.scrollIntoView({ block: "nearest" });
    });
  });

  // Photos fade in once loaded.
  document.addEventListener("load", (e) => e.target.tagName === "IMG" && e.target.classList.add("loaded"), true);

  // Light / dark switch. Without a choice the site follows the device setting.
  const themeBtn = $("theme-toggle");
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

  // Header shadow, current section in the menu, and the back-to-top button.
  const header = $("site-header");
  const toTop = $("to-top");
  const heroPhoto = $("hero-photo");
  const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let ticking = false;
  const onScroll = () => {
    header.classList.toggle("scrolled", scrollY > 8);
    toTop.hidden = scrollY < 900;
    // the header photo moves at 40% of the scroll speed while it's on screen
    if (!still && !ticking && scrollY < innerHeight * 1.2) {
      ticking = true;
      requestAnimationFrame(() => {
        heroPhoto.style.transform = `translate3d(0, ${Math.round(scrollY * 0.4)}px, 0)`;
        ticking = false;
      });
    }
  };
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  toTop.addEventListener("click", () => scrollTo({ top: 0, behavior: "smooth" }));

  const navLinks = [...document.querySelectorAll("nav a")];
  const spy = new IntersectionObserver(
    (entries) => {
      for (const en of entries) {
        if (!en.isIntersecting) continue;
        navLinks.forEach((a) => a.classList.toggle("current", a.getAttribute("href") === `#${en.target.id}`));
      }
    },
    { rootMargin: "-40% 0px -55% 0px" }
  );
  // the hero has no menu link, so reaching it clears the highlight
  [document.querySelector(".hero"), $("about"), $("people")].forEach((el) => spy.observe(el));

  // Quick search: press "/" (or Ctrl+K) anywhere, type a few letters, press Enter.
  const finder = $("finder");
  const finderInput = $("finder-input");
  const finderResults = $("finder-results");
  let hits = [];
  let sel = 0;

  const highlight = (name, q) => {
    const at = fold(name).indexOf(q);
    if (!q || at < 0) return escape(name);
    return escape(name.slice(0, at)) + "<mark>" + escape(name.slice(at, at + q.length)) + "</mark>" + escape(name.slice(at + q.length));
  };

  function findPeople(q) {
    const words = q.split(" ").filter(Boolean);
    const scored = [];
    for (const id of Object.keys(places)) {
      const name = fold(PEOPLE[id].name);
      if (!words.every((w) => name.includes(w) || searchText[id].includes(w))) continue;
      let score = 4;
      if (name.startsWith(q)) score = 0;
      else if (name.split(" ").some((w) => w.startsWith(words[0]))) score = 1;
      else if (name.includes(q)) score = 2;
      else if (words.some((w) => name.includes(w))) score = 3;
      scored.push([score, id]);
    }
    return scored
      .sort((a, b) => a[0] - b[0] || surname(PEOPLE[a[1]].name).localeCompare(surname(PEOPLE[b[1]].name)))
      .slice(0, 8)
      .map(([, id]) => id);
  }

  function drawFinder() {
    const q = fold(finderInput.value.trim());
    hits = q ? findPeople(q) : recent;
    sel = Math.min(sel, Math.max(hits.length - 1, 0));
    const row = (id, i) => {
      const p = PEOPLE[id];
      const where = pathOf(places[id][0].branch)[0];
      return `<li role="option" id="hit-${i}" data-id="${escape(id)}" aria-selected="${i === sel}">
          ${avatar(p, id)}
          <span><b>${highlight(p.name, q)}</b><small>${escape(p.role)} · ${escape(where)}</small></span>
        </li>`;
    };
    if (!q && !hits.length) {
      finderResults.innerHTML = `<li class="finder-empty">Type a name, an instrument like “cello”, or a role like “tenor”.</li>`;
    } else if (!hits.length) {
      finderResults.innerHTML = `<li class="finder-empty">No one found. Try another spelling.</li>`;
    } else {
      finderResults.innerHTML = (q ? "" : `<li class="finder-label">Recently viewed</li>`) + hits.map(row).join("");
    }
    finderInput.setAttribute("aria-activedescendant", hits.length ? `hit-${sel}` : "");
  }

  function openFinder() {
    if (dialog.open) dialog.close();
    sel = 0;
    finderInput.value = "";
    drawFinder();
    finder.showModal();
    finderInput.focus();
  }

  function pick(id) {
    finder.close();
    openPerson(id, hits);
  }

  $("finder-open").addEventListener("click", openFinder);
  finderInput.addEventListener("input", () => {
    sel = 0;
    drawFinder();
  });
  finderInput.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (!hits.length) return;
      sel = (sel + (e.key === "ArrowDown" ? 1 : -1) + hits.length) % hits.length;
      drawFinder();
      $(`hit-${sel}`)?.scrollIntoView({ block: "nearest" });
    } else if (e.key === "Enter" && hits[sel]) {
      e.preventDefault();
      pick(hits[sel]);
    }
  });
  finderResults.addEventListener("click", (e) => {
    const li = e.target.closest("[data-id]");
    if (li) pick(li.dataset.id);
  });
  finder.addEventListener("click", (e) => e.target === finder && finder.close());

  document.addEventListener("keydown", (e) => {
    const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName);
    if ((e.key === "/" && !typing) || ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k")) {
      if (finder.open) return;
      e.preventDefault();
      openFinder();
    }
  });

  query = fold(search.value.trim()); // the browser may have kept the search text after going Back
  update();
  openFromHash();
})();

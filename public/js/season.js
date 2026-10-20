// Keeps the Season page current: adds shows and dates that have appeared on the ticket site
// (see ticketSeason in page.js), hides performances that have already happened, and marks the next show.
(() => {
  const season = document.getElementById("season");
  const el = (tag, cls, text) => {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  };

  // "Sat, Nov 7 · 7:30 pm"
  const dateItem = (at) => {
    const t = atlantaTime(at);
    const li = el("li");
    li.append(timeEl(at, `${t.weekday}, ${t.month} ${t.day}`, el("span", null, ` · ${t.time}`)));
    return li;
  };

  // The "Nov / 7–15 / 2026" beside a show, worked out from its dates.
  function label(show) {
    const items = show.querySelectorAll("[data-at]");
    if (!items.length) return;
    const a = atlantaTime(items[0].dataset.at);
    const b = atlantaTime(items[items.length - 1].dataset.at);
    const span = (x, y) => (x === y ? x : `${x}–${y}`);
    show.querySelector(".show-month").textContent = span(a.month, b.month);
    show.querySelector(".show-days").textContent = a.month === b.month && a.day === b.day ? a.day : `${a.day}–${b.day}`;
    show.querySelector(".show-year").textContent = a.year === b.year ? a.year : `${a.year}–${b.year.slice(2)}`;
  }

  // A card for a show that's on the ticket site but not written up here yet: its name, dates and a ticket link.
  function newShow(p) {
    const when = el("p", "show-when");
    when.setAttribute("aria-hidden", "true");
    when.append(el("span", "show-month"), el("span", "show-days"), el("span", "show-year"));
    const labels = el("p", "show-labels");
    const next = el("span", "show-next", "Next up");
    next.hidden = true;
    labels.append(next);
    const dates = el("ul", "show-dates");
    dates.setAttribute("aria-label", "Performances");
    const buy = el("a", "button", "Buy tickets");
    buy.href = `https://tickets.atlantaopera.org/overview/${p.id}`;
    buy.target = "_blank";
    buy.rel = "noopener";
    const actions = el("p", "show-actions");
    actions.append(buy);
    const body = el("div", "show-body");
    body.append(labels, el("h2", null, p.title), dates, actions);
    const show = el("article", "show");
    show.append(when, body);
    return show;
  }

  const firstDate = (show) => Date.parse(show.querySelector("[data-at]")?.dataset.at ?? "");

  function tidy() {
    const now = new Date();
    for (const show of season.querySelectorAll(".show")) {
      show.querySelectorAll("[data-at]").forEach((li) => {
        if (new Date(li.dataset.at) < now) li.remove();
      });
      if (!show.querySelector("[data-at]")) show.remove();
      show.classList.remove("is-next");
      show.querySelector(".show-next").hidden = true;
    }
    const next = season.querySelector(".show");
    if (next) {
      next.classList.add("is-next");
      next.querySelector(".show-next").hidden = false;
    }
    document.getElementById("season-empty").hidden = Boolean(next);
    // a show with no "Next up" and no series tag doesn't need the label row
    document.querySelectorAll(".show-labels").forEach((p) => {
      p.hidden = ![...p.children].some((c) => !c.hidden);
    });
  }

  tidy();
  ticketSeason.then((list) => {
    let changed = false;
    for (const p of list) {
      if (!p.performances.length) continue;
      let show = [...season.querySelectorAll(".show")].find((s) => ticketId(s) === p.id);
      if (show) {
        if (addPerformances(show.querySelector(".show-dates"), p.performances, dateItem)) {
          label(show);
          changed = true;
        }
        continue;
      }
      show = newShow(p);
      addPerformances(show.querySelector(".show-dates"), p.performances, dateItem);
      label(show);
      const start = firstDate(show);
      season.insertBefore(show, [...season.querySelectorAll(".show")].find((s) => firstDate(s) > start) || null);
      changed = true;
    }
    if (changed) tidy();
  });
})();

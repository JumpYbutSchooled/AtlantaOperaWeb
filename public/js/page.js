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

  // Every upcoming performance on the ticket site, saved each day by scripts/update-season.mjs.
  // The Season page and show pages add any shows or dates they don't list yet; if the file
  // can't be loaded, the pages stay as written.
  const ISO = /^\d{4}-\d\d-\d\dT\d\d:\d\d[+-]\d\d:\d\d$/;
  window.ticketSeason = document.querySelector("#season, .date-list")
    ? fetch("/data/season.json", { cache: "no-cache" })
        .then((r) => (r.ok ? r.json() : []))
        .then((list) =>
          list
            .filter((p) => /^\d+$/.test(p.id) && typeof p.title === "string" && Array.isArray(p.performances))
            .map((p) => ({ ...p, performances: p.performances.filter((at) => ISO.test(at) && new Date(at) > now) }))
        )
        .catch(() => [])
    : Promise.resolve([]);

  // The ticket site's number for a show, from its Buy tickets link.
  window.ticketId = (el) =>
    el.querySelector('a[href^="https://tickets.atlantaopera.org/overview/"]')?.href.match(/\/overview\/(\d+)/)[1];

  // The day and time of a performance in Atlanta, whatever time zone the visitor is in.
  window.atlantaTime = (at) => {
    const d = new Date(at);
    const part = (o) => new Intl.DateTimeFormat("en-US", { timeZone: "America/New_York", ...o }).format(d);
    return {
      weekday: part({ weekday: "short" }),
      weekdayLong: part({ weekday: "long" }),
      month: part({ month: "short" }),
      monthLong: part({ month: "long" }),
      day: part({ day: "numeric" }),
      year: part({ year: "numeric" }),
      // "7:30 PM" -> "7:30 pm", "3:00 PM" -> "3 pm"
      time: part({ hour: "numeric", minute: "2-digit" }).replace(":00", "").replace(/\s*([AP])M$/, (_, x) => ` ${x.toLowerCase()}m`),
    };
  };

  // Adds the performances a list doesn't have yet, keeping it in date order. Returns how many it added.
  window.addPerformances = (list, ats, makeItem) => {
    let added = 0;
    for (const at of ats) {
      const t = Date.parse(at);
      const items = [...list.querySelectorAll("[data-at]")];
      if (items.some((li) => Date.parse(li.dataset.at) === t)) continue;
      const li = makeItem(at);
      li.dataset.at = at;
      list.insertBefore(li, items.find((x) => Date.parse(x.dataset.at) > t) || null);
      added++;
    }
    return added;
  };

  // <time datetime="..."> holding the given text and elements
  window.timeEl = (at, ...parts) => {
    const time = document.createElement("time");
    time.dateTime = at;
    time.append(...parts);
    return time;
  };

  // Show pages: dates added on the ticket site join the list, and performances that have happened drop off.
  const dateList = document.querySelector(".date-list");
  if (dateList) {
    const tidyDates = () => {
      dateList.querySelectorAll("[data-at]").forEach((li) => {
        if (new Date(li.dataset.at) < new Date()) li.remove();
      });
      const done = !dateList.children.length;
      dateList.hidden = done;
      document.querySelector(".dates-done").hidden = !done;
    };
    tidyDates();
    const id = ticketId(document);
    ticketSeason.then((season) => {
      const show = season.find((p) => p.id === id);
      const longItem = (at) => {
        const t = atlantaTime(at);
        const li = document.createElement("li");
        const strong = document.createElement("strong");
        strong.textContent = `${t.weekdayLong}, ${t.monthLong} ${t.day}`;
        li.append(timeEl(at, strong, ` at ${t.time}`));
        return li;
      };
      if (show && addPerformances(dateList, show.performances, longItem)) tidyDates();
    });
  }

  const header = document.getElementById("site-header");
  const onScroll = () => header.classList.toggle("scrolled", scrollY > 8);
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();
})();

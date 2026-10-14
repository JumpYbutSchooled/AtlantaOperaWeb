// Hides performances that have already happened and marks the next show.
(() => {
  const now = new Date();
  const shows = [...document.querySelectorAll(".show")];
  for (const show of shows) {
    show.querySelectorAll("[data-at]").forEach((li) => {
      if (new Date(li.dataset.at) < now) li.remove();
    });
    if (!show.querySelector("[data-at]")) show.remove();
  }
  const next = document.querySelector(".show");
  if (next) {
    next.classList.add("is-next");
    next.querySelector(".show-next").hidden = false;
  } else {
    document.getElementById("season-empty").hidden = false;
  }
  // a show with no "Next up" and no series tag doesn't need the label row
  document.querySelectorAll(".show-labels").forEach((p) => {
    p.hidden = ![...p.children].some((c) => !c.hidden);
  });
})();

(() => {
  const sharedHeader = document.querySelector("[data-shared-header]");
  if (sharedHeader) {
    const projectsCurrent = document.querySelector("[data-project]") ? ' aria-current="page"' : "";
    sharedHeader.className = "site-header";
    sharedHeader.innerHTML = `
      <div class="nav-shell shell">
        <a class="brand" href="index.html" aria-label="Trelans home">
          <span class="brand-mark" aria-hidden="true">TR</span>
          <span class="brand-label">Trelans <small>Games &amp; interactive work</small></span>
        </a>
        <button class="nav-toggle" type="button" aria-label="Toggle navigation" aria-expanded="false" aria-controls="site-navigation" data-nav-toggle><span></span></button>
        <nav class="site-nav" id="site-navigation" aria-label="Primary navigation" data-site-nav>
          <a href="index.html">Home</a>
          <a href="works.html"${projectsCurrent}>Projects</a>
          <a href="lab.html">Demo lab</a>
          <a href="about.html">About</a>
        </nav>
      </div>`;
  }

  const sharedFooter = document.querySelector("[data-shared-footer]");
  if (sharedFooter) {
    sharedFooter.className = "site-footer";
    sharedFooter.innerHTML = `
      <div class="footer-shell shell">
        <p class="footer-copy">© <span data-current-year></span> Trelans. Built around playable work.</p>
        <nav class="footer-nav" aria-label="Footer navigation">
          <a href="works.html">Projects</a>
          <a href="lab.html">Demo lab</a>
          <a href="about.html">About</a>
        </nav>
      </div>`;
  }

  const toggle = document.querySelector("[data-nav-toggle]");
  const nav = document.querySelector("[data-site-nav]");

  const closeNavigation = () => {
    if (!toggle || !nav) return;
    toggle.setAttribute("aria-expanded", "false");
    nav.classList.remove("is-open");
  };

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const willOpen = toggle.getAttribute("aria-expanded") !== "true";
      toggle.setAttribute("aria-expanded", String(willOpen));
      nav.classList.toggle("is-open", willOpen);
      if (willOpen) nav.querySelector("a")?.focus();
    });

    nav.addEventListener("click", (event) => {
      if (event.target.closest("a")) closeNavigation();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        closeNavigation();
        toggle.focus();
      }
    });

    document.addEventListener("click", (event) => {
      if (toggle.getAttribute("aria-expanded") === "true" && !event.target.closest(".nav-shell")) {
        closeNavigation();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 760) closeNavigation();
    });
  }

  document.querySelectorAll("[data-current-year]").forEach((element) => {
    element.textContent = String(new Date().getFullYear());
  });

  const filterBar = document.querySelector("[data-project-filters]");
  const cards = [...document.querySelectorAll("[data-project-category]")];
  const filterCount = document.querySelector("[data-filter-count]");

  if (filterBar && cards.length) {
    filterBar.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-filter]");
      if (!button) return;

      const filter = button.dataset.filter;
      filterBar.querySelectorAll("button[data-filter]").forEach((item) => {
        item.setAttribute("aria-pressed", String(item === button));
      });

      cards.forEach((card) => {
        card.hidden = filter !== "all" && card.dataset.projectCategory !== filter;
      });

      if (filterCount) {
        const visibleCount = cards.filter((card) => !card.hidden).length;
        filterCount.textContent = `${visibleCount} ${visibleCount === 1 ? "project" : "projects"} shown`;
      }
    });
  }
})();

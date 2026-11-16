(() => {
  const menuToggle = document.querySelector(".menu-toggle");
  const navigation = document.querySelector(".primary-nav");

  if (menuToggle && navigation) {
    menuToggle.addEventListener("click", () => {
      const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
      menuToggle.setAttribute("aria-expanded", String(!isExpanded));
      menuToggle.setAttribute("aria-label", isExpanded ? "Abrir menu" : "Fechar menu");
      navigation.classList.toggle("is-open", !isExpanded);
    });

    navigation.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Abrir menu");
        navigation.classList.remove("is-open");
      });
    });
  }

  const filterButtons = document.querySelectorAll(".filter-button");
  const projectCards = document.querySelectorAll(".project-card");

  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches && "IntersectionObserver" in window) {
    const revealGroups = [
      [".section-heading", "up"],
      [".about-copy", "left"],
      [".about-facts", "right"],
      [".skill-strip", "up"],
      [".timeline-entry", "up"],
      [".learning-card", "right"],
      [".capability-title", "up"],
      [".capability", "up"],
      [".project-toolbar", "up"],
      [".project-card", "up"],
      [".project-note", "up"],
      [".contact-copy", "left"],
      [".contact-details", "right"],
    ];
    const revealItems = revealGroups.flatMap(([selector, direction]) =>
      [...document.querySelectorAll(selector)].map((element) => ({ element, direction }))
    );
    const groupCounts = new Map();

    revealItems.forEach(({ element, direction }) => {
      const group = element.parentElement;
      const index = groupCounts.get(group) || 0;
      groupCounts.set(group, index + 1);
      element.dataset.reveal = direction;
      element.style.setProperty("--reveal-delay", `${Math.min(index, 4) * 80}ms`);
    });

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -35px 0px" });

    document.documentElement.classList.add("motion-ready");
    revealItems.forEach(({ element }) => revealObserver.observe(element));
  }

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;

      filterButtons.forEach((filterButton) => {
        const isActive = filterButton === button;
        filterButton.classList.toggle("is-active", isActive);
        filterButton.setAttribute("aria-pressed", String(isActive));
      });

      projectCards.forEach((card) => {
        card.hidden = filter !== "todos" && card.dataset.category !== filter;
      });
    });
  });
})();

(() => {
  const root = document.documentElement;
  const themeToggle = document.getElementById("themeToggle");
  const themeColor = document.querySelector('meta[name="theme-color"]');

  try {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light" || savedTheme === "dark") {
      root.dataset.theme = savedTheme;
    }
  } catch {
    // Keep the default theme if browser storage is unavailable.
  }

  function setTheme(theme) {
    root.dataset.theme = theme;
    themeToggle.setAttribute(
      "aria-label",
      theme === "dark" ? "Chuyển sang giao diện sáng" : "Chuyển sang giao diện tối"
    );
    if (themeColor) {
      themeColor.content = theme === "dark" ? "#090c12" : "#f5f8fb";
    }
    try {
      localStorage.setItem("theme", theme);
    } catch {
      // Theme still changes for this page view when storage is unavailable.
    }
  }

  setTheme(root.dataset.theme === "light" ? "light" : "dark");
  themeToggle.addEventListener("click", () => {
    setTheme(root.dataset.theme === "dark" ? "light" : "dark");
  });

  const scrollProgress = document.getElementById("scrollProgress");
  let scrollFrame = 0;
  function updateScrollProgress() {
    if (scrollFrame) return;
    scrollFrame = requestAnimationFrame(() => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
      scrollProgress.style.transform = `scaleX(${Math.min(1, Math.max(0, progress))})`;
      scrollFrame = 0;
    });
  }
  window.addEventListener("scroll", updateScrollProgress, { passive: true });
  window.addEventListener("resize", updateScrollProgress);
  updateScrollProgress();

  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -35px 0px" });
    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  const navLinks = Array.from(document.querySelectorAll(".main-nav a"));
  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);
  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
      const visibleSection = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visibleSection) return;
      navLinks.forEach((link) => {
        const active = link.hash === `#${visibleSection.target.id}`;
        link.classList.toggle("active", active);
        if (active) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    }, { rootMargin: "-25% 0px -60% 0px", threshold: [0, 0.1, 0.5] });
    sections.forEach((section) => sectionObserver.observe(section));
  }

  const previewWrap = document.querySelector(".preview-wrap");
  const demoFrame = document.querySelector(".demo-image-shell");
  const supportsHover = window.matchMedia("(hover: hover) and (pointer: fine)");
  if (supportsHover.matches && previewWrap && demoFrame) {
    previewWrap.addEventListener("pointermove", (event) => {
      const bounds = previewWrap.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width;
      const y = (event.clientY - bounds.top) / bounds.height;
      const tiltX = (0.5 - y) * 5;
      const tiltY = (x - 0.5) * 7;
      previewWrap.style.setProperty("--pointer-x", `${x * 100}%`);
      previewWrap.style.setProperty("--pointer-y", `${y * 100}%`);
      demoFrame.style.setProperty("--tilt-x", `${tiltX}deg`);
      demoFrame.style.setProperty("--tilt-y", `${tiltY}deg`);
    });
    previewWrap.addEventListener("pointerleave", () => {
      demoFrame.style.setProperty("--tilt-x", "0deg");
      demoFrame.style.setProperty("--tilt-y", "0deg");
    });
  }

  document.querySelectorAll(".feature-card").forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const bounds = card.getBoundingClientRect();
      card.style.setProperty("--card-x", `${event.clientX - bounds.left}px`);
      card.style.setProperty("--card-y", `${event.clientY - bounds.top}px`);
    });
  });

  const currentYear = document.getElementById("currentYear");
  if (currentYear) currentYear.textContent = String(new Date().getFullYear());
})();

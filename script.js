const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const navItems = [...document.querySelectorAll('.nav-links a[href^="#"]')];
const revealItems = document.querySelectorAll(".reveal");
const yearNode = document.querySelector("#year");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function closeMenu() {
  navLinks?.classList.remove("is-open");
  menuToggle?.setAttribute("aria-expanded", "false");
  menuToggle?.setAttribute("aria-label", "Open menu");
}

menuToggle?.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("is-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
});

navItems.forEach((link) => {
  link.addEventListener("click", (event) => {
    const target = document.querySelector(link.getAttribute("href"));

    if (!target) {
      return;
    }

    event.preventDefault();
    target.scrollIntoView({
      behavior: reduceMotion.matches ? "auto" : "smooth",
      block: "start"
    });
    window.history.replaceState(null, "", link.getAttribute("href"));
    closeMenu();
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMenu();
  }
});

if (reduceMotion.matches) {
  revealItems.forEach((item) => item.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
}

const sections = navItems
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

const navigationObserver = new IntersectionObserver(
  (entries) => {
    const visibleSection = entries.find((entry) => entry.isIntersecting);

    if (!visibleSection) {
      return;
    }

    navItems.forEach((link) => {
      const isCurrent =
        link.getAttribute("href") === `#${visibleSection.target.id}`;

      link.classList.toggle("is-active", isCurrent);

      if (isCurrent) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  },
  { rootMargin: "-30% 0px -60% 0px" }
);

sections.forEach((section) => navigationObserver.observe(section));

if (yearNode) {
  yearNode.textContent = new Date().getFullYear();
}

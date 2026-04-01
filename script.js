const typedText = document.querySelector("#typed-text");
const words = [
  "Front-End Developer",
  "React Developer",
  "Creative Problem Solver"
];

const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const navItems = document.querySelectorAll(".nav-links a");
const revealItems = document.querySelectorAll(".reveal");
const contactForm = document.querySelector(".contact-form");
const yearNode = document.querySelector("#year");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeLoop() {
  if (!typedText) {
    return;
  }

  const currentWord = words[wordIndex];
  typedText.textContent = isDeleting
    ? currentWord.slice(0, charIndex--)
    : currentWord.slice(0, charIndex++);

  let delay = isDeleting ? 55 : 95;

  if (!isDeleting && charIndex === currentWord.length + 1) {
    isDeleting = true;
    delay = 1400;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    wordIndex = (wordIndex + 1) % words.length;
    delay = 350;
  }

  window.setTimeout(typeLoop, delay);
}

function revealOnScroll() {
  if (prefersReducedMotion.matches) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 }
  );

  revealItems.forEach((item) => observer.observe(item));
}

function toggleMenu() {
  const isOpen = navLinks.classList.toggle("is-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
}

function closeMenu() {
  if (!navLinks || !menuToggle) {
    return;
  }

  navLinks.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open menu");
}

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", toggleMenu);
  navItems.forEach((item) => item.addEventListener("click", closeMenu));

  document.addEventListener("click", (event) => {
    const target = event.target;

    if (
      navLinks.classList.contains("is-open") &&
      target instanceof Node &&
      !navLinks.contains(target) &&
      !menuToggle.contains(target)
    ) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });
}

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const submitButton = contactForm.querySelector("button[type='submit']");

    if (submitButton) {
      submitButton.textContent = "Message Sent";
      submitButton.disabled = true;
    }

    window.setTimeout(() => {
      contactForm.reset();

      if (submitButton) {
        submitButton.textContent = "Send Message";
        submitButton.disabled = false;
      }
    }, 1800);
  });
}

if (yearNode) {
  yearNode.textContent = new Date().getFullYear();
}

if (typedText) {
  if (prefersReducedMotion.matches) {
    typedText.textContent = words[0];
  } else {
    typeLoop();
  }
}

revealOnScroll();

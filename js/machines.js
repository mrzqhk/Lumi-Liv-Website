/* machines.js — scroll animations for the Machines page */
(function initHeaderScroll() {
  const nav = document.querySelector(".site-nav");
  if (!nav) return;
  let lastY = window.scrollY;
  let ticking = false;
  function update() {
    const y = window.scrollY;
    nav.classList.toggle("nav-solid", y > 80);
    if (y > lastY && y > 80) { nav.classList.add("nav-hidden"); }
    else if (y < lastY) { nav.classList.remove("nav-hidden"); }
    lastY = y; ticking = false;
  }
  window.addEventListener("scroll", () => {
    if (!ticking) { requestAnimationFrame(update); ticking = true; }
  }, { passive: true });
  update();
})();

window.addEventListener("load", function () {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function showAll() {
    document.querySelectorAll(".reveal").forEach(el => el.classList.add("is-visible"));
    document.querySelectorAll(".wave-divider .wave-path").forEach(el => { el.style.strokeDashoffset = "0"; });
  }
  if (reduced || typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
    showAll(); return;
  }
  try {
    gsap.registerPlugin(ScrollTrigger);
    // Generic reveals
    document.querySelectorAll(".reveal").forEach(el => {
      gsap.fromTo(el,
        { opacity: 0, y: 32 },
        { opacity: 1, y: 0, duration: 0.9, ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%" } }
      );
    });
    // Wave paths
    document.querySelectorAll(".wave-divider .wave-path").forEach(path => {
      const length = path.getTotalLength();
      path.style.strokeDasharray = length;
      path.style.strokeDashoffset = length;
      gsap.to(path, {
        strokeDashoffset: 0, ease: "none",
        scrollTrigger: { trigger: path.closest(".wave-divider"), start: "top 95%", end: "bottom 60%", scrub: true }
      });
    });
    // Cap cards stagger
    document.querySelectorAll(".caps-grid").forEach(grid => {
      gsap.fromTo(grid.querySelectorAll(".cap-card"),
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power3.out", stagger: 0.1,
          scrollTrigger: { trigger: grid, start: "top 80%" } }
      );
    });
    // Material tags
    document.querySelectorAll(".materials-row").forEach(row => {
      gsap.fromTo(row.querySelectorAll(".material-tag"),
        { opacity: 0, scale: 0.85 },
        { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.8)", stagger: 0.06,
          scrollTrigger: { trigger: row, start: "top 88%" } }
      );
    });
    ScrollTrigger.refresh();
  } catch (e) {
    showAll();
  }
});

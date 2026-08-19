/* Header: hides on scroll down, reappears on scroll up; transparent over the
   hero, solid once past it. Runs immediately — does not depend on GSAP or
   on content-loader having finished, so it always works. */
(function initHeaderScroll() {
  const nav = document.querySelector(".site-nav");
  if (!nav) return;

  let lastY = window.scrollY;
  let ticking = false;

  function update() {
    const y = window.scrollY;
    const hero = document.querySelector(".hero");
    const heroBottom = hero ? hero.offsetHeight - 80 : 400;

    nav.classList.toggle("nav-solid", y > heroBottom);

    if (y > lastY && y > 80) {
      nav.classList.add("nav-hidden");
    } else if (y < lastY) {
      nav.classList.remove("nav-hidden");
    }
    lastY = y;
    ticking = false;
  }

  window.addEventListener("scroll", () => {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });

  update();
})();

/* Scroll-driven motion for Lumi Liv. Runs once content-loader has populated the DOM. */
document.addEventListener("lumiliv:content-ready", initMotion, { once: true });

function initMotion() {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function showEverythingNoAnimation() {
    document.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-visible"));
    document.querySelectorAll(".draw").forEach((el) => { el.style.strokeDashoffset = "0"; });
    document.querySelectorAll(".wave-divider .wave-path").forEach((el) => { el.style.strokeDashoffset = "0"; });
    document.querySelectorAll(".stitch-thread").forEach((el) => { el.style.transform = "translateX(-50%) scaleY(1)"; });
  }

  // If either script failed to load (flaky CDN, ad-blocker, offline), never
  // leave the page stuck invisible — show everything plainly instead.
  if (reduced || typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
    showEverythingNoAnimation();
    return;
  }

  // Safety net: if anything below throws partway through for any reason,
  // fall back to showing everything rather than leaving sections at
  // opacity:0 forever.
  try {
    runScrollAnimations();
  } catch (err) {
    console.error("Animation setup failed, showing content without animation.", err);
    showEverythingNoAnimation();
  }
}

function runScrollAnimations() {
  gsap.registerPlugin(ScrollTrigger);

  // Generic reveal-on-scroll for anything tagged .reveal
  document.querySelectorAll(".reveal").forEach((el) => {
    gsap.fromTo(el,
      { opacity: 0, y: 32 },
      {
        opacity: 1, y: 0, duration: 0.9, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 85%" }
      }
    );
  });

  // (hero parallax removed — replaced by the looping image columns, which animate via pure CSS)

  // Hero entrance sequence (eyebrow -> headline -> subhead -> cta)
  gsap.timeline({ defaults: { ease: "power3.out", duration: 0.9 } })
    .from(".hero-content .eyebrow", { opacity: 0, y: 16 }, 0.1)
    .from("#hero-headline", { opacity: 0, y: 26 }, 0.25)
    .from("#hero-subhead", { opacity: 0, y: 20 }, 0.45)
    .from("#hero-cta", { opacity: 0, y: 16 }, 0.6);
  gsap.set(["#hero-headline", "#hero-subhead", "#hero-cta"], { clearProps: "transform" });

  // Services stitch-timeline: the thread fades in as the section arrives,
  // each node pops in like a stitch being pulled tight, copy and photo
  // ease in from their respective sides (mirrored on flipped rows).
  // Services stitch-timeline: the thread visibly "sews" downward as the
  // section scrolls through view, each node pops in like a stitch being
  // pulled tight and its icon draws itself in, copy/photo ease in from
  // their respective sides (mirrored on flipped rows).
  gsap.to("#stitch-thread", {
    scaleY: 1,
    ease: "none",
    scrollTrigger: {
      trigger: ".stitch-timeline",
      start: "top 75%",
      end: "bottom 75%",
      scrub: true
    }
  });

  document.querySelectorAll(".stitch-item").forEach((item) => {
    const isFlip = item.classList.contains("flip");
    const copy = item.querySelector(".stitch-copy");
    const media = item.querySelector(".stitch-media");
    const node = item.querySelector(".stitch-node");
    const drawPaths = item.querySelectorAll(".draw");
    const fromX = isFlip ? -50 : 50;

    gsap.fromTo(node, { scale: 0, opacity: 0 }, {
      scale: 1, opacity: 1, duration: 0.5, ease: "back.out(2.5)",
      scrollTrigger: { trigger: item, start: "top 75%" }
    });
    gsap.fromTo(drawPaths, { strokeDashoffset: 60 }, {
      strokeDashoffset: 0, duration: 0.7, ease: "power2.out", delay: 0.25,
      scrollTrigger: { trigger: item, start: "top 75%" }
    });
    gsap.fromTo(copy, { opacity: 0, x: -fromX }, {
      opacity: 1, x: 0, duration: 0.8, ease: "power3.out", delay: 0.1,
      scrollTrigger: { trigger: item, start: "top 75%" }
    });
    gsap.fromTo(media, { opacity: 0, x: fromX }, {
      opacity: 1, x: 0, duration: 0.8, ease: "power3.out", delay: 0.1,
      scrollTrigger: { trigger: item, start: "top 75%" }
    });
  });

  // Gallery tiles: gentle staggered rise
  gsap.fromTo(".gallery-tile",
    { opacity: 0, y: 40 },
    {
      opacity: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.08,
      scrollTrigger: { trigger: "#gallery", start: "top 75%" }
    }
  );

  // Wave dividers: each thin line draws itself in as it scrolls through view,
  // literally forming the wave in sync with scroll position.
  document.querySelectorAll(".wave-divider .wave-path").forEach((path) => {
    const length = path.getTotalLength();
    path.style.strokeDasharray = length;
    path.style.strokeDashoffset = length;
    gsap.to(path, {
      strokeDashoffset: 0,
      ease: "none",
      scrollTrigger: {
        trigger: path.closest(".wave-divider"),
        start: "top 95%",
        end: "bottom 60%",
        scrub: true
      }
    });
  });

  ScrollTrigger.refresh();
}

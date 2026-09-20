/* Loads site content (from admin edits in localStorage, falling back to content.json,
   falling back to this embedded default so the page NEVER renders blank). */
(function () {
  const STORAGE_KEY = "lumiliv_content";

  const DEFAULT_CONTENT = {
    hero: {
      eyebrow: "LUMI LIV",
      headline: "Precision Crafted.\nPersonally Yours.",
      subhead: "Custom leather & acrylic gifts and décor — laser cut, hand-finished, made to order. Wholesale & retail.",
      ctaLabel: "Enquire Now",
      ctaLink: "#contact",
      imagesColUp: [
        { image: "", alt: "Leather craft piece" },
        { image: "", alt: "Leather craft piece" },
        { image: "", alt: "Leather craft piece" }
      ],
      imagesColDown: [
        { image: "", alt: "Acrylic craft piece" },
        { image: "", alt: "Acrylic craft piece" },
        { image: "", alt: "Acrylic craft piece" }
      ]
    },
    founder: {
      name: "Owner",
      body: "Lumi Liv started with a simple idea — that gifts should feel personal, not generic. Every piece that leaves our workshop is cut, engraved, and finished by hand, made exactly the way you imagined it.\n\nThank you for letting us be part of your celebrations.",
      image: "assets/logo.jpg"
    },
    services: {
      heading: "Our Services.",
      intro: "One thread runs through everything we make. Bring us your idea — in leather, acrylic, or anything in between — and we'll cut, engrave, and stitch it into shape.",
      items: [
        { tag: "CO2 LASER", title: "Laser Cutting", body: "Precise custom cuts in leather, acrylic, wood, and more — however intricate the design.", image: "" },
        { tag: "FIBER LASER", title: "Engraving", body: "Fine detail engraved into metal, acrylic, and leather alike.", image: "" },
        { tag: "BY HAND", title: "Stitching", body: "Hand-stitched seams and finishes, built to last — not just look good.", image: "" },
        { tag: "YOUR IDEA", title: "Custom Design", body: "Send a sketch, a photo, or just an idea — we'll turn it into a finished piece, made to order.", image: "" }
      ]
    },
    gallery: {
      heading: "A few things we've made — in leather, acrylic, and everything in between.",
      items: [
        { image: "", alt: "Premium leather tissue box" },
        { image: "", alt: "Acrylic wedding welcome sign" },
        { image: "", alt: "Leather jewelry display mannequin" },
        { image: "", alt: "Acrylic baby shower keepsake" },
        { image: "", alt: "Leather watch holder" },
        { image: "", alt: "Custom made-to-order piece" }
      ]
    },
    occasions: {
      items: [
        { label: "Weddings", image: "" },
        { label: "Baby Showers", image: "" },
        { label: "Corporate", image: "" },
        { label: "Personal", image: "" }
      ]
    },
    banner: { text: "Got something in mind? If you can sketch it, we can cut it." },
    lifestyle: {
      images: [
        { image: "", alt: "Workshop moment" },
        { image: "", alt: "Workshop moment" },
        { image: "", alt: "Workshop moment" },
        { image: "", alt: "Workshop moment" }
      ],
      text: "Follow along for behind-the-scenes and finished pieces. From color picks to custom requests, your ideas help shape what we make next.",
      ctaLabel: "Follow Along",
      ctaLink: ""
    },
    contact: {
      headline: "Got an idea?",
      body: "Tell us what you're picturing — we'll help make it real.",
      whatsappNumber: "919876543210",
      email: "hello@lumiliv.com",
      phoneDisplay: "+91 98765 43210",
      address: "Lumi Liv Craft Studio\n23, Maker's Lane, Kochi,\nKerala, India – 682018",
      website: "www.lumiliv.com",
      socials: { instagram: "", facebook: "", pinterest: "", behance: "" },
      mapEmbedSrc: "https://www.google.com/maps?q=Kochi,Kerala,India&output=embed"
    },
    brand: { logo: "" }
  };

  function escapeHtml(str) {
    return (str || "").replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[c]));
  }

  function mediaFill(imgUrl, altText) {
    if (imgUrl) {
      return `<img src="${escapeHtml(imgUrl)}" alt="${escapeHtml(altText || "")}" loading="lazy">`;
    }
    return `<div class="placeholder">${escapeHtml(altText || "Add an image in the admin panel")}</div>`;
  }

  const socialIcons = {
    instagram: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5.5"/><circle cx="12" cy="12" r="4.2"/><circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none"/></svg>',
    facebook: '<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M13.9 21.9v-8.4h2.8l.4-3.3h-3.2V8.1c0-1 .3-1.6 1.7-1.6h1.7V3.6C17 3.5 16 3.4 14.9 3.4c-2.5 0-4.3 1.6-4.3 4.4v2.4H7.8v3.3h2.8v8.4h3.3z"/></svg>'
  };
  const stitchIcons = [
    '<svg viewBox="0 0 24 24"><line class="draw" x1="4" y1="20" x2="19" y2="5"/><circle cx="19" cy="5" r="1.4" fill="currentColor" stroke="none"/></svg>',
    '<svg viewBox="0 0 24 24"><path class="draw" d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.8 2.8M15.2 15.2L18 18M6 18l2.8-2.8M15.2 8.8L18 6"/></svg>',
    '<svg viewBox="0 0 24 24"><path class="draw" d="M2 12l3.5-6 3.5 6 3.5-6 3.5 6 3.5-6"/></svg>',
    '<svg viewBox="0 0 24 24"><path class="draw" d="M4 20L15 4M15 4h-5M15 4v5"/></svg>'
  ];

  function renderHero(data) {
    document.getElementById("hero-eyebrow").textContent = data.hero.eyebrow;
    document.getElementById("hero-headline").textContent = data.hero.headline;
    document.getElementById("hero-subhead").textContent = data.hero.subhead;
    const cta = document.getElementById("hero-cta");
    cta.textContent = data.hero.ctaLabel;
    cta.setAttribute("href", data.hero.ctaLink || "#contact");

    function renderLoopCol(elId, items) {
      const wrap = document.getElementById(elId);
      if (!wrap || !items || !items.length) return;
      const tilesHtml = items.map((item) =>
        `<div class="hero-visual-tile">${mediaFill(item.image, item.alt)}</div>`
      ).join("");
      wrap.innerHTML = tilesHtml + tilesHtml;
    }
    renderLoopCol("hero-col-up", data.hero.imagesColUp);
    renderLoopCol("hero-col-down", data.hero.imagesColDown);
  }

  function renderFounder(data) {
    document.getElementById("founder-body").textContent = data.founder.body;
    document.getElementById("founder-signature").textContent = "— " + data.founder.name;
    const founderImg = document.getElementById("founder-image");
    const founderPh = document.getElementById("founder-placeholder");
    if (data.founder.image) {
      founderImg.src = data.founder.image;
      founderImg.style.display = "";
      founderPh.style.display = "none";
    } else {
      founderImg.style.display = "none";
      founderPh.style.display = "";
    }
  }

  function renderServices(data) {
    document.getElementById("services-heading").textContent = data.services.heading;
    document.getElementById("services-intro").textContent = data.services.intro;
    const svcWrap = document.getElementById("services-list");
    svcWrap.innerHTML = data.services.items.map((item, i) => {
      const flip = i % 2 === 1 ? " flip" : "";
      return `
        <div class="stitch-item${flip} reveal">
          <div class="stitch-copy">
            <span class="num">${escapeHtml(item.tag || "")}</span>
            <h3>${escapeHtml(item.title)}</h3>
            <p>${escapeHtml(item.body)}</p>
          </div>
          <div class="stitch-node">${stitchIcons[i % 4]}</div>
          <div class="stitch-media">${mediaFill(item.image, item.title)}</div>
        </div>`;
    }).join("");
  }

  function renderGallery(data) {
    document.getElementById("gallery-heading").textContent = data.gallery.heading;
    const galWrap = document.getElementById("gallery-grid");
    galWrap.innerHTML = data.gallery.items.map((item, i) => `
        <div class="gallery-tile g${i + 1} reveal" tabindex="0">
          ${mediaFill(item.image, item.alt)}
        </div>`).join("");
  }

  function renderOccasions(data) {
    const occWrap = document.getElementById("occasions-row");
    occWrap.innerHTML = data.occasions.items.map((item) => `
      <div class="occasion-item reveal">
        <div class="occasion-circle">${mediaFill(item.image, item.label)}</div>
        <span class="occasion-label">${escapeHtml(item.label)}</span>
      </div>`).join("");
  }

  function renderBanner(data) {
    document.getElementById("banner-text").textContent = data.banner.text;
  }

  function renderLifestyle(data) {
    const lifeWrap = document.getElementById("lifestyle-strip");
    lifeWrap.innerHTML = data.lifestyle.images.map((item) => `
      <div class="lifestyle-tile">${mediaFill(item.image, item.alt)}</div>`).join("");
    document.getElementById("lifestyle-text").textContent = data.lifestyle.text;
    const lifeCta = document.getElementById("lifestyle-cta-btn");
    lifeCta.textContent = data.lifestyle.ctaLabel;
    lifeCta.setAttribute("href", data.lifestyle.ctaLink || "#");
  }

  function renderContact(data) {
    const c = data.contact;
    document.getElementById("contact-headline").textContent = c.headline;
    document.getElementById("contact-body").textContent = c.body;
    document.getElementById("contact-phone").textContent = c.phoneDisplay;
    document.getElementById("contact-email-text").textContent = c.email;
    document.getElementById("contact-address").textContent = c.address;
    document.getElementById("contact-website").textContent = c.website;

    const wa = document.getElementById("contact-whatsapp");
    wa.setAttribute("href", `https://wa.me/${c.whatsappNumber}`);
    const em = document.getElementById("contact-email");
    em.setAttribute("href", `mailto:${c.email}`);

    const socialsWrap = document.getElementById("contact-socials");
    const socialsHtml = Object.entries(c.socials || {})
      .filter(([, url]) => url)
      .map(([key, url]) => `<a href="${escapeHtml(url)}" target="_blank" rel="noopener" aria-label="${key}">${socialIcons[key] || key.slice(0,2).toUpperCase()}</a>`)
      .join("");
    socialsWrap.innerHTML = socialsHtml;

    const footerSocials = document.getElementById("footer-socials");
    if (footerSocials) footerSocials.innerHTML = socialsHtml || `<span style="opacity:.6">Add links in admin</span>`;

    const mapFrame = document.getElementById("contact-map");
    mapFrame.setAttribute("src", c.mapEmbedSrc || "");

    const newsletterForm = document.getElementById("newsletter-form");
    if (newsletterForm && !newsletterForm.dataset.bound) {
      newsletterForm.dataset.bound = "true";
      newsletterForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const email = document.getElementById("newsletter-email").value;
        window.location.href = `mailto:${c.email}?subject=${encodeURIComponent("Newsletter signup")}&body=${encodeURIComponent("Please add me to the Lumi Liv mailing list: " + email)}`;
      });
    }
  }

  // Runs each section independently — if one section's data is malformed
  // (e.g. from a hand-edit to content.json), it falls back to the built-in
  // defaults for just that section instead of leaving it (and everything
  // rendered after it) blank.
  function renderSection(label, fn, content) {
    try {
      fn(content);
    } catch (e) {
      console.error(`Failed to render "${label}" section from content.json — using built-in defaults for it instead.`, e);
      try { fn(DEFAULT_CONTENT); } catch (e2) { console.error(`Built-in default for "${label}" also failed to render.`, e2); }
    }
  }

  function render(content) {
    renderSection("hero", renderHero, content);
    renderSection("founder", renderFounder, content);
    renderSection("services", renderServices, content);
    renderSection("gallery", renderGallery, content);
    renderSection("occasions", renderOccasions, content);
    renderSection("banner", renderBanner, content);
    renderSection("lifestyle", renderLifestyle, content);
    renderSection("contact", renderContact, content);

    document.getElementById("year").textContent = new Date().getFullYear();
    document.dispatchEvent(new CustomEvent("lumiliv:content-ready"));
  }

  function showLoadWarning() {
    const bar = document.createElement("div");
    bar.textContent = "⚠ Could not load content.json — showing built-in default text. Check that you're serving this folder (not a parent/child folder) from your local server.";
    bar.style.cssText = "position:fixed;top:0;left:0;right:0;z-index:999;background:#B3402B;color:#fff;font:13px/1.4 sans-serif;padding:8px 16px;text-align:center;";
    document.body.prepend(bar);
  }

  function loadContent() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        render(JSON.parse(stored));
        return;
      } catch (e) {
        console.warn("Stored content invalid, falling back to content.json", e);
      }
    }
    fetch("content.json?t=" + Date.now(), { cache: "no-store" })
      .then((res) => {
        if (!res.ok) throw new Error("content.json responded with " + res.status);
        return res.json();
      })
      .then(render)
      .catch((err) => {
        console.error("Failed to load content.json — using embedded defaults instead.", err);
        render(DEFAULT_CONTENT);
        showLoadWarning();
      });
  }

  loadContent();
})();

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
      image: ""
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

  function render(content) {
    // Hero
    document.getElementById("hero-eyebrow").textContent = content.hero.eyebrow;
    document.getElementById("hero-headline").textContent = content.hero.headline;
    document.getElementById("hero-subhead").textContent = content.hero.subhead;
    const cta = document.getElementById("hero-cta");
    cta.textContent = content.hero.ctaLabel;
    cta.setAttribute("href", content.hero.ctaLink || "#contact");

    function renderLoopCol(elId, items) {
      const wrap = document.getElementById(elId);
      if (!wrap || !items || !items.length) return;
      const tilesHtml = items.map((item) =>
        `<div class="hero-visual-tile">${mediaFill(item.image, item.alt)}</div>`
      ).join("");
      // duplicate the set so the loop can scroll a full 50% and land back seamlessly
      wrap.innerHTML = tilesHtml + tilesHtml;
    }
    renderLoopCol("hero-col-up", content.hero.imagesColUp);
    renderLoopCol("hero-col-down", content.hero.imagesColDown);

    // Founder note
    document.getElementById("founder-body").textContent = content.founder.body;
    document.getElementById("founder-signature").textContent = "— " + content.founder.name;
    const founderImg = document.getElementById("founder-image");
    const founderPh = document.getElementById("founder-placeholder");
    if (content.founder.image) {
      founderImg.src = content.founder.image;
      founderImg.style.display = "";
      founderPh.style.display = "none";
    } else {
      founderImg.style.display = "none";
      founderPh.style.display = "";
    }

    // Services
    document.getElementById("services-heading").textContent = content.services.heading;
    document.getElementById("services-intro").textContent = content.services.intro;
    const stitchIcons = [
      '<svg viewBox="0 0 24 24"><line class="draw" x1="4" y1="20" x2="19" y2="5"/><circle cx="19" cy="5" r="1.4" fill="currentColor" stroke="none"/></svg>',
      '<svg viewBox="0 0 24 24"><path class="draw" d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.8 2.8M15.2 15.2L18 18M6 18l2.8-2.8M15.2 8.8L18 6"/></svg>',
      '<svg viewBox="0 0 24 24"><path class="draw" d="M2 12l3.5-6 3.5 6 3.5-6 3.5 6 3.5-6"/></svg>',
      '<svg viewBox="0 0 24 24"><path class="draw" d="M4 20L15 4M15 4h-5M15 4v5"/></svg>'
    ];
    const svcWrap = document.getElementById("services-list");
    svcWrap.innerHTML = content.services.items.map((item, i) => {
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

    // Gallery
    document.getElementById("gallery-heading").textContent = content.gallery.heading;
    const galWrap = document.getElementById("gallery-grid");
    galWrap.innerHTML = content.gallery.items.map((item, i) => {
      return `
        <div class="gallery-tile g${i + 1} reveal" tabindex="0">
          ${mediaFill(item.image, item.alt)}
        </div>`;
    }).join("");

    // Occasions
    const occWrap = document.getElementById("occasions-row");
    occWrap.innerHTML = content.occasions.items.map((item) => `
      <div class="occasion-item reveal">
        <div class="occasion-circle">${mediaFill(item.image, item.label)}</div>
        <span class="occasion-label">${escapeHtml(item.label)}</span>
      </div>`).join("");

    // Accent banner
    document.getElementById("banner-text").textContent = content.banner.text;

    // Lifestyle strip
    const lifeWrap = document.getElementById("lifestyle-strip");
    lifeWrap.innerHTML = content.lifestyle.images.map((item) => `
      <div class="lifestyle-tile">${mediaFill(item.image, item.alt)}</div>`).join("");
    document.getElementById("lifestyle-text").textContent = content.lifestyle.text;
    const lifeCta = document.getElementById("lifestyle-cta-btn");
    lifeCta.textContent = content.lifestyle.ctaLabel;
    lifeCta.setAttribute("href", content.lifestyle.ctaLink || "#");

    // Contact
    const c = content.contact;
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

    const socialIcons = { instagram: "IG", facebook: "FB", pinterest: "PN", behance: "BE" };
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

    document.getElementById("year").textContent = new Date().getFullYear();

    const newsletterForm = document.getElementById("newsletter-form");
    if (newsletterForm && !newsletterForm.dataset.bound) {
      newsletterForm.dataset.bound = "true";
      newsletterForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const email = document.getElementById("newsletter-email").value;
        window.location.href = `mailto:${c.email}?subject=${encodeURIComponent("Newsletter signup")}&body=${encodeURIComponent("Please add me to the Lumi Liv mailing list: " + email)}`;
      });
    }

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

(function () {
  const STORAGE_KEY = "lumiliv_content";
  let content = null;
  let defaults = null;

  const $ = (id) => document.getElementById(id);

  function fileToDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  function imageField(currentUrl, onChange) {
    const wrap = document.createElement("div");
    wrap.className = "image-field";
    wrap.innerHTML = `
      <img class="image-preview" src="${currentUrl || ""}" style="${currentUrl ? "" : "display:none;"}">
      <input type="file" accept="image/*">
      <button type="button" class="clear-img" style="${currentUrl ? "" : "display:none;"}">Remove image</button>
    `;
    const img = wrap.querySelector("img");
    const fileInput = wrap.querySelector("input[type=file]");
    const clearBtn = wrap.querySelector(".clear-img");

    fileInput.addEventListener("change", async () => {
      const file = fileInput.files[0];
      if (!file) return;
      const dataUrl = await fileToDataUrl(file);
      img.src = dataUrl;
      img.style.display = "";
      clearBtn.style.display = "";
      onChange(dataUrl);
    });
    clearBtn.addEventListener("click", () => {
      img.style.display = "none";
      img.src = "";
      clearBtn.style.display = "none";
      fileInput.value = "";
      onChange("");
    });
    return wrap;
  }

  function buildHeroImageFields() {
    const buildCol = (elId, items) => {
      const wrap = $(elId);
      wrap.innerHTML = "";
      items.forEach((item, i) => {
        const block = document.createElement("div");
        block.className = "item-block";
        block.innerHTML = `<h3>Image ${i + 1}</h3>`;
        block.appendChild(imageField(item.image, (url) => item.image = url));
        wrap.appendChild(block);
      });
    };
    buildCol("hero-up-fields", content.hero.imagesColUp);
    buildCol("hero-down-fields", content.hero.imagesColDown);
  }

  function buildFounderField() {
    const wrap = $("founder-image-field");
    wrap.innerHTML = "";
    wrap.appendChild(imageField(content.founder.image, (url) => content.founder.image = url));
  }

  function buildOccasionsFields() {
    const wrap = $("occasions-fields");
    wrap.innerHTML = "";
    content.occasions.items.forEach((item, i) => {
      const block = document.createElement("div");
      block.className = "item-block";
      block.innerHTML = `
        <h3>Circle ${i + 1}</h3>
        <label>Label <input type="text" data-idx="${i}" class="occ-label"></label>
      `;
      block.querySelector(".occ-label").value = item.label;
      block.querySelector(".occ-label").addEventListener("input", (e) => item.label = e.target.value);
      block.appendChild(imageField(item.image, (url) => item.image = url));
      wrap.appendChild(block);
    });
  }

  function buildLifestyleFields() {
    const wrap = $("lifestyle-fields");
    wrap.innerHTML = "";
    content.lifestyle.images.forEach((item, i) => {
      const block = document.createElement("div");
      block.className = "item-block";
      block.innerHTML = `<h3>Image ${i + 1}</h3>`;
      block.appendChild(imageField(item.image, (url) => item.image = url));
      wrap.appendChild(block);
    });
  }

  function buildServiceFields() {
    const wrap = $("services-fields");
    wrap.innerHTML = "";
    content.services.items.forEach((item, i) => {
      const block = document.createElement("div");
      block.className = "item-block";
      block.innerHTML = `
        <h3>Panel ${i + 1}</h3>
        <label>Tag <span class="hint">(short label, e.g. CO2 LASER)</span> <input type="text" data-idx="${i}" class="svc-tag" maxlength="20"></label>
        <label>Title <input type="text" data-idx="${i}" class="svc-title"></label>
        <label>Description <textarea rows="2" data-idx="${i}" class="svc-body"></textarea></label>
        <label>Photo</label>
      `;
      block.querySelector(".svc-tag").value = item.tag || "";
      block.querySelector(".svc-title").value = item.title;
      block.querySelector(".svc-body").value = item.body;
      block.querySelector(".svc-tag").addEventListener("input", (e) => item.tag = e.target.value);
      block.querySelector(".svc-title").addEventListener("input", (e) => item.title = e.target.value);
      block.querySelector(".svc-body").addEventListener("input", (e) => item.body = e.target.value);
      block.appendChild(imageField(item.image, (url) => item.image = url));
      wrap.appendChild(block);
    });
  }

  function buildGalleryFields() {
    const wrap = $("gallery-fields");
    wrap.innerHTML = "";
    content.gallery.items.forEach((item, i) => {
      const block = document.createElement("div");
      block.className = "item-block";
      block.innerHTML = `
        <h3>Tile ${i + 1}</h3>
        <label>Description <span class="hint">(for accessibility — not shown on the tile)</span>
          <input type="text" data-idx="${i}" class="gal-alt">
        </label>
      `;
      block.querySelector(".gal-alt").value = item.alt;
      block.querySelector(".gal-alt").addEventListener("input", (e) => item.alt = e.target.value);
      block.appendChild(imageField(item.image, (url) => item.image = url));
      wrap.appendChild(block);
    });
  }

  function fillStaticFields() {
    $("f-hero-eyebrow").value = content.hero.eyebrow;
    $("f-hero-headline").value = content.hero.headline;
    $("f-hero-subhead").value = content.hero.subhead;
    $("f-hero-cta").value = content.hero.ctaLabel;

    $("f-founder-name").value = content.founder.name;
    $("f-founder-body").value = content.founder.body;

    $("f-services-intro").value = content.services.intro || "";

    $("f-gallery-heading").value = content.gallery.heading;

    $("f-banner-text").value = content.banner.text;

    $("f-lifestyle-text").value = content.lifestyle.text;
    $("f-lifestyle-cta-label").value = content.lifestyle.ctaLabel;
    $("f-lifestyle-cta-link").value = content.lifestyle.ctaLink || "";

    $("f-contact-headline").value = content.contact.headline;
    $("f-contact-body").value = content.contact.body;
    $("f-contact-whatsapp").value = content.contact.whatsappNumber;
    $("f-contact-phone-display").value = content.contact.phoneDisplay;
    $("f-contact-email").value = content.contact.email;
    $("f-contact-address").value = content.contact.address;
    $("f-contact-website").value = content.contact.website;
    $("f-social-instagram").value = content.contact.socials.instagram || "";
    $("f-social-facebook").value = content.contact.socials.facebook || "";
    $("f-social-pinterest").value = content.contact.socials.pinterest || "";
    $("f-social-behance").value = content.contact.socials.behance || "";
    $("f-map-src").value = content.contact.mapEmbedSrc || "";
    $("map-preview").src = content.contact.mapEmbedSrc || "";

    buildHeroImageFields();
    buildFounderField();
    buildServiceFields();
    buildGalleryFields();
    buildOccasionsFields();
    buildLifestyleFields();
  }

  function bindStaticInputs() {
    $("f-hero-eyebrow").addEventListener("input", (e) => content.hero.eyebrow = e.target.value);
    $("f-hero-headline").addEventListener("input", (e) => content.hero.headline = e.target.value);
    $("f-hero-subhead").addEventListener("input", (e) => content.hero.subhead = e.target.value);
    $("f-hero-cta").addEventListener("input", (e) => content.hero.ctaLabel = e.target.value);

    $("f-founder-name").addEventListener("input", (e) => content.founder.name = e.target.value);
    $("f-founder-body").addEventListener("input", (e) => content.founder.body = e.target.value);

    $("f-services-intro").addEventListener("input", (e) => content.services.intro = e.target.value);

    $("f-gallery-heading").addEventListener("input", (e) => content.gallery.heading = e.target.value);

    $("f-banner-text").addEventListener("input", (e) => content.banner.text = e.target.value);

    $("f-lifestyle-text").addEventListener("input", (e) => content.lifestyle.text = e.target.value);
    $("f-lifestyle-cta-label").addEventListener("input", (e) => content.lifestyle.ctaLabel = e.target.value);
    $("f-lifestyle-cta-link").addEventListener("input", (e) => content.lifestyle.ctaLink = e.target.value);

    $("f-contact-headline").addEventListener("input", (e) => content.contact.headline = e.target.value);
    $("f-contact-body").addEventListener("input", (e) => content.contact.body = e.target.value);
    $("f-contact-whatsapp").addEventListener("input", (e) => content.contact.whatsappNumber = e.target.value.replace(/[^0-9]/g, ""));
    $("f-contact-phone-display").addEventListener("input", (e) => content.contact.phoneDisplay = e.target.value);
    $("f-contact-email").addEventListener("input", (e) => content.contact.email = e.target.value);
    $("f-contact-address").addEventListener("input", (e) => content.contact.address = e.target.value);
    $("f-contact-website").addEventListener("input", (e) => content.contact.website = e.target.value);
    $("f-social-instagram").addEventListener("input", (e) => content.contact.socials.instagram = e.target.value);
    $("f-social-facebook").addEventListener("input", (e) => content.contact.socials.facebook = e.target.value);
    $("f-social-pinterest").addEventListener("input", (e) => content.contact.socials.pinterest = e.target.value);
    $("f-social-behance").addEventListener("input", (e) => content.contact.socials.behance = e.target.value);

    $("f-map-src").addEventListener("input", (e) => {
      content.contact.mapEmbedSrc = e.target.value;
      $("map-preview").src = e.target.value;
    });

    $("btn-build-map").addEventListener("click", () => {
      const query = $("f-map-search").value.trim();
      if (!query) return;
      const src = `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
      content.contact.mapEmbedSrc = src;
      $("f-map-src").value = src;
      $("map-preview").src = src;
    });

    $("btn-save").addEventListener("click", saveContent);
    $("btn-reset").addEventListener("click", resetContent);
    $("btn-download").addEventListener("click", downloadContent);
  }

  function saveContent() {
    const toast = $("save-toast");
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
      const verify = localStorage.getItem(STORAGE_KEY);
      if (!verify) throw new Error("Write did not persist");
      toast.textContent = `Saved at ${new Date().toLocaleTimeString()} — this browser's preview is now updated. Open the site in a tab on this same address (${location.origin}) and refresh it.`;
      toast.style.background = "";
    } catch (err) {
      toast.textContent = "⚠ Could not save — your browser is blocking local storage here (private/incognito mode, or a strict privacy setting). Try a normal browser window, or use \"Download content.json\" instead.";
      toast.style.background = "#8a2e1f";
      console.error("Save failed:", err);
    }
    toast.hidden = false;
    clearTimeout(saveContent._t);
    saveContent._t = setTimeout(() => (toast.hidden = true), 6000);
  }

  function resetContent() {
    if (!confirm("Reset every field back to the original defaults? This clears your saved edits in this browser.")) return;
    localStorage.removeItem(STORAGE_KEY);
    content = JSON.parse(JSON.stringify(defaults));
    fillStaticFields();
  }

  function downloadContent() {
    saveContent();
    const blob = new Blob([JSON.stringify(content, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "content.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  function init() {
    const stored = localStorage.getItem(STORAGE_KEY);
    fetch("content.json")
      .then((res) => res.json())
      .then((json) => {
        defaults = json;
        content = stored ? JSON.parse(stored) : JSON.parse(JSON.stringify(json));
        fillStaticFields();
        bindStaticInputs();
      });
  }

  init();
})();

(function () {
  const STORAGE_KEY = "lumiliv_content";

  const DEFAULT_POLICIES = {
    privacy: {
      title: "Privacy Policy",
      items: [
        { heading: "Information We Collect", body: "When you enquire, place an order, or contact us, we collect basic details you provide — your name, phone number, email, shipping address, and any custom design details you share with us." },
        { heading: "How We Use It", body: "We use your information only to process orders, respond to enquiries, arrange delivery, and occasionally share updates about new collections if you've opted in." },
        { heading: "Sharing With Third Parties", body: "We don't sell your information. We only share what's necessary with delivery partners and payment processors to complete your order." },
        { heading: "Cookies", body: "This site may use basic cookies to remember preferences and understand how visitors use the site. No sensitive data is stored this way." },
        { heading: "Data Security", body: "We take reasonable steps to protect your information, but no online system is ever 100% secure. Please avoid sharing sensitive payment details over chat or email." },
        { heading: "Your Rights", body: "You can request to see, correct, or delete the information we hold about you at any time by reaching out to us directly." }
      ]
    },
    terms: {
      title: "Terms & Conditions",
      items: [
        { heading: "Custom Orders", body: "Custom and made-to-order pieces are crafted specifically to your specifications. Please review your design details carefully before confirming — production begins shortly after approval." },
        { heading: "Payment", body: "Full or partial advance payment may be required before production begins on custom orders, as communicated to you at the time of enquiry." },
        { heading: "Shipping & Delivery", body: "Timelines vary by product and customization complexity. We'll share an estimated delivery window when your order is confirmed." },
        { heading: "Returns & Exchanges", body: "Because most pieces are made to order, custom items are generally not eligible for return or exchange unless there's a manufacturing defect." },
        { heading: "Intellectual Property", body: "All designs, branding, and product photography on this site belong to Lumi Liv and may not be reproduced without permission." },
        { heading: "Limitation of Liability", body: "We aim for accuracy in every piece we make, but minor natural variation is normal in handcrafted leather and acrylic work and isn't considered a defect." }
      ]
    }
  };

  function escapeHtml(str) {
    return (str || "").replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[c]));
  }

  function render(policies) {
    const params = new URLSearchParams(window.location.search);
    const doc = params.get("doc") === "terms" ? "terms" : "privacy";
    const data = (policies && policies[doc]) ? policies[doc] : DEFAULT_POLICIES[doc];

    document.getElementById("page-title").textContent = data.title + " — Lumi Liv";
    document.getElementById("policy-title").textContent = data.title;

    const wrap = document.getElementById("policy-items");
    wrap.innerHTML = (data.items || [])
      .filter((item) => item && item.heading)
      .map((item, i) => `
        <div class="policy-item">
          <span class="policy-num">${String(i + 1).padStart(2, "0")}</span>
          <span class="policy-heading">${escapeHtml(item.heading)}</span>
          <p class="policy-desc">${escapeHtml(item.body)}</p>
        </div>`)
      .join("");

    document.getElementById("year").textContent = new Date().getFullYear();
  }

  function loadContent() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        render(parsed.policies);
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
      .then((json) => render(json.policies))
      .catch((err) => {
        console.error("Failed to load content.json — using built-in default policy text.", err);
        render(DEFAULT_POLICIES);
      });
  }

  loadContent();
})();

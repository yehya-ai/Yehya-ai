// =========================================
// Requirement: JavaScript DOM Manipulation
// =========================================

const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Toggle collapse icon animation + Auto-close on click outside
const toggler = document.querySelector(".navbar-toggler");
const navbarCollapse = document.querySelector(".navbar-collapse");
const navbar = document.querySelector(".navbar");

if (toggler && navbarCollapse) {
  toggler.addEventListener("click", function () {
    // Toggle aria-expanded is handled by Bootstrap
    // Toggler will update automatically based on collapse state
  });

  // Close menu when clicking outside of navbar
  document.addEventListener("click", function (event) {
    const isClickInsideNavbar = navbar.contains(event.target);
    const isMenuOpen = navbarCollapse.classList.contains("show");

    if (!isClickInsideNavbar && isMenuOpen) {
      toggler.click(); // Simulate click to close menu
    }
  });
}

// ---------------- search functionality ----------------
// simple snippet generator for search results
function getSnippet(text, query) {
  const lower = text.toLowerCase();
  const idx = lower.indexOf(query.toLowerCase());
  if (idx === -1) return "";
  const start = Math.max(0, idx - 30);
  const end = Math.min(text.length, idx + query.length + 30);
  return "..." + text.slice(start, end).trim() + "...";
}

// perform search across static pages
function searchSite(query) {
  const pages = ["index.html", "services.html", "contact.html"];
  const results = [];

  // If running from file://, fetch may be blocked — use embedded index instead
  if (window.location.protocol === "file:") {
    pages.forEach((url) => {
      const entry = SITE_INDEX[url];
      if (entry && entry.text.toLowerCase().includes(query.toLowerCase())) {
        results.push({
          page: url,
          title: entry.title,
          snippet: getSnippet(entry.text, query),
        });
      }
    });
    showResults(results, query);
    return;
  }

  // Otherwise try fetching pages (works when served via http/https)
  const promises = pages.map((url) =>
    fetch(url)
      .then((r) => r.text())
      .then((html) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        const text = doc.body.textContent || "";
        if (text.toLowerCase().includes(query.toLowerCase())) {
          const titleEl = doc.querySelector("title");
          const title = titleEl ? titleEl.textContent : url;
          results.push({
            page: url,
            title: title,
            snippet: getSnippet(text, query),
          });
        }
      })
      .catch(() => {
        // on failure, fallback to embedded index entry if present
        const entry = SITE_INDEX[url];
        if (entry && entry.text.toLowerCase().includes(query.toLowerCase())) {
          results.push({
            page: url,
            title: entry.title,
            snippet: getSnippet(entry.text, query),
          });
        }
      }),
  );
  Promise.all(promises).then(() => {
    if (results.length === 1) {
      // automatically navigate when only one page matches
      window.location.href = results[0].page;
    } else {
      showResults(results, query);
    }
  });
}

// hook up form submit
const searchForm = document.getElementById("searchForm");
if (searchForm) {
  searchForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const input = searchForm.querySelector('input[type="search"]');
    const q = input.value.trim();
    if (q) {
      searchSite(q);
      input.value = "";
    }
  });
}

// keyboard shortcuts: '/' or Ctrl+K focuses the search field
document.addEventListener("keydown", (e) => {
  if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
  if (e.key === "/" || (e.ctrlKey && e.key.toLowerCase() === "k")) {
    e.preventDefault();
    const input = document.querySelector('#searchForm input[type="search"]');
    if (input) {
      input.focus();
    }
  }
});

// allow escape to close search modal if open
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    const modalEl = document.getElementById("searchModal");
    if (modalEl && modalEl.classList.contains("show")) {
      const bsModal = bootstrap.Modal.getInstance(modalEl);
      if (bsModal) bsModal.hide();
    }
  }
});

// =========================
// Prompt Library Filters
// =========================
const filterButtons = document.querySelectorAll(".filter-btn");
const promptItems = document.querySelectorAll(".prompt-item");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    const filter = button.getAttribute("data-filter");

    promptItems.forEach((item) => {
      const category = item.getAttribute("data-category");

      if (filter === "all" || category === filter) {
        item.classList.remove("hide");
      } else {
        item.classList.add("hide");
      }
    });
  });
});

// =========================
// Copy Prompt Button
// =========================
const copyButtons = document.querySelectorAll(".copy-btn");

copyButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const targetId = button.getAttribute("data-copy");
    const text = document.getElementById(targetId).innerText;

    navigator.clipboard.writeText(text).then(() => {
      const originalText = button.innerHTML;
      button.innerHTML = '<i class="fa-solid fa-check"></i> تم النسخ';
      setTimeout(() => {
        button.innerHTML = originalText;
      }, 1500);
    });
  });
});
// =========================
// Prompt Library Filters
// =========================
document.addEventListener("DOMContentLoaded", function () {
  const filterButtons = document.querySelectorAll(".filter-btn");
  const promptItems = document.querySelectorAll(".prompt-item");

  filterButtons.forEach((button) => {
    button.addEventListener("click", function () {
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      this.classList.add("active");

      const filter = this.getAttribute("data-filter");

      promptItems.forEach((item) => {
        const category = item.getAttribute("data-category");

        if (filter === "all" || category === filter) {
          item.classList.remove("hide");
        } else {
          item.classList.add("hide");
        }
      });
    });
  });
});

copyButtons.forEach((button) => {
  button.addEventListener("click", function () {
    const targetId = this.getAttribute("data-copy");
    const text = document.getElementById(targetId).innerText;

    navigator.clipboard.writeText(text).then(() => {
      const original = this.innerHTML;
      this.innerHTML = '<i class="fa-solid fa-check"></i> تم النسخ';
      setTimeout(() => {
        this.innerHTML = original;
      }, 1500);
    });
  });
});

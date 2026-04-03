/* ── Helpers de DOM ── */

export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}

export function qsa(selector, parent = document) {
  return Array.from(parent.querySelectorAll(selector));
}

export function clearElement(element) {
  if (!element) return;
  element.innerHTML = "";
}

export function createElement(tagName, options = {}) {
  const element = document.createElement(tagName);

  if (options.className) element.className = options.className;
  if (options.text) element.textContent = options.text;
  if (options.html) element.innerHTML = options.html;

  if (options.attrs && typeof options.attrs === "object") {
    Object.entries(options.attrs).forEach(([key, value]) => {
      if (value === undefined || value === null) return;
      element.setAttribute(key, String(value));
    });
  }

  if (options.dataset && typeof options.dataset === "object") {
    Object.entries(options.dataset).forEach(([key, value]) => {
      element.dataset[key] = String(value);
    });
  }

  return element;
}

export function appendChildren(parent, children) {
  const safeChildren = Array.isArray(children) ? children : [children];
  safeChildren.forEach((child) => { if (child) parent.appendChild(child); });
}

/* ── Formatters (fusionado) ── */

export function truncateText(text = "", maxLength = 120) {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trim()}...`;
}

export function formatAuthorName(user) {
  if (!user) return "Autor desconocido";
  const firstName = user.firstName || "";
  const lastName = user.lastName || "";
  const fullName = `${firstName} ${lastName}`.trim();
  return fullName || user.username || "Autor desconocido";
}

export function toTitleCase(text = "") {
  return text
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

import { clearElement, createElement, truncateText } from "../utils/dom.js";

/* ── Tarjetas de publicaciones ── */

export function renderPostCard(post, handlers = {}) {
  const card = createElement("article", { className: "post-card" });
  const badge = createElement("span", { className: "post-meta-id", text: `Post #${post.id}` });
  const title = createElement("h3", { className: "post-title", text: post.title });
  const excerpt = createElement("p", { className: "post-excerpt", text: truncateText(post.body, 140) });
  const author = createElement("p", { className: "post-author", text: `Autor: ${post.authorName}` });

  const tagsWrap = createElement("div", { className: "post-tags" });
  post.tags.slice(0, 3).forEach((tag) => {
    tagsWrap.appendChild(createElement("span", { className: "tag-chip", text: `#${tag}` }));
  });

  const actions = createElement("div", { className: "post-actions" });

  const detailBtn = createElement("button", { className: "btn btn-primary btn-sm", text: "Ver más" });
  detailBtn.addEventListener("click", () => { handlers.onView?.(post.id); });

  const deleteBtn = createElement("button", { className: "btn btn-danger btn-sm", text: "Eliminar" });
  deleteBtn.addEventListener("click", () => { handlers.onDelete?.(post.id); });

  actions.append(detailBtn, deleteBtn);
  card.append(badge, title, excerpt, author, tagsWrap, actions);
  return card;
}

export function renderPostList(container, posts, handlers = {}) {
  clearElement(container);
  const fragment = document.createDocumentFragment();
  posts.forEach((post) => { fragment.appendChild(renderPostCard(post, handlers)); });
  container.appendChild(fragment);
}

/* ── Paginación (fusionado) ── */

function buildPageWindow(currentPage, totalPages) {
  const pages = [];
  const start = Math.max(1, currentPage - 2);
  const end = Math.min(totalPages, start + 4);
  for (let page = start; page <= end; page += 1) {
    pages.push(page);
  }
  return pages;
}

export function renderPagination(container, meta, onPageChange) {
  clearElement(container);
  if (meta.totalPages <= 1) return;

  const nav = createElement("nav", {
    className: "pagination",
    attrs: { "aria-label": "Paginación de publicaciones" }
  });

  const prevButton = createElement("button", {
    className: "btn btn-secondary btn-sm",
    text: "Anterior",
    attrs: { type: "button", disabled: meta.page <= 1 }
  });
  prevButton.addEventListener("click", () => onPageChange(meta.page - 1));
  nav.appendChild(prevButton);

  buildPageWindow(meta.page, meta.totalPages).forEach((page) => {
    const pageButton = createElement("button", {
      className: `page-btn ${page === meta.page ? "active" : ""}`,
      text: String(page),
      attrs: { type: "button" }
    });
    pageButton.addEventListener("click", () => onPageChange(page));
    nav.appendChild(pageButton);
  });

  const nextButton = createElement("button", {
    className: "btn btn-secondary btn-sm",
    text: "Siguiente",
    attrs: { type: "button", disabled: meta.page >= meta.totalPages }
  });
  nextButton.addEventListener("click", () => onPageChange(meta.page + 1));
  nav.appendChild(nextButton);

  container.appendChild(nav);
}

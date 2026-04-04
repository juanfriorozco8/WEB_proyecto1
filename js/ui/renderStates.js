import { clearElement, createElement } from "../utils/dom.js";

/* ── Estados ── */

function createStateBlock(type, title, message) {
  const wrapper = createElement("article", { className: `state-card state-${type}` });
  const titleEl = createElement("h3", { className: "state-title", text: title });
  const textEl = createElement("p", { className: "state-message", text: message });
  wrapper.append(titleEl, textEl);
  return wrapper;
}

export function renderFeedbackBanner(container, ui) {
  clearElement(container);
  if (ui.error) {
    container.appendChild(createStateBlock("error", "Error", ui.error));
    return;
  }
  if (ui.success) {
    container.appendChild(createStateBlock("success", "Éxito", ui.success));
  }
}

export function renderLoadingState(container, message = "Cargando información...") {
  clearElement(container);
  container.appendChild(createStateBlock("loading", "Cargando", message));
}

export function renderErrorState(container, message, onRetry) {
  clearElement(container);
  const block = createStateBlock("error", "Error", message);
  if (typeof onRetry === "function") {
    const retryButton = createElement("button", { className: "btn btn-secondary", text: "Reintentar" });
    retryButton.addEventListener("click", onRetry);
    block.appendChild(retryButton);
  }
  container.appendChild(block);
}

export function renderEmptyState(container, message = "No hay resultados.") {
  clearElement(container);
  container.appendChild(createStateBlock("empty", "Sin resultados", message));
}

export function showToast(type, message, duration = 3000) {
  const toastRoot = document.getElementById("toast-root");
  if (!toastRoot) return;
  const toast = createElement("div", {
    className: `toast toast-${type === "error" ? "error" : "success"}`,
    text: message
  });
  toastRoot.appendChild(toast);
  window.setTimeout(() => { toast.remove(); }, duration);
}

/* ── Detalle de publicación (fusionado) ── */

export function renderPostDetail(container, post, options = {}) {
  clearElement(container);

  const article = createElement("article", { className: "detail-card surface-panel stack" });
  const top = createElement("div", { className: "detail-top" });
  const title = createElement("h2", { className: "detail-title", text: post.title });
  const meta = createElement("p", {
    className: "detail-meta",
    text: `Autor: ${post.authorName} · Post #${post.id}`
  });
  top.append(title, meta);

  const body = createElement("p", { className: "detail-body", text: post.body });
  const tags = createElement("div", { className: "post-tags" });
  post.tags.forEach((tag) => {
    tags.appendChild(createElement("span", { className: "tag-chip", text: `#${tag}` }));
  });

  const stats = createElement("p", {
    className: "detail-stats",
    text: `Reacciones: ${post.reactions} · Vistas: ${post.views}`
  });

  const actions = createElement("div", { className: "detail-actions" });
  const backBtn = createElement("button", { className: "btn btn-secondary", text: "Volver al inicio" });
  backBtn.addEventListener("click", () => options.onBack?.());

  const deleteBtn = createElement("button", { className: "btn btn-danger", text: "Eliminar" });
  deleteBtn.addEventListener("click", () => options.onDelete?.(post.id));

  actions.append(backBtn, deleteBtn);
  article.append(top, body, tags, stats, actions);
  container.appendChild(article);
}

/* ── Filtros (fusionado) ── */

export function renderFilters(container, options) {
  clearElement(container);

  const form = createElement("form", { className: "filters-form surface-panel" });

  const queryControl = createElement("div", { className: "filter-control" });
  const queryLabel = createElement("label", { text: "Buscar por texto" });
  queryLabel.setAttribute("for", "filter-query");
  const queryInput = createElement("input", {
    attrs: {
      id: "filter-query",
      name: "query",
      type: "search",
      placeholder: "Título o contenido...",
      value: options.filters.query || ""
    }
  });
  queryControl.append(queryLabel, queryInput);

  const authorControl = createElement("div", { className: "filter-control" });
  const authorLabel = createElement("label", { text: "Autor" });
  authorLabel.setAttribute("for", "filter-author");
  const authorSelect = createElement("select", { attrs: { id: "filter-author", name: "userId" } });
  authorSelect.appendChild(createElement("option", { text: "Todos", attrs: { value: "" } }));
  options.authors.forEach((author) => {
    const option = createElement("option", { text: author.label, attrs: { value: author.id } });
    if (String(options.filters.userId) === String(author.id)) option.selected = true;
    authorSelect.appendChild(option);
  });
  authorControl.append(authorLabel, authorSelect);

  const tagControl = createElement("div", { className: "filter-control" });
  const tagLabel = createElement("label", { text: "Tag" });
  tagLabel.setAttribute("for", "filter-tag");
  const tagSelect = createElement("select", { attrs: { id: "filter-tag", name: "tag" } });
  tagSelect.appendChild(createElement("option", { text: "Todos", attrs: { value: "" } }));
  options.tags.forEach((tag) => {
    const option = createElement("option", { text: `#${tag}`, attrs: { value: tag } });
    if (options.filters.tag === tag) option.selected = true;
    tagSelect.appendChild(option);
  });
  tagControl.append(tagLabel, tagSelect);

  const sortControl = createElement("div", { className: "filter-control" });
  const sortLabel = createElement("label", { text: "Orden" });
  sortLabel.setAttribute("for", "filter-sort");
  const sortSelect = createElement("select", { attrs: { id: "filter-sort", name: "sort" } });
  [
    { value: "newest", label: "Más recientes" },
    { value: "oldest", label: "Más antiguos" },
    { value: "title-asc", label: "Título A-Z" },
    { value: "title-desc", label: "Título Z-A" }
  ].forEach((sortItem) => {
    const option = createElement("option", { text: sortItem.label, attrs: { value: sortItem.value } });
    if (options.filters.sort === sortItem.value) option.selected = true;
    sortSelect.appendChild(option);
  });
  sortControl.append(sortLabel, sortSelect);

  const actions = createElement("div", { className: "filter-actions" });
  const applyBtn = createElement("button", { className: "btn btn-primary", text: "Aplicar" });
  applyBtn.setAttribute("type", "submit");
  const resetBtn = createElement("button", { className: "btn btn-secondary", text: "Limpiar" });
  resetBtn.setAttribute("type", "button");
  resetBtn.addEventListener("click", () => options.onReset?.());
  actions.append(applyBtn, resetBtn);

  form.append(queryControl, authorControl, tagControl, sortControl, actions);
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    options.onApply?.({
      query: String(formData.get("query") || "").trim(),
      userId: String(formData.get("userId") || ""),
      tag: String(formData.get("tag") || ""),
      sort: String(formData.get("sort") || "newest")
    });
  });

  container.appendChild(form);
}

/* ── Formulario de creación (fusionado) ── */

export function renderFormErrors(fields, errors) {
  Object.entries(fields).forEach(([fieldName, fieldElement]) => {
    if (!fieldElement.error) return;
    fieldElement.error.textContent = errors[fieldName] || "";
  });
}

export function renderCreateForm(container, options = {}) {
  clearElement(container);

  const card = createElement("section", { className: "surface-panel create-form-card" });
  const title = createElement("h2", { className: "view-title", text: "Crear nueva publicación" });
  const subtitle = createElement("p", {
    className: "view-subtitle",
    text: "Completa el formulario y envía el POST hacia la API pública."
  });

  const form = createElement("form", { className: "create-form" });

  const titleField = buildTextField({
    id: "post-title", name: "title", label: "Título",
    placeholder: "Escribe un título claro", minLength: 5
  });
  const bodyField = buildTextAreaField({
    id: "post-body", name: "body", label: "Contenido",
    placeholder: "Describe tu publicación", minLength: 20
  });
  const userField = buildSelectField({
    id: "post-user-id", name: "userId", label: "Autor",
    options: options.users || []
  });

  const actionsDiv = createElement("div", { className: "form-actions" });
  const submitBtn = createElement("button", { className: "btn btn-primary", text: "Publicar" });
  submitBtn.setAttribute("type", "submit");
  const resetBtn = createElement("button", { className: "btn btn-secondary", text: "Limpiar" });
  resetBtn.setAttribute("type", "button");
  actionsDiv.append(submitBtn, resetBtn);

  form.append(titleField.wrap, bodyField.wrap, userField.wrap, actionsDiv);
  card.append(title, subtitle, form);
  container.appendChild(card);

  const fields = {
    title: { input: titleField.input, error: titleField.error },
    body: { input: bodyField.input, error: bodyField.error },
    userId: { input: userField.input, error: userField.error }
  };

  function setSubmitting(isSubmitting) {
    submitBtn.disabled = isSubmitting;
    submitBtn.textContent = isSubmitting ? "Publicando..." : "Publicar";
  }

  resetBtn.addEventListener("click", () => {
    form.reset();
    renderFormErrors(fields, {});
    options.onReset?.();
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const payload = {
      title: String(formData.get("title") || "").trim(),
      body: String(formData.get("body") || "").trim(),
      userId: Number(formData.get("userId"))
    };
    options.onSubmit?.({ payload, form, fields, setSubmitting });
  });
}

function buildTextField(config) {
  const wrap = createElement("div", { className: "form-control" });
  const label = createElement("label", { text: config.label });
  label.setAttribute("for", config.id);
  const input = createElement("input", {
    attrs: { id: config.id, name: config.name, type: "text", minlength: config.minLength, placeholder: config.placeholder }
  });
  const error = createElement("p", { className: "form-error" });
  wrap.append(label, input, error);
  return { wrap, input, error };
}

function buildTextAreaField(config) {
  const wrap = createElement("div", { className: "form-control" });
  const label = createElement("label", { text: config.label });
  label.setAttribute("for", config.id);
  const input = createElement("textarea", {
    attrs: { id: config.id, name: config.name, rows: 7, minlength: config.minLength, placeholder: config.placeholder }
  });
  const error = createElement("p", { className: "form-error" });
  wrap.append(label, input, error);
  return { wrap, input, error };
}

function buildSelectField(config) {
  const wrap = createElement("div", { className: "form-control" });
  const label = createElement("label", { text: config.label });
  label.setAttribute("for", config.id);
  const input = createElement("select", { attrs: { id: config.id, name: config.name } });
  input.appendChild(createElement("option", { text: "Selecciona autor", attrs: { value: "" } }));
  config.options.forEach((option) => {
    input.appendChild(createElement("option", { text: option.label, attrs: { value: option.id } }));
  });
  const error = createElement("p", { className: "form-error" });
  wrap.append(label, input, error);
  return { wrap, input, error };
}

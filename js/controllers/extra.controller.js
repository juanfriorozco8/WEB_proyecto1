import { setFilters, setPage, state } from "../core/state.js";
import { getAuthorSummary } from "../services/posts.service.js";
import { renderEmptyState, renderErrorState } from "../ui/renderStates.js";
import { createElement } from "../utils/dom.js";
import { ensureInitialDataLoaded } from "../features/home.controller.js";

function renderAuthorCards(container, summary) {
  container.innerHTML = "";
  const grid = createElement("section", { className: "authors-grid" });

  summary.forEach((author) => {
    const card = createElement("article", { className: "author-card surface-panel" });
    const name = createElement("h3", { className: "author-name", text: `${author.firstName} ${author.lastName}`.trim() });
    const email = createElement("p", { className: "author-meta", text: author.email });
    const company = createElement("p", { className: "author-meta", text: `Empresa: ${author.company || "N/A"}` });
    const totalPosts = createElement("p", { className: "author-count", text: `Publicaciones: ${author.totalPosts}` });
    const button = createElement("button", { className: "btn btn-primary btn-sm", text: "Filtrar en inicio" });

    button.addEventListener("click", () => {
      setFilters({ query: "", userId: String(author.id), tag: "", sort: "newest" });
      setPage(1);
      window.location.hash = "#/home";
    });

    card.append(name, email, company, totalPosts, button);
    grid.appendChild(card);
  });

  container.appendChild(grid);
}

export async function renderExtraView(root) {
  root.innerHTML = `
    <section class="view-shell extra-view">
      <header class="view-header">
        <div>
          <h1 class="view-title">Sección adicional: Autores</h1>
          <p class="view-subtitle">Explora autores y filtra sus publicaciones en un clic.</p>
        </div>
      </header>
      <div id="authors-state"></div>
      <section id="authors-list"></section>
    </section>
  `;

  const stateContainer = root.querySelector("#authors-state");
  const listContainer = root.querySelector("#authors-list");

  try {
    await ensureInitialDataLoaded();
  } catch (error) {
    renderErrorState(stateContainer, error.message || "No fue posible cargar la información de autores.", () => renderExtraView(root));
    return;
  }

  const summary = getAuthorSummary(state.posts, state.users);
  if (summary.length === 0) {
    renderEmptyState(stateContainer, "No hay autores con publicaciones disponibles.");
    return;
  }

  stateContainer.innerHTML = "";
  renderAuthorCards(listContainer, summary);
}

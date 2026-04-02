import {
  clearUiMessages,
  setPage,
  setFilters,
  setFilteredPosts,
  setLoading,
  setPosts,
  setUsers,
  removePostById,
  state,
  resetFilters
} from "../core/state.js";
import { fetchPosts } from "../api/posts.api.js";
import { fetchUsers } from "../api/users.api.js";
import { applyFilters, getAvailableFilterData } from "../services/filters.service.js";
import { notifyError, notifySuccess, mergePostsWithAuthors, normalizePost, normalizeUser, paginatePosts } from "../services/posts.service.js";
import { renderFilters, renderEmptyState, renderErrorState, renderFeedbackBanner, renderLoadingState, showToast } from "../ui/renderStates.js";
import { renderPagination, renderPostList } from "../ui/renderPosts.js";

export async function ensureInitialDataLoaded() {
  if (state.meta.didLoadInitialData) return;
  setLoading(true);
  try {
    const [postsResponse, usersResponse] = await Promise.all([
      fetchPosts({ limit: 300 }),
      fetchUsers({ limit: 100 })
    ]);
    const normalizedPosts = (postsResponse.posts || []).map(normalizePost);
    const normalizedUsers = (usersResponse.users || []).map(normalizeUser);
    setPosts(normalizedPosts);
    setUsers(normalizedUsers);
    state.meta.didLoadInitialData = true;
  } catch (error) {
    notifyError(error.message || "No se pudieron cargar las publicaciones.");
    throw error;
  } finally {
    setLoading(false);
  }
}

export function handleDeletePost(postId, options = {}) {
  const confirmed = window.confirm(
    "¿Deseas eliminar esta publicación? La eliminación será simulada en la interfaz."
  );
  if (!confirmed) return false;
  try {
    removePostById(postId);
    notifySuccess("Publicación eliminada correctamente (simulada en frontend).");
    showToast("success", "Publicación eliminada.");
    options.onDone?.();
    return true;
  } catch (error) {
    notifyError(error.message || "No se pudo eliminar la publicación.");
    showToast("error", "Falló la eliminación.");
    return false;
  }
}

export async function renderHomeView(root) {
  root.innerHTML = `
    <section class="view-shell home-view">
      <header class="view-header">
        <div>
          <h1 class="view-title">Explorar publicaciones</h1>
          <p class="view-subtitle">Listado dinámico con búsqueda, filtros y paginación.</p>
        </div>
      </header>
      <div id="home-feedback"></div>
      <div id="home-filters"></div>
      <div id="home-state"></div>
      <section id="home-posts" class="posts-grid"></section>
      <div id="home-pagination"></div>
    </section>
  `;

  const feedbackContainer = root.querySelector("#home-feedback");
  const filtersContainer = root.querySelector("#home-filters");
  const stateContainer = root.querySelector("#home-state");
  const postsContainer = root.querySelector("#home-posts");
  const paginationContainer = root.querySelector("#home-pagination");

  renderLoadingState(stateContainer, "Cargando publicaciones y autores...");

  try {
    await ensureInitialDataLoaded();
  } catch (error) {
    renderErrorState(stateContainer, error.message || "No se pudo cargar la información.", () => renderHomeView(root));
    return;
  }

  const enrichedPosts = mergePostsWithAuthors(state.posts, state.users);
  const filteredPosts = applyFilters(enrichedPosts, state.filters);
  setFilteredPosts(filteredPosts);

  const pageData = paginatePosts(state.filteredPosts, state.pagination.page, state.pagination.limit);
  setPage(pageData.page);

  renderFeedbackBanner(feedbackContainer, state.ui);

  const filterData = getAvailableFilterData(enrichedPosts, state.users);
  renderFilters(filtersContainer, {
    filters: state.filters,
    authors: filterData.authors,
    tags: filterData.tags,
    onApply: (filters) => { setFilters(filters); setPage(1); renderHomeView(root); },
    onReset: () => { resetFilters(); setPage(1); renderHomeView(root); }
  });

  if (pageData.items.length === 0) {
    renderEmptyState(stateContainer, "No se encontraron publicaciones con los filtros seleccionados.");
  } else {
    stateContainer.innerHTML = "";
    renderPostList(postsContainer, pageData.items, {
      onView: (postId) => { window.location.hash = `#/post/${postId}`; },
      onDelete: (postId) => {
        handleDeletePost(postId, { onDone: () => { setPage(1); renderHomeView(root); } });
      }
    });
    renderPagination(paginationContainer, pageData, (nextPage) => {
      setPage(nextPage);
      renderHomeView(root);
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  clearUiMessages();
}

import { fetchPostById } from "../api/posts.api.js";
import { clearUiMessages, setPosts, setCurrentPost, state } from "../core/state.js";
import { notifyError, mergePostsWithAuthors, normalizePost } from "../services/posts.service.js";
import { renderPostDetail, renderErrorState, renderFeedbackBanner, renderLoadingState } from "../ui/renderStates.js";
import { ensureInitialDataLoaded, handleDeletePost } from "../features/home.controller.js";

export async function renderDetailView(root, postId) {
  root.innerHTML = `
    <section class="view-shell detail-view">
      <header class="view-header">
        <div>
          <h1 class="view-title">Detalle de publicación</h1>
          <p class="view-subtitle">Vista completa del contenido seleccionado.</p>
        </div>
      </header>
      <div id="detail-feedback"></div>
      <div id="detail-state"></div>
      <section id="detail-content"></section>
    </section>
  `;

  const feedbackContainer = root.querySelector("#detail-feedback");
  const stateContainer = root.querySelector("#detail-state");
  const detailContainer = root.querySelector("#detail-content");

  renderLoadingState(stateContainer, "Cargando detalle del post...");

  try {
    await ensureInitialDataLoaded();
  } catch (error) {
    notifyError("No se pudo cargar la base de datos principal.");
  }

  let post = state.posts.find((item) => item.id === Number(postId));

  if (!post) {
    try {
      const remotePost = await fetchPostById(postId);
      post = normalizePost(remotePost);
      setPosts([post, ...state.posts]);
    } catch (error) {
      renderErrorState(
        stateContainer,
        error.message || "No se pudo obtener el detalle de la publicación.",
        () => renderDetailView(root, postId)
      );
      return;
    }
  }

  setCurrentPost(post);
  const [enrichedPost] = mergePostsWithAuthors([post], state.users);

  renderFeedbackBanner(feedbackContainer, state.ui);
  stateContainer.innerHTML = "";
  renderPostDetail(detailContainer, enrichedPost, {
    onBack: () => { window.location.hash = "#/home"; },
    onDelete: (id) => {
      handleDeletePost(id, { onDone: () => { window.location.hash = "#/home"; } });
    }
  });

  clearUiMessages();
}

import { createPost } from "../api/posts.api.js";
import { clearUiMessages, prependPost, state } from "../core/state.js";
import { notifyError, notifySuccess, normalizePost } from "../services/posts.service.js";
import { renderCreateForm, renderFormErrors, renderErrorState, renderFeedbackBanner, showToast } from "../ui/renderStates.js";
import { validateCreatePostForm } from "../utils/validators.js";
import { ensureInitialDataLoaded } from "../features/home.controller.js";

function buildAuthorOptions(users) {
  return users.map((user) => ({
    id: user.id,
    label: `${user.firstName} ${user.lastName}`.trim()
  }));
}

export async function renderCreateView(root) {
  root.innerHTML = `
    <section class="view-shell create-view">
      <header class="view-header">
        <div>
          <h1 class="view-title">Formulario de creación</h1>
          <p class="view-subtitle">Valida datos en cliente y envía una solicitud POST.</p>
        </div>
      </header>
      <div id="create-feedback"></div>
      <div id="create-form-wrapper"></div>
    </section>
  `;

  const feedbackContainer = root.querySelector("#create-feedback");
  const formContainer = root.querySelector("#create-form-wrapper");

  try {
    await ensureInitialDataLoaded();
  } catch (error) {
    renderErrorState(formContainer, error.message || "No se pudo cargar la lista de autores.", () => renderCreateView(root));
    return;
  }

  renderFeedbackBanner(feedbackContainer, state.ui);

  renderCreateForm(formContainer, {
    users: buildAuthorOptions(state.users),
    onReset: () => {
      clearUiMessages();
      renderFeedbackBanner(feedbackContainer, state.ui);
    },
    onSubmit: async ({ payload, form, fields, setSubmitting }) => {
      const validation = validateCreatePostForm(payload);
      renderFormErrors(fields, validation.errors);

      if (!validation.isValid) {
        notifyError("Revisa los errores del formulario antes de enviar.");
        renderFeedbackBanner(feedbackContainer, state.ui);
        showToast("error", "Formulario inválido.");
        return;
      }

      setSubmitting(true);
      try {
        const created = await createPost(payload);
        const highestId = Math.max(0, ...state.posts.map((post) => post.id));
        const normalizedCreatedPost = normalizePost({
          ...created,
          ...payload,
          id: Number(created.id) || highestId + 1,
          tags: Array.isArray(created.tags) ? created.tags : ["nuevo"]
        });
        prependPost(normalizedCreatedPost);
        notifySuccess("Publicación creada exitosamente.");
        renderFeedbackBanner(feedbackContainer, state.ui);
        showToast("success", "Publicación enviada.");
        form.reset();
        renderFormErrors(fields, {});
      } catch (error) {
        notifyError(error.message || "No se pudo crear la publicación.");
        renderFeedbackBanner(feedbackContainer, state.ui);
        showToast("error", "Error al crear publicación.");
      } finally {
        setSubmitting(false);
      }
    }
  });
}

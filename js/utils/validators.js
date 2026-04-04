export function normalizeFormValue(value) {
  return String(value ?? "").trim();
}

export function validateCreatePostForm(payload) {
  const errors = {};

  const title = normalizeFormValue(payload.title);
  const body = normalizeFormValue(payload.body);
  const userId = Number(payload.userId);

  if (!title) {
    errors.title = "El título es obligatorio.";
  } else if (title.length < 5) {
    errors.title = "El título debe tener al menos 5 caracteres.";
  }

  if (!body) {
    errors.body = "El contenido es obligatorio.";
  } else if (body.length < 20) {
    errors.body = "El contenido debe tener al menos 20 caracteres.";
  }

  if (!Number.isInteger(userId) || userId < 1) {
    errors.userId = "Debes seleccionar un autor válido.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

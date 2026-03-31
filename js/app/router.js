import { renderHomeView } from "../features/home.controller.js";
import { renderDetailView } from "../features/detail.controller.js";
import { renderCreateView } from "../controllers/create.controller.js";
import { renderExtraView } from "../controllers/extra.controller.js";

let appRoot = null;

const routes = [
  {
    key: "home",
    pattern: /^#\/home$/,
    handler: () => renderHomeView(appRoot)
  },
  {
    key: "post",
    pattern: /^#\/post\/(\d+)$/,
    handler: (params) => renderDetailView(appRoot, params.id)
  },
  {
    key: "create",
    pattern: /^#\/create$/,
    handler: () => renderCreateView(appRoot)
  },
  {
    key: "authors",
    pattern: /^#\/authors$/,
    handler: () => renderExtraView(appRoot)
  }
];

function normalizeHash(hash) {
  if (!hash || hash === "#") return "#/home";
  return hash;
}

function matchRoute(hash) {
  for (const route of routes) {
    const matches = hash.match(route.pattern);
    if (!matches) continue;
    return {
      key: route.key,
      params: { id: matches[1] ? Number(matches[1]) : null },
      handler: route.handler
    };
  }
  return null;
}

function renderNotFound() {
  appRoot.innerHTML = `
    <section class="surface-panel stack">
      <h2 class="view-title">Ruta no encontrada</h2>
      <p class="view-subtitle">La dirección solicitada no existe en BlogBoard.</p>
      <a class="btn btn-primary" href="#/home">Volver al inicio</a>
    </section>
  `;
}

export async function handleRouteChange() {
  const normalizedHash = normalizeHash(window.location.hash);

  if (normalizedHash !== window.location.hash) {
    window.location.hash = normalizedHash;
    return;
  }

  const routeMatch = matchRoute(normalizedHash);

  if (!routeMatch) {
    renderNotFound();
    window.dispatchEvent(
      new CustomEvent("blogboard:routechange", {
        detail: { key: "not-found", hash: normalizedHash }
      })
    );
    return;
  }

  try {
    await routeMatch.handler(routeMatch.params);
  } catch (error) {
    appRoot.innerHTML = `
      <section class="surface-panel stack">
        <h2 class="view-title">Error de navegación</h2>
        <p class="view-subtitle">${error.message || "No se pudo renderizar la ruta."}</p>
        <a class="btn btn-primary" href="#/home">Recargar inicio</a>
      </section>
    `;
  }

  window.dispatchEvent(
    new CustomEvent("blogboard:routechange", {
      detail: { key: routeMatch.key, hash: normalizedHash }
    })
  );
}

export function navigateTo(path) {
  if (path.startsWith("#/")) {
    window.location.hash = path;
    return;
  }
  window.location.hash = `#/${path.replace(/^\/+/, "")}`;
}

export function initRouter(rootId = "app") {
  appRoot = document.getElementById(rootId);
  if (!appRoot) {
    throw new Error(`No se encontró el contenedor raíz con id "${rootId}".`);
  }
  window.addEventListener("hashchange", handleRouteChange);
  handleRouteChange();
}

import { initRouter } from "./router.js";

const navLinks = Array.from(document.querySelectorAll(".nav-link"));

function syncNav(routeKey) {
  navLinks.forEach((link) => {
    const linkRoute = link.dataset.route;
    const shouldBeActive = linkRoute === routeKey;
    if (linkRoute === "post" && routeKey === "post") {
      link.classList.add("active");
      return;
    }
    link.classList.toggle("active", shouldBeActive);
  });
}

window.addEventListener("blogboard:routechange", (event) => {
  const routeKey = event.detail?.key || "home";
  syncNav(routeKey);
});

initRouter("app");

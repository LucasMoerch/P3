import "./styles/custom.scss"

import { resolveRoute } from "./routers/routers"

function render() {
    const app = document.getElementById("app")!;
    app.innerHTML = ""; // clear old content
    app.appendChild(resolveRoute(location.pathname)); // insert new content
}

// Handle navigation
function navigate(path: string) {
    history.pushState({}, "", path);
    render();
}

// Run once at startup
window.addEventListener("load", render);

// Handle back/forward buttons
window.addEventListener("popstate", render);

// Navigate on link click
document.addEventListener("click", (e) => {
    const target = e.target as HTMLElement | null;
    const anchor = target?.closest('a[data-link]') as HTMLAnchorElement | null;
    if (!anchor) return;

    const href = anchor.getAttribute("href");
    if (!href) return;

    e.preventDefault();
    navigate(href);
});


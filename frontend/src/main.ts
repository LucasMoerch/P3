import './styles/custom.scss';
import { renderTimeTracker } from './components/timeTracker/timeTracker';
import '@fortawesome/fontawesome-free/css/all.min.css';

import { resolveRoute } from './routers/router';
import { renderHeaderAndNavbar } from "./components/navbar";


function render() {
  const app = document.getElementById('app')! as HTMLElement;
  app.innerHTML = ''; // clear old content
  app.appendChild(resolveRoute(location.pathname)); // insert new content

  const excludedPages = ['/login']; //pages where you dont want timeButton.

  if (
    !document.getElementById('time-tracker-button') &&
    !excludedPages.includes(location.pathname)
  ) {
    const tracker = renderTimeTracker();
    tracker.id = 'time-tracker-button'; //prevent duplicates
    document.body.appendChild(tracker);
  }
// Renders the navbar on all pages
  if (!excludedPages.includes(location.pathname)) {
    let navbar = document.getElementById("navbar-container");
    if (!navbar) {
      navbar = document.createElement("div");
      navbar.id = "navbar-container";
      navbar.appendChild(renderHeaderAndNavbar());
      document.body.prepend(navbar);
    }
  } else {
      const navbar = document.getElementById("navbar-container");
      if (navbar) {
          navbar.remove();
      }
  }
}

// Handle navigation
export function navigate(path: string) {
  history.pushState({}, '', path);
  render();
}

// Run once at startup
window.addEventListener('load', render);

// Handle back/forward buttons
window.addEventListener('popstate', render);


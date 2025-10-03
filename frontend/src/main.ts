import './styles/custom.scss';
import { renderTimeTracker } from './components/timeTracker/timeTracker';
import '@fortawesome/fontawesome-free/css/all.min.css';

import { resolveRoute } from './routers/router';

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
}

// Handle navigation
function navigate(path: string) {
  history.pushState({}, '', path);
  render();
}

// Run once at startup
window.addEventListener('load', render);

// Handle back/forward buttons
window.addEventListener('popstate', render);

// Navigate on link click
document.addEventListener('click', (e) => {
  const target = e.target as HTMLElement | null;
  const anchor = target?.closest('a[data-link]') as HTMLAnchorElement | null;
  if (!anchor) return;

  const href = anchor.getAttribute('href');
  if (!href) return;

  e.preventDefault();
  navigate(href);
});

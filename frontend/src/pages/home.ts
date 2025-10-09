import { renderHealthCheck } from '../components/healthCheck';

export function renderHomePage(): HTMLElement {
  const div = document.createElement('div');
  div.innerHTML = `<h1>Home page</h1>`;

  div.className = 'primary';
  const container = document.createElement('div');
  container.appendChild(div);
  container.appendChild(renderHealthCheck());

  return container;
}

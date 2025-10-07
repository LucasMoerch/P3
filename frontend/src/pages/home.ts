import { renderHealthCheck } from '../components/healthCheck';

export function renderHomePage(): HTMLElement {
  const div = document.createElement('div');
  div.innerHTML = `<h1>Home page</h1>`;

  div.className = 'primary';
  const container = document.createElement('div');
  container.appendChild(div);
  container.appendChild(renderHealthCheck());

  const loginLink = document.createElement('a');
  loginLink.innerHTML = '<a href="http://localhost:8080/api/oauth2/authorization/google">Sign in with Google</a>';

  container.appendChild(loginLink);

  return container;
}

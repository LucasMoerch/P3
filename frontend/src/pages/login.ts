export function renderLoginPage(): HTMLElement {
  const div = document.createElement('div');
  div.innerHTML = `<h1>Login page<h1>`;

  const container = document.createElement('container');
  container.appendChild(div);

  return container;
}

import { renderHealthCheck } from '../components/healthCheck';
import { renderSearchComponent } from '../components/searchComponent/searchbar';
export function renderStaffPage(): HTMLElement {
  const div = document.createElement('div');
  div.innerHTML = `<h1>Staff page<h1>`;

  const container = document.createElement('container');
  container.appendChild(div);
  container.appendChild(renderHealthCheck());

    // Render the SearchComponent
  container.appendChild(renderSearchComponent());
  return container;
}

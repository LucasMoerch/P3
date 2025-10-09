import { renderSearchComponent } from '../components/searchBar/searchBar';
import { renderTable } from '../components/tableComponent/tableComponent';

export function renderCasesPage(): HTMLElement {
  const div = document.createElement('div');
  div.innerHTML = `<h1>Cases page</h1>`;

  const container = document.createElement('div');
  container.classList.add('container');
  container.appendChild(div);
  container.appendChild(renderSearchComponent());

  const placeholderData: { title: string; address: string; deadline: string }[] = [
    { title: 'Floor fix', address: 'Falseroad 27', deadline: '23/10/2026' },
    { title: 'Roof', address: 'GotHam', deadline: '23/10/2026' },
    { title: 'Kitchen', address: 'Milkyway', deadline: '23/10/2026' },
  ];

  container.appendChild(renderTable(placeholderData));
  return container;
}

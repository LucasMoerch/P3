import { renderSearchComponent } from '../components/searchBar/searchBar';
import { renderTable } from '../components/tableComponent/tableComponent';

export function renderClientsPage(): HTMLElement {
  const div = document.createElement('div');
  div.innerHTML = `<h1>Clients page</h1>`;

  const container = document.createElement('div');
  container.classList.add('container');
  container.appendChild(div);
  container.appendChild(renderSearchComponent());

  const placeholderData: { name: string; address: string; contact: string }[] = [
    { name: 'John Johnson', address: 'Falseroad', contact: '+5454544' },
    { name: 'Bruce Wayne', address: 'GotHam', contact: '+454542' },
    { name: 'Guy Black', address: 'Milkyway', contact: '+88888888' },
  ];

  container.appendChild(renderTable(placeholderData));
  return container;
}

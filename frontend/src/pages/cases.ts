import { renderSearchComponent } from '../components/searchBar/searchBar';
import { renderTable } from '../components/tableComponent/tableComponent';

export function renderCasesPage(): HTMLElement {
  const div = document.createElement('div');
  div.innerHTML = `<h1>Cases page</h1>`;

  const container = document.createElement('div');
  container.classList.add('container');
  container.appendChild(div);
  container.appendChild(renderSearchComponent());

    async function loadCases() {
        try {
            const response = await fetch('/api/cases', { method: 'GET' });
            if (!response.ok) throw new Error(`Failed to fetch cases (${response.status})`);

            const cases = await response.json();

            const tableData = cases.map((c: any) => ({
                title: c.title || 'Untitled',
                description: c.description || '-',
                date: new Date(c.createdAt).toLocaleDateString('da-DK'),
                status: c.status || '-'
            }));

            const oldTable = container.querySelector('table');
            if (oldTable) oldTable.remove();

            container.appendChild(renderTable(tableData));
        } catch (err) {
            console.error('Error loading cases:', err);
        }
    }

// Initial load
    loadCases();

// Auto-refresh every 10 seconds
    setInterval(loadCases, 10000);


  return container;
}

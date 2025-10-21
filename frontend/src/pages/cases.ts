import { renderTable } from '../components/tableComponent/tableComponent';
import { renderSearchComponent } from '../components/searchBar/searchBar';
import http from '../api/http';

export type CaseDto = {
  id: string;
  clientId: string;
  title: string;
  description?: string;
  status: 'OPEN' | 'CLOSED';
  assignedUserIds: string[];
  createdAt: string;
  updatedAt: string;
};

export function renderCasesPage(): HTMLElement {
  const div = document.createElement('div');
  div.innerHTML = `<h1>Cases Overview</h1>`;

  const container = document.createElement('div');
  container.classList.add('container');
  container.appendChild(div);
  container.appendChild(renderSearchComponent());

  const realDataSection = document.createElement('div');
  realDataSection.innerHTML = `<p>Loading...</p>`;
  container.appendChild(realDataSection);

  async function loadCases() {
    try {
      const cases = (await http.get('/cases')) as CaseDto[];

      const caseData = (cases ?? []).map((c) => ({
        title: c.title || 'Untitled',
        description: c.description || '-',
        status: c.status || 'UNKNOWN',
        createdAt: new Date(c.createdAt).toLocaleDateString('da-DK'),
      }));

      realDataSection.innerHTML = '';
      realDataSection.appendChild(renderTable(caseData));
    } catch (err) {
      console.error('Failed to load cases:', err);
      realDataSection.innerHTML = '';
    }
  }

  // Initial load
  loadCases();

  // Auto-refresh every 10 seconds
  setInterval(loadCases, 10000);

  return container;
}

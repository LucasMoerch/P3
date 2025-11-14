import { renderSearchComponent } from '../components/searchBar/searchBar';
import { renderTable } from '../components/tableComponent/tableComponent';
import { renderCard } from '../components/cardComponent/cardComponent';
import { renderTabs } from '../components/tabsComponent/tabsComponent';
import http from '../api/http';


export type ClientDTO = {
  id: string;
  name: string;
  address?: string;
  contact?: string;
  email?: string;
  phone?: string;
};

export function renderClientsPage(): HTMLElement {
  const container = document.createElement('div');
  container.classList.add('container');

  const header = document.createElement('h1');
  header.textContent = 'Clients Overview';
  container.appendChild(header);

  container.appendChild(renderSearchComponent());

  const realDataSection = document.createElement('div');
  realDataSection.innerHTML = '<p>Loading...</p>';
  container.appendChild(realDataSection);

  // Fetch clients from backend
  async function loadClients() {
    try {
      const clients = (await http.get('/clients')) as ClientDTO[];

      const clientData = (clients ?? []).map((c) => ({
        name: c.name,
        address: c.address || '-',
        contact: c.contact || c.phone || 'N/A',
      }));

      realDataSection.innerHTML = '';
      const tableElement = renderTable(clientData);
      realDataSection.appendChild(tableElement);

      // Clickable rows like InspectUser / InspectCase
      const rows = tableElement.querySelectorAll('tr');
      rows.forEach((row, index) => {
        if (index === 0) return; // skip header
        row.addEventListener('click', () => {
          const client = clients[index - 1];
          const popup = inspectClient(client);
          document.body.appendChild(popup);
          console.log('client clicked');
        });
      });
    } catch (err) {
      console.error('Failed to load clients:', err);
      realDataSection.innerHTML = '<p class="text-danger">Failed to load clients.</p>';
    }
  }

  // Inspect Client popup — same layout as InspectUser
  function inspectClient(client: ClientDTO): HTMLElement {
    const overlay: HTMLElement = renderCard(true);
    const card: HTMLElement = overlay.querySelector('.card') as HTMLElement;
    const headerEl: HTMLElement = card.querySelector('.header') as HTMLElement;
    const body: HTMLElement = card.querySelector('.body') as HTMLElement;

    const backButton = overlay.querySelector('.closeBtn');
    if (backButton) backButton.remove();

    headerEl.innerText = client.name;

    const back = headerEl.querySelector('.exit-button');
    back?.addEventListener('click', () => overlay.remove());

    // Body info like InspectUser
    body.innerHTML = `
      <div class="card profile-card w-100 shadow-sm border-0">
        <div class="card-body fs-5">
          <div class="info-row d-flex justify-content-between border-bottom py-3">
            <span class="label text-muted fw-medium">Client ID</span>
            <span class="value fw-semibold">${client.id}</span>
          </div>
          <div class="info-row d-flex justify-content-between border-bottom py-3">
            <span class="label text-muted fw-medium">Address</span>
            <span class="value fw-semibold text-end">${client.address || 'N/A'}</span>
          </div>
          <div class="info-row d-flex justify-content-between border-bottom py-3">
            <span class="label text-muted fw-medium">Contact</span>
            <span class="value fw-semibold">${client.contact || 'N/A'}</span>
          </div>
          <div class="info-row d-flex justify-content-between border-bottom py-3">
            <span class="label text-muted fw-medium">Email</span>
            <span class="value fw-semibold">${client.email || 'N/A'}</span>
          </div>

        </div>
      </div>
    `;
    card.appendChild(body);
    card.appendChild(renderTabs({ entityType: 'clients', entityId: client.id }));


    return overlay;
  }

  loadClients();
  setInterval(loadClients, 10000);

  return container;
}

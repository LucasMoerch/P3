import { renderTable } from '../components/tableComponent/tableComponent';
import { renderSearchComponent } from '../components/searchBar/searchBar';
import { renderCard } from '../components/cardComponent/cardComponent';
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

            // clear loading...
            realDataSection.innerHTML = '';

            // render table and append
            const tableElement = renderTable(caseData);
            realDataSection.appendChild(tableElement);

            // make rows clickable like InspectUser
            const rows = tableElement.querySelectorAll('tr');
            rows.forEach((row, index) => {
                // Skip header row
                if (index === 0) return;

                row.addEventListener('click', (): void => {
                    const selectedCase = cases[index - 1]; // match index with case
                    const popup = inspectCase(selectedCase);
                    document.body.appendChild(popup);
                    console.log('case clicked', selectedCase.id);
                });
            });
        } catch (err) {
            console.error('Failed to load cases:', err);
            realDataSection.innerHTML = '<p>Failed to load case data.</p>';
        }
    }

    // InspectCase - matches the style/behavior of inspectUser
    function inspectCase(c: CaseDto): HTMLElement {
        const overlay: HTMLElement = renderCard(true);
        const card: HTMLElement = overlay.querySelector('.card') as HTMLElement;
        const header: HTMLElement = card.querySelector('.header') as HTMLElement;
        const body: HTMLElement = card.querySelector('.body') as HTMLElement;

        // Remove default close button if present
        const backButton = overlay.querySelector('.closeBtn');
        if (backButton) backButton.remove();

        const editBtn = card.querySelector('.back-button.end-0') as HTMLElement | null;

        // Header markup & classes
        if (header) {
            header.className = `
        profile-header d-flex align-items-center justify-content-between
        px-4 py-3 bg-white shadow-sm rounded mt-4 position-relative
      `;

            header.innerHTML = `
        <button class="btn exit-button border-0 bg-transparent text-primary position-absolute start-0 ps-3">
          <i class="fa-solid fa-arrow-left fs-1"></i>
        </button>

        <div class="w-100 d-flex align-items-center justify-content-between">
          <div class="flex-grow-1 text-center">
            <h2 class="profile-name fw-bold mb-0 text-dark">
              ${c.title || 'Untitled Case'}
            </h2>
          </div>
        </div>
      `;

            if (editBtn) {
                editBtn.classList.remove('top-0', 'm-3', 'fs-2');
                editBtn.classList.add('end-0', 'position-absolute');
                editBtn.style.top = '50%';
                editBtn.style.transform = 'translateY(-50%)';
                header.appendChild(editBtn);
            }

            // back button behavior
            const back = header.querySelector('.exit-button');
            back?.addEventListener('click', () => overlay.remove());
        }

        // Body markup
        if (body) {
            body.innerHTML = `
        <div class="card profile-card w-100 shadow-sm border-0">
          <div class="card-body fs-5">
            <div class="info-row d-flex justify-content-between border-bottom py-3">
              <span class="label text-muted fw-medium">Case ID</span>
              <span class="value fw-semibold">${c.id}</span>
            </div>

            <div class="info-row d-flex justify-content-between border-bottom py-3">
              <span class="label text-muted fw-medium">Client ID</span>
              <span class="value fw-semibold">${c.clientId}</span>
            </div>

            <div class="info-row d-flex justify-content-between border-bottom py-3">
              <span class="label text-muted fw-medium">Description</span>
              <span class="value fw-semibold text-end">${c.description || '-'}</span>
            </div>

            <div class="info-row d-flex justify-content-between border-bottom py-3">
              <span class="label text-muted fw-medium">Status</span>
              <span class="value fw-semibold">${c.status}</span>
            </div>

            <div class="info-row d-flex justify-content-between border-bottom py-3">
              <span class="label text-muted fw-medium">Assigned Users</span>
              <span class="value fw-semibold">${c.assignedUserIds.length ? c.assignedUserIds.join(', ') : 'None'}</span>
            </div>

            <div class="info-row d-flex justify-content-between border-bottom py-3">
              <span class="label text-muted fw-medium">Created</span>
              <span class="value fw-semibold">${new Date(c.createdAt).toLocaleString('da-DK')}</span>
            </div>

            <div class="info-row d-flex justify-content-between py-3">
              <span class="label text-muted fw-medium">Last Updated</span>
              <span class="value fw-semibold">${new Date(c.updatedAt).toLocaleString('da-DK')}</span>
            </div>
          </div>
        </div>
      `;
        }

        // Close button
        const closeBtn = document.createElement('button');
        closeBtn.className = 'btn btn-primary btn-lg';
        closeBtn.innerText = 'Close';

        const btnContainer = document.createElement('div');
        btnContainer.className = 'd-flex justify-content-center mt-3';
        btnContainer.appendChild(closeBtn);

        closeBtn.addEventListener('click', () => overlay.remove());

        // append button container to card (some renderCard implementations already include card; append safely)
        if (card) {
            card.appendChild(btnContainer);
        } else {
            // fallback - if renderCard returned overlay with card already appended elsewhere,
            // ensure the overlay contains the button container so it's visible
            overlay.appendChild(btnContainer);
        }

        return overlay;
    }

    // initial load + auto refresh
    loadCases();
    setInterval(loadCases, 10000);

    return container;
}

import './pageStyles/staff.scss';
import { renderTable } from '../components/tableComponent/tableComponent';
import { renderSearchComponent } from '../components/searchBar/searchBar';
import { renderCard } from '../components/cardComponent/cardComponent';
import { isAdmin } from '../auth/auth';
import http from '../api/http';
import { renderTabs } from '../components/tabsComponent/tabsComponent';

export type UserRole = 'staff' | 'admin';
export type UserStatus = 'invited' | 'active' | 'disabled';

export type UserDTO = {
  id: string;
  roles: UserRole[];
  status: UserStatus;
  auth: {
    provider: 'google';
    email: string;
    emailVerified: boolean;
    pictureUrl?: string | null; // optional on some users
  };

  profile?: {
    firstName?: string | null;
    lastName?: string | null;
    displayName?: string | null;
    phone?: string | null;
    locale?: string | null;
  } | null;

  staff?: {
    employeeNo?: string | null;
    hourlyRate?: number | null;
    defaultCaseIds?: string[] | null;
  } | null;

  audit?: {
    createdAt?: string | null; // ISO strings from API
    updatedAt?: string | null;
    createdBy?: string | null;
    updatedBy?: string | null;
  } | null;
};

export function renderStaffPage(): HTMLElement {
  const div = document.createElement('div');
  div.innerHTML = `<h1>Staff Overview</h1>`;

  const container = document.createElement('div');
  container.classList.add('container');
  container.appendChild(div);
  container.appendChild(renderSearchComponent());

  //new section for real data from backend
  const realDataSection = document.createElement('div');
  realDataSection.innerHTML = `<p>Loading...</p>`;
  container.appendChild(realDataSection);

  // fetch users from backend using axios, which auto-parses JSON.
  //Takes the display name and role from the database. Map takes the specific piece of data that is needed.
  async function loadStaff() {
    try {
      const users = (await http.get('/users')) as UserDTO[];
      const staffData = (users ?? []).map((user) => ({
        id: user.id,
        name: user.profile?.displayName,
        role: user.roles.join(', '),
      }));
      // remove "loading..."
      realDataSection.innerHTML = '';

      //render table
      const tableElement = renderTable(staffData);
      realDataSection.appendChild(tableElement);

      //Taking each row and adding a eventListener
      const rows = tableElement.querySelectorAll('tr');
      rows.forEach((row, index) => {
        // Skip header row
        if (index === 0) return;

        row.addEventListener('click', (): void => {
          const user = users[index - 1]; // match index with user
          const popup = inspectUser(user);
          document.body.appendChild(popup);
          console.log('user clicked');
        });
      });
      //Error message, if anything goes wrong
    } catch (err) {
      console.error('Failed to load staff:', err);
      realDataSection.innerHTML = '<h2>Users from Database</h2><p>Failed to load staff data.</p>';
    }
  }
  loadStaff();

  function inspectUser(user: any): HTMLElement {
    const overlay: HTMLElement = renderCard(true);
    const card: HTMLElement = overlay.querySelector('.card') as HTMLElement;
    const header: HTMLElement = card.querySelector('.header') as HTMLElement;
    const body: HTMLElement = card.querySelector('.body') as HTMLElement;

      //Overwriting the header from cardComponent
      header.innerHTML = `<h2 class="m-0 text-center fw-semibold">${user.profile?.displayName || 'Unknown User'}</h2>`;

      //table from bootstrap
      body.innerHTML = `
      <div class="space-to-header d-flex justify-content-center">
        <div class="p-2 rounded-3" style="max-width: 700px; width: 100%;">
            <table class="table table-striped w-100 text-wrap" style="table-layout: fixed";>
              <thead>
                <tr>
                  <th scope="col" class="fs-4">Birthdate</th>
                  <td class="fs-4 text-end pe-3">${user.profile?.birthDate || 'N/A'}</td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row" class="fs-4">Mobile Number</th>
                  <td class="fs-4 text-end pe-3">${user.profile?.phone || 'N/A'}</td>
                </tr>
                <tr>
                  <th scope="row" class="fs-4">E-mail</th>
                  <td class="fs-4 text-end pe-3">${user.auth?.email || 'N/A'}</td>
                </tr>
                <tr>
                  <th scope="row" class="fs-4">Adress</th>
                  <td class="fs-4 text-end pe-3">${user.profile?.adress || 'N/A'}</td>
                </tr>
                <tr>
                  <th scope="row" class="fs-4">CPR</th>
                  <td class="fs-4 text-end pe-3">${user.profile?.CPR || 'N/A'}</td>
                </tr>
              </tbody>
            </table>
        </div>
      </div>
    `;
    const saveBtn = document.createElement('button');
    saveBtn.className = 'btn btn-primary btn-lg';
    saveBtn.innerText = 'Save';

    const btnContainer = document.createElement('div');
    btnContainer.className = 'd-flex justify-content-center mt-3';
    btnContainer.appendChild(saveBtn);

    saveBtn.addEventListener('click', () => {
      overlay.remove();
    });

    overlay.appendChild(card);
    card.appendChild(header);
    card.appendChild(body);
    card.append(renderTabs());
    card.appendChild(btnContainer);

    return overlay;
  }

  if (isAdmin()) {
    console.log('You are Admin');
  } else {
    console.log('You are not Admin');
  }
  return container;
}

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

    header.innerText = user.profile?.displayName || 'No Name';

    // This is the body where the information is displayed like mail, mobile number etc.
    body.innerHTML = `
      <div class="card profile-card w-100 shadow-sm border-0">
        <div class="card-body fs-5">
          <div class="info-row d-flex justify-content-between border-bottom py-3">
            <span class="label text-muted fw-medium">Birthdate</span>
            <span class="value fw-semibold">${user.profile?.birthDate || 'N/A'}</span>
          </div>
          <div class="info-row d-flex justify-content-between border-bottom py-3">
            <span class="label text-muted fw-medium">Mobile Number</span>
            <span class="value fw-semibold">${user.profile?.phone || 'N/A'}</span>
          </div>
          <div class="info-row d-flex justify-content-between border-bottom py-3">
            <span class="label text-muted fw-medium">E-mail</span>
            <span class="value fw-semibold">${user.auth?.email || 'N/A'}</span>
          </div>
          <div class="info-row d-flex justify-content-between border-bottom py-3">
            <span class="label text-muted fw-medium">Address</span>
            <span class="value fw-semibold text-end">${user.profile?.address || 'N/A'}</span>
          </div>
          <div class="info-row d-flex justify-content-between py-3">
            <span class="label text-muted fw-medium">CPR Number</span>
            <span class="value fw-semibold">${user.profile?.cpr || 'N/A'}</span>
          </div>
        </div>
      </div>
      `;

    overlay.appendChild(card);
    card.appendChild(header);
    card.appendChild(body);
    card.append(renderTabs({ entityType: 'users', entityId: user.id }));

    return overlay;
  }

  if (isAdmin()) {
    console.log('You are Admin');
  } else {
    console.log('You are not Admin');
  }
  return container;
}

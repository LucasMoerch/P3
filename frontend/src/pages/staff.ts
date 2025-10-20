import './pageStyles/staff.scss';
import { renderTable } from '../components/tableComponent/tableComponent';
import { renderSearchComponent } from '../components/searchBar/searchBar';
import { renderAddNewStaffCard } from '../components/newCard/addNewStaffCard';
import { renderNewButton } from '../components/newButton/newButton';
import {renderCard} from "../components/cardComponent/cardComponent";
import { isAdmin } from '../auth/auth';
import http from '../api/http';

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
  div.innerHTML = `<h1>Staff page</h1>`;

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
        //Loads a title and renders the table from before with user data.
        realDataSection.innerHTML = '<h2>Staff List</h2>';

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

  function inspectUser (user: any): HTMLElement {
      const overlay: HTMLElement = renderCard();
      const card: HTMLElement = overlay.querySelector('.card') as HTMLElement;
      const header: HTMLElement = card.querySelector('.header') as HTMLElement;
      const body: HTMLElement = card.querySelector('.body') as HTMLElement;
      //Added this because we don't want the back button from renderCard.
      const backButton = overlay.querySelector('.back-button');
      if (backButton) backButton.remove();


      //This is the header which includes the back button, edit button and name of the user.
      header.className = `
      profile-header d-flex align-items-center justify-content-between
      px-4 py-3 bg-white shadow-sm rounded mt-4 position-relative
      `;

      header.innerHTML = `
      <button class="btn back-button border-0 bg-transparent text-primary position-absolute start-0 ps-3">
        <i class="fa-solid fa-arrow-left fs-1"></i>
      </button>
    
      <div class="w-100 d-flex align-items-center justify-content-between">
        <div class="flex-grow-1 text-center">
          <h2 class="profile-name fw-bold mb-0 text-dark">
            ${user.profile?.displayName || 'Unknown User'}
          </h2>
        </div>
        <i class="fa-solid fa-pen edit-icon text-primary fs-4 ms-3" role="button"></i>
      </div>
      `;

    // Back button functionality
      const back = header.querySelector('.back-button');
      back?.addEventListener('click', () => overlay.remove());

    // This is the body where the information is displayed like mail, mobile number etc.
      body.innerHTML = `
      <div class="profile-body d-flex flex-column align-items-center py-4">
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
              <span class="value fw-semibold text-end">${user.profile?.adress || 'N/A'}</span>
            </div>
            <div class="info-row d-flex justify-content-between py-3">
              <span class="label text-muted fw-medium">CPR Number</span>
              <span class="value fw-semibold">${user.profile?.CPR || 'N/A'}</span>
            </div>
          </div>
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

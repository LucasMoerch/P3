import { renderTable } from '../components/tableComponent/tableComponent';
import { renderSearchComponent } from '../components/searchBar/searchBar';
import { renderAddNewStaffCard } from '../components/newCard/addNewStaffCard';
import { renderNewButton } from '../components/newButton/newButton';
import {renderClickedStaff} from "../components/clickOnStaffComponent/staffComponent";
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
                const popup = inspect_user(user);
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

  function inspect_user (user: any): HTMLElement {
      const overlay: HTMLElement = renderClickedStaff();
      const card: HTMLElement = overlay.querySelector('.card') as HTMLElement;
      const header: HTMLElement = card.querySelector('.header') as HTMLElement;
      const body: HTMLElement = card.querySelector('.body') as HTMLElement;

      const title = document.createElement('h2');
      title.innerText = user.profile?.displayName || 'Unkown user';
      title.style.textAlign = 'center';
      title.style.flex = '1';
      title.style.margin = '0';
      title.style.fontWeight = 'bold';

      header.style.display = 'flex';
      header.style.alignItems = 'center';
      header.style.justifyContent = 'center';
      header.style.position = 'relative';

      header.appendChild(title);

      body.innerHTML = `
        <div class="card shadow-sm border-0 p-3">
            <div class="text-center mb-3">
                <h4 class="fw-semibold">${user.roles?.join(', ') || 'N/A'}</h4>
            </div>
    
       <div class="list-group list-group-flush">
          <div class="list-group-item d-flex justify-content-between align-items-center border-0 border-bottom py-2">
           <span class="text-muted fs-3">Birthdate</span>
           <span class="fw-semibold fs-3">${user.profile?.birthDate || 'N/A'}</span>
        </div>
          
        <div class="list-group-item d-flex justify-content-between align-items-center border-0 border-bottom py-2">
          <span class="text-muted fs-3">Mobile Number</span>
          <span class="fw-semibold fs-3">${user.profile?.phone || 'N/A'}</span>
        </div>
          
        <div class="list-group-item d-flex justify-content-between align-items-center border-0 border-bottom py-2">
          <span class="text-muted fs-3">E-mail</span>
          <span class="fw-semibold">${user.auth?.email || 'N/A'}</span>
        </div>
          
        <div class="list-group-item d-flex justify-content-between align-items-center border-0 border-bottom py-2">
          <span class="text-muted fs-3">Address</span>
          <span class="fw-semibold text-end fs-3">${user.profile?.adress || 'N/A'}</span>
        </div>
          
         <div class="list-group-item d-flex justify-content-between align-items-center border-0 py-2">
           <span class="text-muted fs-3">CPR Number</span>
           <span class="fw-semibold fs-3">${user.profile?.CPR || 'N/A'}</span>
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

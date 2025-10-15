import { renderTable } from '../components/tableComponent/tableComponent';
import { renderSearchComponent } from '../components/searchBar/searchBar';
import { renderAddNewStaffCard } from '../components/newCard/addNewStaffCard';
import { renderNewButton } from '../components/newButton/newButton';
import axios from 'axios';
import { isAdmin } from '../auth/auth';

export function renderStaffPage(): HTMLElement {
  const div = document.createElement('div');
  div.innerHTML = `<h1>Staff page</h1>`;

  const container = document.createElement('div');
  container.classList.add('container');
  container.appendChild(div);
  container.appendChild(renderSearchComponent());

  //new section for real data from backend
  const realDataSection = document.createElement('div');
  realDataSection.innerHTML = `<h2>Users from Database</h2><p>Loading...</p>`;
  container.appendChild(realDataSection);

  // fetch users from backend using axios, which auto-parses JSON.
  //Takes the display name and role from the database. Map takes the specific piece of data that is needed.
  axios
    .get('http://localhost:5173/api/users')
    .then((res) => {
      const data = res.data;
      const staffData = data.map((user: any) => ({
        name: user.profile?.displayName || 'Unknown',
        role: user.roles?.join(', ') || 'N/A',
      }));
      //Loads a title and renders the table from before with user data.
      realDataSection.innerHTML = '<h2>Users from Database</h2>';
      realDataSection.appendChild(renderTable(staffData));
    })
    //Error message, if anything goes wrong
    .catch((err) => {
      console.error('Failed to load staff:', err);
      realDataSection.innerHTML = '<h2>Users from Database</h2><p>Failed to load staff data.</p>';
    });

  if (isAdmin()) {
    console.log('You are Admin');
  } else {
    console.log('You are not Admin');
  }
  return container;
}

import { getMe } from '../auth/auth';
import http from '../api/http';
import { loadTimeEntries } from '../components/tabsComponent/timeTab';
import { loadFiles } from '../components/tabsComponent/fileTab';

export function renderMyProfilePage(): HTMLElement {
  const div = document.createElement('div');
  div.innerHTML = `<h1>My Profile<h1>`;

  console.log(getMe);

  const body = document.createElement('div');

  const me = getMe();
  console.log(me);

  body.innerHTML = `
      <div class="card profile-card w-100 shadow-sm border-0">
        <div class="card-body fs-5">

        <div class="info-row d-flex justify-content-between border-bottom py-3">
          <span class="label text-muted fw-medium">First Name</span>
          <span class="value fw-semibold">${me?.firstName}</span>
        </div>
        <div class="info-row d-flex justify-content-between border-bottom py-3">
          <span class="label text-muted fw-medium">Last Name</span>
          <span class="value fw-semibold">${me?.lastName}</span>
        </div>
          <div class="info-row d-flex justify-content-between border-bottom py-3">
            <span class="label text-muted fw-medium">Display Name</span>
            <span class="value fw-semibold">${me?.displayName}</span>
          </div>
          <div class="info-row d-flex justify-content-between border-bottom py-3">
            <span class="label text-muted fw-medium">CPR</span>
            <span class="value fw-semibold text-end">${me?.cpr || 'N/A'}</span>
          </div>
          <div class="info-row d-flex justify-content-between border-bottom py-3">
            <span class="label text-muted fw-medium">Birthdate</span>
            <span class="value fw-semibold text-end">${me?.birthDate || 'N/A'}</span>
          </div>
          <div class="info-row d-flex justify-content-between border-bottom py-3">
            <span class="label text-muted fw-medium">Email</span>
            <span class="value fw-semibold">${me?.email || 'N/A'}</span>
          </div>
          <div class="info-row d-flex justify-content-between border-bottom py-3">
            <span class="label text-muted fw-medium">Phone number</span>
            <span class="value fw-semibold text-end">${me?.phoneNumber || 'N/A'}</span>
          </div>
          <div class="info-row d-flex justify-content-between border-bottom py-3">
            <span class="label text-muted fw-medium">Address</span>
            <span class="value fw-semibold text-end">${me?.address || 'N/A'}</span>
          </div>
           <div class="info-row d-flex justify-content-between border-bottom py-3">
            <span class="label text-muted fw-medium">Picture</span>
            <img src = "${me?.pictureUrl}" />
          </div>
           <div class="info-row d-flex justify-content-between border-bottom py-3">
            <span class="label text-muted fw-medium">Status</span>
            <span class="value fw-semibold">${me?.status || 'N/A'}</span>
          </div>
        </div>
      </div>
    `;

  const editButton = document.createElement('button');
  editButton.className = 'btn btn-primary btn-lg mt-3';
  editButton.textContent = 'Edit';

  editButton.addEventListener('click', () => {
    //the infoRows line collects all elements with the class .info-row, so make sure to name it this.
    const infoRows = body.querySelectorAll('.info-row');
    //Loops to make sure we get every .info-row class and gets the displayed value.
    infoRows.forEach((row) => {
      const valueSpan = row.querySelector('.value');
      if (!valueSpan) return;

      //Here it creates an input box, so the user can edit the value.
      if (!valueSpan.querySelector('input')) {
        const currentValue = valueSpan.textContent?.trim() || '';
        const input = document.createElement('input');
        input.type = 'text';
        input.value = currentValue; //Makes sure to insert the current value, after you click edit.
        input.className = 'form-control text-end fw-semibold';
        valueSpan.textContent = '';
        valueSpan.appendChild(input);
      }
    });
  });

  const documents = document.createElement('div');
  documents.id = 'files';
  documents.innerHTML = `<h2 class="mt-5">My documents</h2><div id="files-content" class="mt-3"></div>`;
  loadFiles({ entityType: 'users', entityId: me!.id.toString(), container: documents });

  const timeRegistrations = document.createElement('div');
  timeRegistrations.id = 'time-registrations';
  timeRegistrations.innerHTML = `<h2 class="mt-5">My Time Registrations</h2><div id="times-content" class="mt-3"></div>`;

  const container = document.createElement('container');
  container.appendChild(div);
  container.appendChild(body);
  container.appendChild(editButton);
  container.appendChild(timeRegistrations);
  container.appendChild(documents);

  // Load time entries for me
  if (me?.id) {
    loadTimeEntries({
      entityType: 'users',
      entityId: me.id,
      container: timeRegistrations,
    });
  }

  return container;
}

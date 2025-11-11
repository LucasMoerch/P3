import { renderCard } from '../cardComponent/cardComponent';
import type { UserRole } from '../../pages/staff';

export function renderAddNewStaffCard(
  onInvite?: (email: string, role: UserRole[]) => Promise<boolean>
): HTMLElement {
  // Create overlay
  const overlay: HTMLElement = renderCard(true);
  const card: HTMLElement = overlay.querySelector('.card') as HTMLElement;
  const header: HTMLElement = card.querySelector('.header') as HTMLElement;
  const body: HTMLElement = card.querySelector('.body') as HTMLElement;

  // HEADER
  header.innerHTML = `<h4 class="m-0 text-center fw-semibold">Add New Staff</h4>`;

  // BODY CONTENT
  const formContainer = document.createElement('div');
  formContainer.className = 'container p-4 rounded';
  formContainer.innerHTML = `
    <div class="mb-3">
      <label for="staffName" class="form-label">Staff Name</label>
      <input type="text" id="staffName" class="form-control" placeholder="Enter name..." />
    </div>

    <div class="mb-3">
      <label for="staffEmail" class="form-label">Staff Email</label>
      <input type="email" id="staffEmail" class="form-control" placeholder="Enter email..." />
    </div>

    <div class="form-check mb-3">
      <input type="checkbox" class="form-check-input" id="isAdmin" />
      <label class="form-check-label" for="isAdmin">Admin access</label>
    </div>

    <div class="mb-3">
      <label for="itemDesc" class="form-label">Description</label>
      <textarea id="itemDesc" class="form-control" rows="4" placeholder="Add a short description..."></textarea>
    </div>
  `;

  // BUTTON ROW
  const buttonRow = document.createElement('div');
  buttonRow.className = 'd-flex justify-content-end gap-2 p-3';

  const saveBtn = document.createElement('button');
  saveBtn.className = 'btn btn-primary rounded-pill px-4';
  saveBtn.innerText = 'Invite';

  const cancelBtn = document.createElement('button');
  cancelBtn.className = 'btn btn-outline-secondary rounded-pill px-4';
  cancelBtn.innerText = 'Cancel';

  buttonRow.appendChild(saveBtn);
  buttonRow.appendChild(cancelBtn);

  // BUILD CARD
  body.appendChild(formContainer);
  body.appendChild(buttonRow);
  card.appendChild(header);
  card.appendChild(body);
  overlay.appendChild(card);

  cancelBtn.addEventListener('click', () => overlay.remove());

  saveBtn.addEventListener('click', async () => {
    const name = (formContainer.querySelector('#staffName') as HTMLInputElement).value;
    const email = (formContainer.querySelector('#staffEmail') as HTMLInputElement).value;
    const isAdmin = (formContainer.querySelector('#isAdmin') as HTMLInputElement).checked;
    const desc = (formContainer.querySelector('#itemDesc') as HTMLTextAreaElement).value;

    const role: UserRole = isAdmin ? 'admin' : 'staff';

    console.log('Submitting:', { name, email, desc, role });

    if (!onInvite) {
      console.warn('No invite callback provided.');
      overlay.remove();
      return;
    }

    const success = await onInvite(email, [role]);
    if (success) {
      overlay.remove();
    }
  });

  return overlay;
}

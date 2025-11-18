import { renderCard } from '../cardComponent/cardComponent';
import { createFloatingInput, createFloatingTextarea } from '../floatingLabel/floatingLabel';
import type { UserRole } from '../../pages/staff';
import './addNewStaffCard.scss';

export function renderAddNewStaffCard(
  onInvite?: (email: string, role: UserRole[]) => Promise<boolean>,
): HTMLElement {
  // Create overlay
  const overlay = renderCard({ edit: false, endpoint: 'users/create' });
  const card: HTMLElement = overlay.querySelector('.card') as HTMLElement;
  const header: HTMLElement = card.querySelector('.header') as HTMLElement;
  const body: HTMLElement = card.querySelector('.body') as HTMLElement;

  // HEADER
  header.innerHTML = `<h4 class="m-0 text-center fw-semibold">Add New Staff</h4>`;

  // BODY CONTENT
  const formContainer = document.createElement('div');
  formContainer.className = 'container p-4 rounded';

  //Use the new reusable floating label helpers
  const nameField = createFloatingInput('staffName', 'Full Name *', 'text');
  const emailField = createFloatingInput('staffEmail', 'Email *', 'email');
  const descField = createFloatingTextarea('staffDesc', 'Description', 4);

  const adminCheckWrapper = document.createElement('div');
  adminCheckWrapper.className = 'form-check mb-3';
  adminCheckWrapper.innerHTML = `
    <input type="checkbox" class="form-check-input" id="isAdmin" />
    <label class="form-check-label" for="isAdmin">Admin access</label>
    `;

  formContainer.appendChild(nameField);
  formContainer.appendChild(emailField);
  formContainer.appendChild(descField);
  formContainer.appendChild(adminCheckWrapper);

  // BUTTON ROW
  const buttonRow = document.createElement('div');
  buttonRow.className = 'd-flex justify-content-center gap-3 p-3';

  const saveBtn = document.createElement('button');
  saveBtn.className = 'btn btn-primary rounded-pill px-4';
  saveBtn.innerText = 'Invite';

  const cancelBtn = document.createElement('button');
  cancelBtn.className = 'btn btn-danger text-white rounded-pill px-4';
  cancelBtn.innerText = 'Cancel';

  buttonRow.appendChild(saveBtn);
  buttonRow.appendChild(cancelBtn);

  // BUILD CARD
  body.appendChild(formContainer);
  body.appendChild(buttonRow);
  card.appendChild(header);
  card.appendChild(body);
  overlay.appendChild(card);

  cancelBtn.addEventListener('click', () => {
    showCancelConfirmation();
  });

  function showCancelConfirmation() {
    const wrapper = document.createElement("div");

    wrapper.innerHTML = `
    <div class="cancel-confirm-overlay">
      <div class="card cancel-confirm-card">
        <p>Are you sure you want to cancel?</p>
        <div class="cancel-confirm-buttons">
          <button id="confirmYes" class="btn btn-danger px-3">Yes</button>
          <button id="confirmNo" class="btn btn-secondary px-3">No</button>
        </div>
      </div>
    </div>
    `;

    document.body.appendChild(wrapper);

    const yesBtn = wrapper.querySelector("#confirmYes") as HTMLButtonElement;
    const noBtn = wrapper.querySelector("#confirmNo") as HTMLButtonElement;

    const cleanup = () => wrapper.remove();

    yesBtn.onclick = () => {
        cleanup();
        overlay.remove();
    };

    noBtn.onclick = cleanup;

    // clicking outside closes
    wrapper.addEventListener("click", (ev) => {
        if (ev.target === wrapper) cleanup();
    });
  }

  saveBtn.addEventListener('click', async () => {
    const nameInput = (formContainer.querySelector('#staffName') as HTMLInputElement);
    const emailInput = (formContainer.querySelector('#staffEmail') as HTMLInputElement);
    const isAdminInput = (formContainer.querySelector('#isAdmin') as HTMLInputElement);
    const descInput = (formContainer.querySelector('#staffDesc') as HTMLTextAreaElement);

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const desc = descInput.value.trim();
    const isAdmin = isAdminInput.checked;

    const role: UserRole = isAdmin ? 'admin' : 'staff';

    // Reset all invalid states
    nameInput.classList.remove("is-invalid");
    emailInput.classList.remove("is-invalid");

    let hasError = false;

    if (!name) {
        nameInput.classList.add("is-invalid");
        hasError = true;
    }

    if (!email) {
        emailInput.classList.add("is-invalid");
        hasError = true;
    }

    if (hasError) {
        alert("Please fill out the required fields.");
        return;
    }


    console.log('Submitting:', { name, email, desc, role });

    if (!onInvite) {
      console.warn('No invite callback provided.');
      overlay.remove();
      return;
    }

    const success = await onInvite(email, [role]);
    if (success) {

      overlay.remove();

      const staffPage = document.querySelector('.staff-page') as any;

      if (staffPage?.reload) {
            staffPage.reload();   // reload the staff page
      }
    }
  });

  return overlay;
}

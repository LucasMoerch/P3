import { renderCard } from '../cardComponent/cardComponent';
import { createFloatingInput } from '../floatingLabel/floatingLabel';
import http from '../../api/http';
import {showCancelConfirmation} from "../cancelPopUp/cancelPopUp";

export function renderAddNewClientCard(): HTMLElement {
  const overlay = renderCard({ edit: false, endpoint: 'clients/create', hasChanges: () => isTyped });
  const card = overlay.querySelector('.card') as HTMLElement;
  const header = card.querySelector('.header') as HTMLElement;
  const body = card.querySelector('.body') as HTMLElement;

  header.innerHTML = `<h4 class="m-0 text-center fw-semibold">Add New Client</h4>`;

  const formContainer = document.createElement('div');
  formContainer.className = 'container p-4 rounded';

  //Use the new reusable floating label helpers
  const nameField = createFloatingInput('clientName', 'Full Name *', 'text');
  const emailField = createFloatingInput('clientEmail', 'Email *', 'email');
  const phoneField = createFloatingInput('clientPhone', 'Phone *', 'tel');

  formContainer.appendChild(nameField);
  formContainer.appendChild(emailField);
  formContainer.appendChild(phoneField);

  const buttonRow = document.createElement('div');
  buttonRow.className = 'd-flex justify-content-center gap-3 p-3';

  const saveBtn = document.createElement('button');
  saveBtn.className = 'btn btn-primary rounded-pill px-4';
  saveBtn.innerText = 'Save';

  const cancelBtn = document.createElement('button');
  cancelBtn.className = 'btn btn-danger text-white rounded-pill px-4';
  cancelBtn.innerText = 'Cancel';

  buttonRow.appendChild(saveBtn);
  buttonRow.appendChild(cancelBtn);
  body.appendChild(formContainer);
  body.appendChild(buttonRow);

  //Only show the cancel if the user has typed something
  let isTyped = false;

  const markTypedInput = (el: HTMLInputElement | HTMLTextAreaElement) => {
      if (el.value.trim() !== "") isTyped = true;
  };

  const nameInput = (formContainer.querySelector('#clientName') as HTMLInputElement);
  const emailInput = (formContainer.querySelector('#clientEmail') as HTMLInputElement);
  const phoneInput = (formContainer.querySelector('#clientPhone') as HTMLInputElement);

  nameInput.addEventListener('input', () => markTypedInput(nameInput));
  emailInput.addEventListener('input', () => markTypedInput(emailInput));
  phoneInput.addEventListener('input', () => markTypedInput(phoneInput));

  cancelBtn.addEventListener('click', () => {
      if (isTyped) {
          showCancelConfirmation(overlay);
      } else {
          overlay.remove();
      }
  });

  saveBtn.addEventListener('click', async () => {
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const phone = phoneInput.value.trim();

    // RESET previous errors
    nameInput.classList.remove("is-invalid");
    emailInput.classList.remove("is-invalid");
    phoneInput.classList.remove("is-invalid");

    let hasError = false;

    if (!name) {
        nameInput.classList.add("is-invalid");
        hasError = true;
    }

    if (!email) {
        emailInput.classList.add("is-invalid");
        hasError = true;
    }

    if (!phone) {
        phoneInput.classList.add("is-invalid");
        hasError = true;
    }

    if (hasError) {
        alert("Please fill out the required fields.");
        return;
    }

    saveBtn.disabled = true;
    try {
      const created = await http.post('/clients/create', {
        name,
        contactEmail: email,
        contactPhone: phone,
      });
      console.log('Client created:', created);
      overlay.remove();

      const clientsPage = document.querySelector('.clients-page') as any;

      if (clientsPage?.reload) {
            clientsPage.reload();   // reload the client page
      }

    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Failed to save client';
      console.error(err);
      alert(msg);
    } finally {
      saveBtn.disabled = false;
    }
  });

  return overlay;
}

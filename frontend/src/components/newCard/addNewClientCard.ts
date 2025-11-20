import { renderCard } from '../cardComponent/cardComponent';
import { createFloatingInput } from '../floatingLabel/floatingLabel';
import http from '../../api/http';

export function renderAddNewClientCard(): HTMLElement {
  const overlay = renderCard({ edit: false, endpoint: 'clients/create' });
  const card = overlay.querySelector('.card') as HTMLElement;
  const header = card.querySelector('.header') as HTMLElement;
  const body = card.querySelector('.body') as HTMLElement;

  header.innerHTML = `<h4 class="m-0 text-center fw-semibold">Add New Client</h4>`;

  const formContainer = document.createElement('div');
  formContainer.className = 'container p-4 rounded';

  //Use the new reusable floating label helpers
  const nameField = createFloatingInput('clientName', 'Name', 'text');
  const emailField = createFloatingInput('clientEmail', 'Email', 'email');
  const phoneField = createFloatingInput('clientPhone', 'Phone', 'tel');

  formContainer.appendChild(nameField);
  formContainer.appendChild(emailField);
  formContainer.appendChild(phoneField);

  const buttonRow = document.createElement('div');
  buttonRow.className = 'd-flex justify-content-end gap-2 p-3';

  const saveBtn = document.createElement('button');
  saveBtn.className = 'btn btn-primary rounded-pill px-4';
  saveBtn.innerText = 'Save';

  const cancelBtn = document.createElement('button');
  cancelBtn.className = 'btn btn-outline-secondary rounded-pill px-4';
  cancelBtn.innerText = 'Cancel';

  buttonRow.appendChild(saveBtn);
  buttonRow.appendChild(cancelBtn);
  body.appendChild(formContainer);
  body.appendChild(buttonRow);

  cancelBtn.addEventListener('click', () => overlay.remove());

  saveBtn.addEventListener('click', async () => {
    const name = (formContainer.querySelector('#clientName') as HTMLInputElement).value.trim();
    const email = (formContainer.querySelector('#clientEmail') as HTMLInputElement).value.trim();
    const phone = (formContainer.querySelector('#clientPhone') as HTMLInputElement).value.trim();

    saveBtn.disabled = true;
    try {
      const created = await http.post('/clients/create', {
        name,
        contactEmail: email,
        contactPhone: phone,
      });
      console.log('Client created:', created);
      overlay.remove();
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

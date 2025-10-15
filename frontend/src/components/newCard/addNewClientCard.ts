import { renderCard } from "../cardComponent/cardComponent";

export function renderAddNewClientCard(): HTMLElement {
    const overlay = renderCard();
    const card = overlay.querySelector('.card') as HTMLElement;
    const header = card.querySelector('.header') as HTMLElement;
    const body = card.querySelector('.body') as HTMLElement;

    header.innerHTML = `<h4 class="m-0 text-center fw-semibold">Add New Client</h4>`;

    const formContainer = document.createElement('div');
    formContainer.className = 'container p-4 rounded';
    formContainer.innerHTML = `
    <div class="mb-3">
      <label for="clientName" class="form-label">Client Name</label>
      <input type="text" id="clientName" class="form-control" placeholder="Enter client name...">
    </div>
    <div class="mb-3">
      <label for="clientEmail" class="form-label">Email</label>
      <input type="email" id="clientEmail" class="form-control" placeholder="Enter client email...">
    </div>
    <div class="mb-3">
      <label for="clientPhone" class="form-label">Phone</label>
      <input type="tel" id="clientPhone" class="form-control" placeholder="Enter phone number...">
    </div>
  `;

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
    saveBtn.addEventListener('click', () => {
        const name = (formContainer.querySelector('#clientName') as HTMLInputElement).value;
        const email = (formContainer.querySelector('#clientEmail') as HTMLInputElement).value;
        const phone = (formContainer.querySelector('#clientPhone') as HTMLInputElement).value;
        console.log('Saving new client:', { name, email, phone });
        overlay.remove();
    });

    return overlay;
}

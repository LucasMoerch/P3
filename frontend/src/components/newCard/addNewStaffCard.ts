import { renderCard } from '../cardComponent/cardComponent';
import { createFloatingInput, createFloatingTextarea } from '../floatingLabel/floatingLabel';

export function renderAddNewStaffCard(): HTMLElement {
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

  //Use the new reusable floating label helpers
  const nameField = createFloatingInput('staffName', 'Name', 'text');
  const descField = createFloatingTextarea('staffDesc', 'Description', 4);

  formContainer.appendChild(nameField);
  formContainer.appendChild(descField);

  // BUTTON ROW
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

  // BUILD CARD
  body.appendChild(formContainer);
  body.appendChild(buttonRow);
  card.appendChild(header);
  card.appendChild(body);
  overlay.appendChild(card);

  cancelBtn.addEventListener('click', () => overlay.remove());
  saveBtn.addEventListener('click', () => {
    const name = (formContainer.querySelector('#itemName') as HTMLInputElement).value;
    const desc = (formContainer.querySelector('#itemDesc') as HTMLTextAreaElement).value;
    console.log('Saving new item:', { name, desc });
    overlay.remove();
  });

  return overlay;
}

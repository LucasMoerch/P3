import { renderCard } from '../cardComponent/cardComponent';

export function renderAddNewCaseCard(): HTMLElement {
  const overlay = renderCard();
  const card = overlay.querySelector('.card') as HTMLElement;
  const header = card.querySelector('.header') as HTMLElement;
  const body = card.querySelector('.body') as HTMLElement;

  header.innerHTML = `<h4 class="m-0 text-center fw-semibold">Add New Case</h4>`;

  const formContainer = document.createElement('div');
  formContainer.className = 'container p-4 rounded';
  formContainer.innerHTML = `
    <div class="mb-3">
      <label for="caseTitle" class="form-label">Case Title</label>
      <input type="text" id="caseTitle" class="form-control" placeholder="Enter case title...">
    </div>
    <div class="mb-3">
      <label for="caseDescription" class="form-label">Description</label>
      <textarea id="caseDescription" class="form-control" rows="4" placeholder="Add a short description..."></textarea>
    </div>
    <div class="mb-3">
      <label for="caseStatus" class="form-label">Status</label>
      <select id="caseStatus" class="form-select">
        <option selected>Choose status...</option>
        <option value="open">Open</option>
        <option value="inProgress">In Progress</option>
        <option value="closed">Closed</option>
      </select>
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
    const title = (formContainer.querySelector('#caseTitle') as HTMLInputElement).value;
    const desc = (formContainer.querySelector('#caseDescription') as HTMLTextAreaElement).value;
    const status = (formContainer.querySelector('#caseStatus') as HTMLSelectElement).value;
    console.log('Saving new case:', { title, desc, status });
    overlay.remove();
  });

  return overlay;
}

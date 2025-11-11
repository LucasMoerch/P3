import { renderCard } from '../cardComponent/cardComponent';
import { createFloatingInput, createFloatingTextarea } from '../floatingLabel/floatingLabel';

export function renderAddNewCaseCard(): HTMLElement {
  const overlay = renderCard();
  const card = overlay.querySelector('.card') as HTMLElement;
  const header = card.querySelector('.header') as HTMLElement;
  const body = card.querySelector('.body') as HTMLElement;

  header.innerHTML = `<h4 class="m-0 text-center fw-semibold">Add New Case</h4>`;

  const formContainer = document.createElement('div');
  formContainer.className = 'container p-4 rounded';

  const titleField = createFloatingInput('caseTitle', 'Case Title', 'text');
  const descriptionField = createFloatingTextarea('caseDescription', 'Description', 4);

  formContainer.appendChild(titleField);
  formContainer.appendChild(descriptionField);

  const dropDown = document.createElement('div');
  dropDown.className = 'mb-3';
  dropDown.innerHTML = `
    <div class="mb-3">
      <select id="caseStatus" class="form-select">
        <option selected disabled>Choose status...</option>
        <option value="OPEN">Open</option>
        <option value="ON_HOLD">On Hold</option>
        <option value="CLOSED">Closed</option>
      </select>
    </div>
  `;

  formContainer.appendChild(dropDown);

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
    const title = (formContainer.querySelector('#caseTitle') as HTMLInputElement).value.trim();
    const description = (
      formContainer.querySelector('#caseDescription') as HTMLTextAreaElement
    ).value.trim();
    const status = (formContainer.querySelector('#caseStatus') as HTMLSelectElement).value;

    if (!title || !description || !status) {
      alert('Please fill in all fields before saving.');
      return;
    }

    const params = new URLSearchParams({ title, description, status });

    try {
      const response = await fetch(`/api/cases/create?${params.toString()}`, { method: 'POST' });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Server responded with ${response.status}: ${text}`);
      }

      const data = await response.json();
      console.log('Case created successfully:', data);
      alert(`Case "${data.title}" created successfully.`);
      overlay.remove();
    } catch (err) {
      console.error('Error creating case:', err);
      alert('Failed to create case. Check console for details.');
    }
  });

  return overlay;
}

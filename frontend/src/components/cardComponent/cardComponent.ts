import './cardComponent.scss';
import http from '../../api/http';
import {showCancelConfirmation} from "../cancelPopUp/cancelPopUp";

type RenderCardOptions = {
  edit?: boolean;
  endpoint?: string;
  data?: Record<string, any>;
  hasChanges?: () => boolean;
};

export function renderCard(options: RenderCardOptions = {}): HTMLElement {
  const overlay = document.createElement('div');
  overlay.className = 'overlay pt-md-5';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');

  let isEdited = false;

  const card = document.createElement('div');
  card.className = 'card bg-card-bg';

  card.addEventListener('click', (ev) => ev.stopPropagation());

  const closeBtn = document.createElement('button');
  closeBtn.className =
    'btn back-button border-0 bg-transparent text-primary position-absolute top-0 start-0 m-3 fs-2';
  closeBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';

  if (options.edit) {
    const editBtn = document.createElement('button');
    editBtn.className =
      'btn edit-button border-0 bg-transparent text-primary position-absolute top-0 end-0 m-3 fs-2';
    editBtn.innerHTML = '<i class="fa-solid fa-pen-to-square"></i>';
    card.appendChild(editBtn);

    editBtn.addEventListener('click', () => {
      //the infoRows line collects all elements with the class .info-row, so make sure to name it this.
      const infoRows = card.querySelectorAll('.info-row');
      //Loops to make sure we get every .info-row class and gets the displayed value.
      infoRows.forEach((row) => {
        const valueSpan: HTMLElement | null = row.querySelector('.value');
        if (!valueSpan) return;

        const field = valueSpan.dataset.field;
        if (!field || valueSpan.dataset.editable === 'false') return;

        //Here it creates an input box, so the user can edit the value.
        if (!valueSpan.querySelector('input')) {
            const currentValue = valueSpan.textContent?.trim() || '';
            const input = document.createElement('input');
            input.type = 'text';
            input.value = currentValue; //Makes sure to insert the current value, after you click edit.
            input.className = 'form-control text-end fw-semibold';
            input.dataset.field = field;
            if (valueSpan.dataset.transform) {
                input.dataset.transform = valueSpan.dataset.transform;
            }
            valueSpan.textContent = '';
            valueSpan.appendChild(input);

            // Mark as edited when user types
            input.addEventListener('input', () => {
                isEdited = true;
            });
        }
      });

      editBtn.remove();

      //Save button implementation
      const saveBtn = document.createElement('button');
      saveBtn.className = 'btn btn-primary position-absolute top-0 end-0 m-3 fs-3 py-1 px-2';
      saveBtn.innerText = 'Save';

      const btnContainer = document.createElement('div');
      btnContainer.className = 'd-flex justify-content-center mt-3';
      btnContainer.appendChild(saveBtn);
      card.appendChild(btnContainer);

      saveBtn.addEventListener('click', async () => {
        const updated: Record<string, unknown> = options.data ? { ...options.data } : {};
        const inputs = card.querySelectorAll<HTMLInputElement>('.info-row .value input');

        // This part takes care of nested fields like profile.displayName to send { profile: { displayName: 'new value' } }
        const setNestedValue = (target: Record<string, unknown>, path: string, value: unknown) => {
          const segments = path.split('.');
          let current: Record<string, unknown> = target;

          for (let i = 0; i < segments.length - 1; i += 1) {
            const segment = segments[i];
            if (
              current[segment] === undefined ||
              current[segment] === null ||
              typeof current[segment] !== 'object'
            ) {
              current[segment] = {};
            }
            current = current[segment] as Record<string, unknown>;
          }

          current[segments[segments.length - 1]] = value;
        };

        const updates: Array<{ input: HTMLInputElement; value: string | string[] }> = [];

        const toDisplayValue = (val: string | string[]): string =>
          Array.isArray(val) ? val.join(', ') : val;

        inputs.forEach((input) => {
          const field = input.dataset.field;
          if (!field) return;
          let value: string | string[] = input.value;
          switch (input.dataset.transform) {
            case 'uppercase':
              value = value.toUpperCase();
              break;
            case 'commaList':
              value = value
                .split(',')
                .map((part) => part.trim())
                .filter((part) => part.length > 0);
              break;
            default:
              break;
          }

          setNestedValue(updated, field, value);
          updates.push({ input, value });
        });

        // prevent id changes if present
        if ('id' in (options.data ?? {})) {
          updated.id = (options.data as any).id;
        }

        try {
          saveBtn.disabled = true;
          const prev = saveBtn.innerText;
          saveBtn.innerText = 'Saving...';

          await http.put(`/${options.endpoint}/${options.data?.id}`, updated);

          // Replace inputs back to text
          updates.forEach(({ input, value }) => {
            const parent = input.parentElement;
            if (!parent) return;
            parent.textContent = toDisplayValue(value);
          });

          overlay.remove();
          saveBtn.innerText = prev;
        } catch (e) {
          console.error(e);
          alert('Failed to save changes.');
          saveBtn.disabled = false;
        }
      });

      editBtn.disabled = true; // Disable while editing, so you cant press it again.
    });
  }
  // Append card inside overlay

  const header = document.createElement('div');
  header.className = 'header mt-4 text-center fw-semibold fs-3 ';
  header.innerText = 'placeholder';

  const body = document.createElement('div');
  body.className = 'body';

  closeBtn.addEventListener("pointerdown", (ev) => {
      ev.stopPropagation();
      ev.preventDefault();
  });

  closeBtn.addEventListener('click', (ev) => {
      ev.stopPropagation();
      ev.preventDefault();

      const changed = options.hasChanges?.() ?? isEdited;

      if (changed) {
          showCancelConfirmation(overlay);
      } else {
          overlay.remove();
      }
  });
  card.appendChild(closeBtn);
  overlay.appendChild(card);
  card.appendChild(header);
  card.appendChild(body);

  //Removes overlay if you click outside
  overlay.addEventListener('click', (event) => {
      if (!card.contains(event.target as Node)) {
          const changed = options.hasChanges?.() ?? isEdited;
          if (changed) showCancelConfirmation(overlay);
          else overlay.remove();
      }
  });

  // Return overlay, but let caller add content to the card
  return overlay;
}

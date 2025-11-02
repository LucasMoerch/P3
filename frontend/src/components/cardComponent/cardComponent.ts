import './cardComponent.scss';

export function renderCard(edit?: Boolean): HTMLElement {
  const overlay = document.createElement('div');
  overlay.className = 'overlay pt-md-5';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');

  const card = document.createElement('div');
  card.className = 'card bg-card-bg';

  const closeBtn = document.createElement('button');
  closeBtn.className =
    'btn back-button border-0 bg-transparent text-primary position-absolute top-0 start-0 m-3 fs-2';
  closeBtn.innerHTML = '<i class="fa-solid fa-arrow-left"></i>';

  if (edit) {
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

        //Save button implementation
        const saveBtn = document.createElement('button');
        saveBtn.className = 'btn btn-primary btn-lg';
        saveBtn.innerText = 'Save';

        const btnContainer = document.createElement('div');
        btnContainer.className = 'd-flex justify-content-center mt-3';
        btnContainer.appendChild(saveBtn);
        card.appendChild(btnContainer);

        saveBtn.addEventListener('click', () => {
            overlay.remove();
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

  closeBtn.addEventListener('click', () => {
    overlay.remove();
  });
  card.appendChild(closeBtn);
  overlay.appendChild(card);
  card.appendChild(header);
  card.appendChild(body);

  // Return overlay, but let caller add content to the card
  return overlay;
}

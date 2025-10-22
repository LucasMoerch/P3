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
    'btn back-button border-0 bg-transparent text-primary position-absolute top-0 m-3 fs-2';
  closeBtn.innerHTML = '<i class="fa-solid fa-arrow-left"></i>';

  if (edit) {
    const editBtn = document.createElement('button');
    editBtn.className =
      'btn back-button border-0 bg-transparent text-primary position-absolute top-0  end-0 m-3 fs-2';
    editBtn.innerHTML = '<i class="fa-solid fa-pen-to-square"></i>';
    card.appendChild(editBtn);
  }
  // Append card inside overlay

  const header = document.createElement('div');
  header.className = 'header mt-4';
  header.innerHTML = `<h4 class="m-0 text-center fw-semibold">Time Registration</h4>`;

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

import './cardComponent.scss';

export function renderCard(): HTMLElement {
  // Overlay
  const overlay = document.createElement('div');
  overlay.className = 'overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');

  // Card
  const card = document.createElement('div');
  card.className = 'card bg-card-bg';
  overlay.appendChild(card);

  // Header
  const header = document.createElement('div');
  header.className = 'header container bg-primary py-2';

  const row = document.createElement('div');
  row.className = 'row align-items-center';

  // Left column
  const colLeft = document.createElement('div');
  colLeft.className = 'col-3';
  const back = document.createElement('button');
  back.className = 'btn btn-bg-card-bg btn-sm';
  back.innerHTML = '<i class="fa-solid fa-arrow-left"></i>';
  colLeft.appendChild(back);

  // Center column
  const colCenter = document.createElement('div');
  colCenter.className = 'col text-center';
  const title = document.createElement('div');
  title.className = 'h5 mb-0 text-white';
  title.textContent = 'Page name';
  colCenter.appendChild(title);

  // Right column (placeholder)
  const colRight = document.createElement('div');
  colRight.className = 'col-3 text-end';

  // assemble
  row.appendChild(colLeft);
  row.appendChild(colCenter);
  row.appendChild(colRight);
  header.appendChild(row);
  card.appendChild(header);

  // Body
  const body = document.createElement('div');
  body.className = 'body';
  const p = document.createElement('p');
  p.textContent = 'Track your time spent on tasks.';
  body.appendChild(p);
  card.appendChild(body);

  back.addEventListener('click', (e) => {
    overlay.remove();
  }); // Close card

  // Return overlay, but let caller add content to the card
  return overlay;
}

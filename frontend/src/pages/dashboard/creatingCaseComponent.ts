import './creatingCaseComponent.scss';

export function renderNewCase(): HTMLElement{
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');

    const card = document.createElement('div');
    card.className = 'card bg-card-bg';

    // Append card inside overlay

    const header = document.createElement('div');
    header.className = 'header';
    header.innerText = 'New Case';

    const body = document.createElement('div');
    body.className = 'body';
    body.innerHTML = `<p>Create a new case.</p>`;

    overlay.appendChild(card);
    card.appendChild(header);
    card.appendChild(body);

    // Return overlay, but let caller add content to the card
    return overlay;
}


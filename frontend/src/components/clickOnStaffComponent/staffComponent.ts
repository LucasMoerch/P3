import './staffStyleComponent.scss';

export function renderClickedStaff (): HTMLElement {
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');

    const card = document.createElement('div');
    card.className = 'card bg-card-bg';

    // Append card inside overlay

    const header = document.createElement('div');
    header.className = 'header';

    const body = document.createElement('div');
    body.className = 'body';

    const closeBtn = document.createElement('button');
    closeBtn.className =
        'btn text-primary col-2 mt-4';
    closeBtn.innerHTML = '<i class="fa-solid fa-arrow-left fs-1"></i>';

    closeBtn.addEventListener('click', () => {
        console.log('back clicked')
        overlay.remove();
    });

    overlay.appendChild(card);
    card.appendChild(header);
    card.appendChild(body);
    card.appendChild(closeBtn);

    // Return overlay, but let caller add content to the card
    return overlay;
}

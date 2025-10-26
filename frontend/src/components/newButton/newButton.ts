import './newButton.scss';
import { renderAddNewStaffCard } from '../newCard/addNewStaffCard';
import { renderAddNewClientCard } from '../newCard/addNewClientCard';
import { renderAddNewCaseCard } from '../newCard/addNewCaseCard';

export function renderNewButton(label: string = 'New'): HTMLElement {
  const addButton = document.createElement('button');
  addButton.className = 'button';
  addButton.textContent = label + ' ';

  // Import icon from Font Awesome
  const newClientIcon = document.createElement('i');
  newClientIcon.className = 'fa-solid fa-user-plus';
  addButton.appendChild(newClientIcon);

  addButton.addEventListener('click', () => {
    const path = window.location.pathname.toLowerCase();

    let cardEl: HTMLElement | null = null;

    if (path.includes('staff')) {
      cardEl = renderAddNewStaffCard();
    } else if (path.includes('client')) {
      cardEl = renderAddNewClientCard();
    } else if (path.includes('case')) {
      cardEl = renderAddNewCaseCard();
    } else {
      console.warn('No matching overlay found for path:', path);
      return;
    }

    document.body.appendChild(cardEl);
  });

  return addButton;
}

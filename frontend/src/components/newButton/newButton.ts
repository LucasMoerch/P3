import './newButton.scss';
import { renderAddNewStaffCard } from '../newCard/addNewStaffCard';
import { renderAddNewClientCard } from '../newCard/addNewClientCard';
import { renderAddNewCaseCard } from '../newCard/addNewCaseCard';

export function renderNewButton(onClick?: () => void): HTMLElement {
  const addButton = document.createElement('button');
  addButton.className = 'button';

  const newClientIcon = document.createElement('i');
  newClientIcon.className = 'fa-solid fa-user-plus text-dark';
  addButton.appendChild(newClientIcon);

  addButton.addEventListener('click', () => {
    const path = window.location.pathname.toLowerCase()
    if (onClick) {
      onClick();
    }
    else if (path.includes('client')) {
      document.body.appendChild(renderAddNewClientCard());
    }

    else if (path.includes('case')) {
      document.body.appendChild(renderAddNewCaseCard());
    }
  });

  return addButton;
}

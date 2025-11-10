import './newButton.scss';
import { renderAddNewStaffCard } from '../newCard/addNewStaffCard';
import { renderAddNewClientCard } from '../newCard/addNewClientCard';
import { renderAddNewCaseCard } from '../newCard/addNewCaseCard';

export function renderNewButton(onClick?: () => void): HTMLElement {
  const addButton = document.createElement('button');
  addButton.className = 'button';

  const newClientIcon = document.createElement('i');
  newClientIcon.className = 'fa-solid fa-user-plus';
  addButton.appendChild(newClientIcon);

  addButton.addEventListener('click', () => {
  if (onClick) {
      onClick();
      }
  });

  return addButton;
}

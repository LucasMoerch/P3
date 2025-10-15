import './newButton.scss';

export function renderNewButton() {
  // Create client button
  const addNewButton = document.createElement('button');
  addNewButton.className = 'newClient-button';

  // Import icon from Font Awesome
  const newClientIcon = document.createElement('i');
  newClientIcon.className = 'fa-solid fa-user-plus';
  addNewButton.appendChild(newClientIcon);

  return addNewButton;
}

import { renderNewButton } from '../newButton/newButton';
import './searchBar.scss';
import { isAdmin } from '../../auth/auth';

export function renderSearchComponent(): HTMLElement {
  const searchDiv = document.createElement('div');
  searchDiv.className = 'Search';

  // Create input
  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = 'Search...';
  input.className = 'Search-input';

  // Create search button
  const searchButton = document.createElement('button');
  searchButton.className = 'search-button';

  // Import icon from Font Awesome
  const searchIcon = document.createElement('i');
  searchIcon.className = 'fa-solid fa-magnifying-glass';
  searchButton.appendChild(searchIcon);

  // Example: log input value when clicked
  searchButton.addEventListener('click', () => {
    console.log('Searching for:', input.value);
  });

  // Group the input field and search button into a nested container
  const searchContainer = document.createElement('div');
  searchContainer.className = 'search-container';

  // Append input and button to the container
  searchContainer.appendChild(input);
  searchContainer.appendChild(searchButton);
  searchDiv.appendChild(searchContainer);

  return searchDiv;
}

import { renderNewButton } from '../newButton/newButton';
import './searchBar.scss';
import { isAdmin } from '../../auth/auth';

export function renderSearchComponent(onSearch: (value: string) => void): HTMLElement {
  const searchDiv = document.createElement('div');
  searchDiv.className = 'Search';

  //Bootstrap floating form wrapper
  const formFloating = document.createElement('div');
  formFloating.className = 'form-floating flex-grow-1';

  //Input field
  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'form-control bg-white text-dark shadow-none pe-5';
  input.id = 'floatingSearch';
  input.placeholder = ''; // Bootstrap floating labels still need a placeholder

  //Label (for floating effect)
  const label = document.createElement('label');
  label.htmlFor = 'floatingSearch';
  label.textContent = 'Search';

  // Append input + label to form-floating
  formFloating.appendChild(input);
  formFloating.appendChild(label);

  // Create search button
  const searchButton = document.createElement('button');
  searchButton.className = 'search-button d-none';

  formFloating.appendChild(searchButton);

  // Import icon from Font Awesome
  const searchIcon = document.createElement('i');
  searchIcon.className = 'fa-solid fa-magnifying-glass text-dark';
  searchButton.appendChild(searchIcon);

  // Show icon when typing
  input.addEventListener('input', () => {
      searchButton.classList.toggle('d-none', input.value.trim().length === 0);
      onSearch(input.value.trim().toLowerCase());
  });

  // Group the input field and search button into a nested container
  const searchContainer = document.createElement('div');
  searchContainer.className = 'search-container d-flex justify-content-between';

  // Append input and button to the container
  searchContainer.appendChild(formFloating);
  searchDiv.appendChild(searchContainer);

  if (isAdmin()) {
    searchContainer.appendChild(renderNewButton());
  }

  return searchDiv;
}

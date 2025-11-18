import { UserDTO } from '../../pages/staff';

// A reusable checkbox dropdown for assigning users
export function createCheckboxDropdown(
  allUsers: UserDTO[],
  initialSelectedIds: string[] = [],
): {
  container: HTMLElement;
  getSelectedIds: () => string[];
  setSelectedIds: (ids: string[]) => void;
} {
  // Lookup users by id
  const usersById = new Map<string, UserDTO>(allUsers.map((u) => [u.id, u]));

  // Track selected ids in a Set
  const selected = new Set<string>(initialSelectedIds);

  const container = document.createElement('div');
  container.className = 'checkbox-dropdown position-relative d-inline-block';

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'btn btn-secondary dropdown-toggle';
  button.setAttribute('aria-expanded', 'false');
  button.style.minWidth = '200px';

  const getSelectedNames = (): string[] =>
    Array.from(selected).map((id) => {
      const user = usersById.get(id);
      return user ? user.profile?.displayName || user.auth.email : id;
    });

  const updateButtonText = (): void => {
    const names = getSelectedNames();
    button.textContent = names.length ? names.join(', ') : 'Select users';
  };

  // Initial label
  updateButtonText();

  // Dropdown list container
  const list = document.createElement('div');
  list.className = 'checkbox-dropdown-list shadow-sm border bg-white position-absolute';
  list.style.zIndex = '1000';
  list.style.display = 'none';
  list.style.maxHeight = '240px';
  list.style.overflowY = 'auto';
  list.style.right = '0';
  list.style.left = '0';
  list.style.padding = '8px';

  // Build one checkbox row per user
  allUsers.forEach((user) => {
    const row = document.createElement('label');
    row.className = 'd-flex align-items-center gap-2 checkbox-row';
    row.style.marginBottom = '6px';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.value = user.id;
    checkbox.checked = selected.has(user.id);

    const labelText = document.createElement('span');
    labelText.textContent = user.profile?.displayName || user.auth.email;

    checkbox.addEventListener('change', () => {
      if (checkbox.checked) {
        selected.add(user.id);
      } else {
        selected.delete(user.id);
      }
      updateButtonText();
    });

    row.appendChild(checkbox);
    row.appendChild(labelText);
    list.appendChild(row);
  });

  // Toggle dropdown visibility on button click
  button.addEventListener('click', (event) => {
    event.stopPropagation();
    const isVisible = list.style.display === 'block';
    list.style.display = isVisible ? 'none' : 'block';
    button.setAttribute('aria-expanded', String(!isVisible));
  });

  // Close dropdown when clicking outside
  const handleDocumentClick = (event: MouseEvent) => {
    if (!container.contains(event.target as Node)) {
      list.style.display = 'none';
      button.setAttribute('aria-expanded', 'false');
    }
  };
  document.addEventListener('click', handleDocumentClick);

  // Compose container
  container.appendChild(button);
  container.appendChild(list);

  return {
    container,
    getSelectedIds: () => Array.from(selected),
    setSelectedIds: (ids: string[]) => {
      selected.clear();
      ids.forEach((id) => selected.add(id));

      const inputs = list.querySelectorAll<HTMLInputElement>('input[type="checkbox"]');
      inputs.forEach((input) => {
        input.checked = selected.has(input.value);
      });

      updateButtonText();
    },
  };
}

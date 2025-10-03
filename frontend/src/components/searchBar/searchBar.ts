export function renderSearchComponent(): HTMLElement {
    const searchDiv = document.createElement('div');
    searchDiv.className = 'Search';

    // Create input
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Search...';
    input.className = 'Search-input';

    // Create button
    const button = document.createElement('button');
    button.textContent = 'Search';
    button.className = 'Search-button';

    // Example: log input value when clicked
    button.addEventListener('click', () => {
        console.log('Searching for:', input.value);
    });

    // Append input and button to the container
    searchDiv.appendChild(input);
    searchDiv.appendChild(button);

    return searchDiv;
}
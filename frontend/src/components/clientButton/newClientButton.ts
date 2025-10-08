import './newClientButton.scss';

export function renderNewClientButton(){
    const searchDiv = document.createElement('div');
    searchDiv.className = 'Search';

    // Create client button
    const newClientButton = document.createElement('button');
    newClientButton.className = 'newClient-button';

    // Import icon from Font Awesome
    const newClientIcon = document.createElement ('i');
    newClientIcon.className = "fa-solid fa-user-plus"
    newClientButton.appendChild(newClientIcon);

    searchDiv.appendChild(newClientButton);

    return newClientButton;
}
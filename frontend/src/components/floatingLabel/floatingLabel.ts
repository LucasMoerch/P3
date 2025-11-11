// Creates a floating label input, used for normal text, email, phone etc.
export function createFloatingInput(
    id: string,
    labelText: string,
    type: 'text' | 'email' | 'tel' | 'password' = 'text', //you can add more types depending on what you want.
    placeholder: string = ''
): HTMLElement {
    // Wrapper for the floating input
    const wrapper = document.createElement('div');
    wrapper.className = 'form-floating mb-3';

    // Input field
    const input = document.createElement('input');
    input.type = type;
    input.className = 'form-control bg-white text-dark shadow-none';
    input.id = id;
    input.placeholder = placeholder || labelText; // required for floating label

    // Label text
    const label = document.createElement('label');
    label.htmlFor = id;
    label.textContent = labelText;

    // Add input and label to wrapper
    wrapper.appendChild(input);
    wrapper.appendChild(label);
    return wrapper;
}

// Creates a floating label textarea, used for description
export function createFloatingTextarea(
    id: string,
    labelText: string,
    rows: number = 3,
    placeholder: string = ''
): HTMLElement {
    // Wrapper for the floating textarea
    const wrapper = document.createElement('div');
    wrapper.className = 'form-floating mb-3';

    // Textarea element
    const textarea = document.createElement('textarea');
    textarea.className = 'form-control bg-white text-dark shadow-none';
    textarea.id = id;
    textarea.placeholder = placeholder || labelText; // required for floating label
    textarea.rows = rows;

    // Label text
    const label = document.createElement('label');
    label.htmlFor = id;
    label.textContent = labelText;

    // Add textarea and label to wrapper
    wrapper.appendChild(textarea);
    wrapper.appendChild(label);
    return wrapper;
}
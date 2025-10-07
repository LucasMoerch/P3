export function renderLogo(): HTMLElement {
    const div = document.createElement('div');
    const logoDiv = document.createElement("div");
    logoDiv.className = "text-center mb-4";
    logoDiv.innerHTML = `
    <img src="/images/enevold.jpg" alt="Logo" class="img-fluid mb-3 login-logo">
  `;

    div.appendChild(logoDiv);
    return div;
}

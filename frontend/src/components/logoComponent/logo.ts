// Logo for login page
export function renderLogo(): HTMLElement {
  const div = document.createElement('div');
  const logoDiv = document.createElement('div');
  logoDiv.className = 'text-center mb-4';
  logoDiv.innerHTML = `
    <img src="/images/logo-transparent-bg.png" alt="Logo" class="img-fluid mb-3 login-logo">
  `;

  div.appendChild(logoDiv);
  return div;
}
// Logo for navbar
export function renderLogoNavbar(): HTMLImageElement {
  const img = document.createElement('img');
  img.src = '/images/logo-transparent-bg.png';
  img.alt = 'Logo';
  img.style.height = '40px';
  img.style.width = 'auto';
  img.style.display = 'block';
  return img;
}

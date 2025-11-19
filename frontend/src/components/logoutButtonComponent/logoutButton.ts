// components/LogoutButton/LogoutButton.ts
import http from '../../api/http';
import { clearAuth } from '../../auth/auth';
import { navigate } from '../../main';

export function renderLogoutButton(): HTMLButtonElement {
  const button = document.createElement('button');
  button.className = 'btn btn-danger w-100 text-white';
  button.innerHTML = `
        <i class="fa-solid fa-right-from-bracket me-2"></i>
        Logout
    `;

  button.addEventListener('click', async () => {
    // show spinner instantly
    button.disabled = true;
    button.innerHTML = `
            <i class="fa-solid fa-spinner fa-spin me-2"></i>
            Logging out...
        `;

    // Force a DOM paint before continuing (important!)
    await new Promise(requestAnimationFrame);

    try {
      await http.post('/logout');
    } catch (err) {
      console.warn('Logout request failed:', err);
    }

    // wait ~250ms so animation is visible
    await new Promise(resolve => setTimeout(resolve, 20));

    clearAuth();
    localStorage.removeItem('token');
    sessionStorage.clear();

    navigate('/login');
    window.location.reload(); // optional, but fine
  });

  return button;
}

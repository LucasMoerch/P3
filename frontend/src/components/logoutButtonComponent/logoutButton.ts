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
        button.disabled = true;
        button.classList.add('loading');

        try {
            await http.post('/logout');
        } catch (err) {
            console.warn('Logout request failed:', err);
        } finally {
            clearAuth();
            localStorage.removeItem('token');
            sessionStorage.clear();
            navigate('/login');
            window.location.reload(); // fast & clean reset
        }
    });

    return button;
}

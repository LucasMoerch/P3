import http from "../api/http";
import { renderLogo } from '../components/logoComponent/logo';
import { navigate } from '../main';
// Uses google_client_id from .env
const GOOGLE_CLIENT_ID = (process.env.GOOGLE_CLIENT_ID as string) || '';

export function renderLoginPage(): HTMLElement {
  const container = document.createElement('div');
  container.className = 'container d-flex justify-content-center align-items-center vh-100';

  const row = document.createElement('div');
  row.className = 'row w-100 justify-content-center';

  const col = document.createElement('div');
  col.className = 'col-12 col-md-8 col-lg-6';

  const card = document.createElement('div');
  card.className = 'card p-5 login-card d-flex flex-column justify-content-center';

  const form = document.createElement('form');
  form.id = 'login-form';
  form.innerHTML = `
    <div class="mb-3">
      <label for="email" class="form-label">E-mail</label>
      <input type="email" class="form-control" id="email" placeholder="Enter your email">
    </div>
    <div class="mb-3">
      <label for="password" class="form-label">Password</label>
      <input type="password" class="form-control" id="password" placeholder="Enter your password">
    </div>
    <div class="d-grid mb-3">
      <button type="submit" class="btn btn-primary">Log in</button>
    </div>
    <div class="text-center text-muted mb-2">or</div>
  `;

  const gContainer = document.createElement('div');
  gContainer.innerHTML = `
    <div id="g_id_onload"
         data-client_id="${GOOGLE_CLIENT_ID}"
         data-callback="onGoogleCredential"
         data-auto_prompt="false">
    </div>
    <div class="g_id_signin" data-type="standard" data-size="large" data-theme="outline"></div>
  `;

  // load GIS script once
  function ensureGisLoaded() {
    if (document.querySelector('script[src*="gsi/client"]')) return;
    const s = document.createElement('script');
    s.src = 'https://accounts.google.com/gsi/client';
    s.async = true;
    s.defer = true;
    document.head.appendChild(s);
  }

  // global callback for GIS
  (window as any).onGoogleCredential = async (resp: { credential: string }) => {
    try {
      // Try to activate the user
      const id_token = resp.credential;
      const data = await http.post('/users/activate', new URLSearchParams({ id_token }));

      // success
      navigate('home');
    } catch (err: any) {
        // Axios errors, err.response?.data has server message
        const api = err?.response?.data;
        const msg =
            api?.message ||
            api?.error ||
            err?.message ||
            'Login failed';

        if (String(msg).includes('Invite not found')) {
            alert('You are not yet invited to the platform. Contact an administrator.');
        } else if (api?.error === 'InvalidIdToken') {
            alert('Login failed: Invalid token');
        } else {
            alert(`Login failed: ${msg}`);
        }
    }
  };

  // regular form submit
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    // For now, just go home
    navigate('home');
  });

  ensureGisLoaded();

  // assemble
  card.appendChild(renderLogo());
  card.appendChild(form);
  card.appendChild(gContainer);

  col.appendChild(card);
  row.appendChild(col);
  container.appendChild(row);
  return container;
}

import http from '../../api/http';
import { renderLogo } from '../../components/logoComponent/logo';
import { navigate } from '../../main';
import { initAuth } from '../../auth/auth';
import './loginStyles.scss';

// Uses google_client_id from .env
const GOOGLE_CLIENT_ID = (process.env.GOOGLE_CLIENT_ID as string) || '';

export function renderLoginPage(): HTMLElement {
  document.body.style.backgroundImage = `url("../images/toemrer.jpeg")`;
  document.body.style.backgroundSize = 'cover';
  document.body.style.backgroundPosition = 'center';
  document.body.style.backgroundRepeat = 'no-repeat';
  document.body.style.backgroundAttachment = 'fixed';
  document.body.style.overflow = 'hidden';

  const container = document.createElement('div');
  container.className = 'container d-flex justify-content-center align-items-center vh-100';

  const card = document.createElement('div');
  card.className = 'card p-5 login-card d-flex flex-column justify-content-center ';

  const gContainer = document.createElement('div');
  gContainer.innerHTML = `
    <div id="g_id_onload"
         data-client_id="${GOOGLE_CLIENT_ID}"
         data-callback="onGoogleCredential"
         data-auto_prompt="false">
    </div>
    <div id="gBtn" class="g_id_signin" data-type="standard" data-size="large" data-theme="outline"></div>
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
      await initAuth();
      document.body.style.backgroundImage = '';
    } catch (err: any) {
      // Axios errors, err.response?.data has server message
      const api = err?.response?.data;
      const msg = api?.message || api?.error || err?.message || 'Login failed';

      if (String(msg).includes('Invite not found')) {
        alert('You are not yet invited to the platform. Contact an administrator.');
      } else if (api?.error === 'InvalidIdToken') {
        alert('Login failed: Invalid token');
      } else {
        alert(`Login failed: ${msg}`);
      }
    }
  };

  ensureGisLoaded();

  // assemble
  container.appendChild(card);
  card.appendChild(renderLogo());
  card.appendChild(gContainer);

  return container;
}

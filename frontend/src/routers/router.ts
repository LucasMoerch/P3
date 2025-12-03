
import { renderHomePage } from '../pages/home';
import { renderLoginPage } from '../pages/loginPage/login';
import { renderCasesPage } from '../pages/cases';
import { renderClientsPage } from '../pages/clients';
import { renderMyProfilePage } from '../pages/myProfile';
import { renderStaffPage } from '../pages/staff';
import { isAuthenticated } from '../auth/auth';

export function resolveRoute(path: string): HTMLElement {
  // If not authenticated, always go to login
  if (!isAuthenticated() && path !== '/login' && path !== '/home') {
    document.location.href = '/login';
  }

  switch (path) {
    case '/login':
      return renderLoginPage();

    case '/cases':
      return renderCasesPage();

    case '/clients':
      return renderClientsPage();

    case '/myProfile':
      return renderMyProfilePage();

    case '/staff':
      return renderStaffPage();

    default:
      return renderHomePage();
  }
}

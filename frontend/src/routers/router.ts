import { renderHomePage } from '../pages/home';
import { renderLoginPage } from '../pages/login';
import { renderCasesPage } from '../pages/cases';
import { renderClientPage } from '../pages/client';
import { renderMyProfilePage } from '../pages/myProfile';
import { renderStaffPage } from '../pages/staff';

export function resolveRoute(path: string): HTMLElement {
  switch (path) {
    case '/login':
      return renderLoginPage();

    case '/cases':
      return renderCasesPage();

    case '/client':
      return renderClientPage();

    case '/myProfile':
      return renderMyProfilePage();

    case '/staff':
      return renderStaffPage();

    default:
      return renderHomePage();
  }
}

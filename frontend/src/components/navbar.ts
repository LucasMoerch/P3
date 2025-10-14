import { navigate } from '../main';
import { renderLogoNavbar } from "./logoComponent/logo";

export function renderHeaderAndNavbar(): HTMLElement {
  // Header container
  const header = document.createElement('nav');
  header.className = 'navbar navbar-dark bg-dark px-3 shadow-lg';
  const logo = renderLogoNavbar();
  header.appendChild(logo);

  // Page title
  const title = document.createElement('span');
  title.className = 'navbar-brand mb-0 fw-bold text-secondary';
  title.innerText = 'Dashboard';
  header.appendChild(title);

  // Buttons
  const button = document.createElement('button');
  button.className = 'btn btn-outline-secondary';
  button.setAttribute('type', 'button');
  button.setAttribute('data-bs-toggle', 'offcanvas');
  button.setAttribute('data-bs-target', '#sidebar');
  button.innerHTML = '<i class="fa-solid fa-ellipsis"></i>';
  header.appendChild(button);

  // Sidebar
  const sidebar = document.createElement('div');
  sidebar.className = 'offcanvas offcanvas-start bg-dark text-white shadow-lg';
  sidebar.id = 'sidebar';
  sidebar.tabIndex = -1;
  sidebar.style.setProperty('--bs-offcanvas-width', 'fit-content');

  // Sidebar header
  const sidebarHeader = document.createElement('div');
  sidebarHeader.className = 'offcanvas-header';

  const sidebarTitle = document.createElement('h5');
  sidebarTitle.className = 'offcanvas-title';

  const closeBtn = document.createElement('button');
  closeBtn.className = 'btn-close btn-close-white';
  closeBtn.setAttribute('data-bs-dismiss', 'offcanvas');
  sidebarHeader.appendChild(sidebarTitle);
  sidebarHeader.appendChild(closeBtn);

  sidebar.appendChild(sidebarHeader);

  // Sidebar body
  const sidebarBody = document.createElement('div');
  sidebarBody.className = 'offcanvas-body';

  const ul = document.createElement('ul');
  ul.className = 'list-unstyled';

  // Menu items
  const menuItems: { label: string; page: string; icon: string }[] = [
    { label: 'Dashboard', page: 'dashboard', icon: '<i class="fa-solid fa-house"></i>' },
    { label: 'Staff', page: 'staff', icon: '<i class="fa-solid fa-clipboard-user"></i>' },
    { label: 'Clients', page: 'clients', icon: '<i class="fa-solid fa-users"></i>' },
    { label: 'Cases', page: 'cases', icon: '<i class="fa-solid fa-suitcase"></i>' },
    { label: 'My Profile', page: 'profile', icon: '<i class="fa-solid fa-user"></i>' },
  ];

  menuItems.forEach((item) => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = '/' + item.page;
    a.className = 'nav-link text-secondary fs-2 p-3';
    a.dataset.page = item.page;
    a.innerHTML = `${item.icon} ${item.label}`;

    li.appendChild(a);
    ul.appendChild(li);
  });

  sidebarBody.appendChild(ul);
  sidebar.appendChild(sidebarBody);

  // Attach click handlers
  ul.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', (event: MouseEvent) => {
      event.preventDefault();
      const page = (event.currentTarget as HTMLElement).dataset.page;
      if (page){
          navigate(page);
          title.innerText = page.charAt(0).toUpperCase() + page.slice(1);
      }

      // Close sidebar after click
      const sidebarEl = document.getElementById('sidebar');
      if (sidebarEl) {
        const bsOffcanvas = (window as any).bootstrap.Offcanvas.getInstance(sidebarEl);
        bsOffcanvas?.hide();
      }
    });
  });

  logo.addEventListener('click', () => {
      navigate('dashboard');
      title.innerText = "Dashboard";
  });


  // Wrapper container
  const container = document.createElement('div');
  container.appendChild(header);
  container.appendChild(sidebar);

  return container;
}

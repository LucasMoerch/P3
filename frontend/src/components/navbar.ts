import { navigate } from '../main';

export function getPageTitle(path: string): string {
  switch (path) {
    case "/dashboard":
      return "Dashboard";
    case "/staff":
      return "Staff";
    case "/clients":
      return "Clients";
    case "/cases":
      return "Cases";
    case "/profile":
      return "My Profile";
    case "/login":
      return "Login";
    default:
      return "Home";
  }
}

export function renderHeaderAndNavbar(): HTMLElement {
  // Header container
  const header = document.createElement('nav');
  header.className = 'navbar navbar-dark bg-dark px-3';

  // Page title
  const title = document.createElement('span');
  title.className = 'navbar-brand mb-0 h1';
  title.id = 'navbar-title';
  title.innerText = getPageTitle(location.pathname);
  header.appendChild(title);

  // Buttons
  const button = document.createElement('button');
  button.className = 'btn btn-outline-light';
  button.setAttribute('type', 'button');
  button.setAttribute('data-bs-toggle', 'offcanvas');
  button.setAttribute('data-bs-target', '#sidebar');
  button.innerText = '...';
  header.appendChild(button);

  // Sidebar
  const sidebar = document.createElement('div');
  sidebar.className = 'offcanvas offcanvas-start bg-dark text-white';
  sidebar.id = 'sidebar';
  sidebar.tabIndex = -1;

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
   { label: "Dashboard", page: "/dashboard", icon: '<i class="fa-solid fa-house-user"></i>' },
   { label: "Staff", page: "/staff", icon: '<i class="fa-solid fa-user-tie"></i>' },
   { label: "Clients", page: "/clients", icon: '<i class="fa-solid fa-users"></i>' },
   { label: "Cases", page: "/cases", icon: '<i class="fa-solid fa-folder-open"></i>' },
   { label: "My Profile", page: "/profile", icon: '<i class="fa-solid fa-user"></i>' },
  ];

  menuItems.forEach((item) => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = '/' + item.page;
    a.className = 'nav-link text-white fs-1';
    a.dataset.page = item.page;
    a.innerHTML = `${item.icon} <span class="ms-2">${item.label}</span>`;

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
      if (page) navigate(page);

      // Close sidebar after click
      const sidebarEl = document.getElementById('sidebar');
      if (sidebarEl) {
        const bsOffcanvas = (window as any).bootstrap.Offcanvas.getInstance(sidebarEl);
        bsOffcanvas?.hide();
      }
    });
  });

  // Wrapper container
  const container = document.createElement('div');
  container.appendChild(header);
  container.appendChild(sidebar);

  return container;
}

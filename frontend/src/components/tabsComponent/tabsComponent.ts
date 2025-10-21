import './tabsStyling.scss';

export function renderTabs() {
  const tabContainer = document.createElement('div');
  const tabDiv = `<ul class="nav nav-tabs nav-fill">
    <li class="nav-item">
      <a class="nav-link active" aria-current="page"><i class="fa-solid fa-paperclip"></i>Files</a>
    </li>
    <li class="nav-item">
      <a class="nav-link"><i class="fa-solid fa-italic"></i>Description</a>
    </li>
    <li class="nav-item">
      <a class="nav-link"><i class="fa-solid fa-note-sticky"></i>Notes</a>
    </li>
    </ul>`;

  function handleTabClick(event: Event) {
    const target = event.target as HTMLElement;
    if (target.classList.contains('nav-link')) {
      const tabs = tabContainer.querySelectorAll('.nav-link');
      tabs.forEach((tab) => tab.classList.remove('active'));
      target.classList.add('active');
    }
  }

  tabContainer.addEventListener('click', handleTabClick);
  tabContainer.innerHTML = tabDiv;
  return tabContainer;
}

import './tabsStyling.scss';
import { loadFiles, FileTabConfig, EntityType } from './fileTab';
import { loadTimeEntries } from './timeTab';
import { renderDescriptionTab } from './descTab';

interface TabsConfig {
  entityType: EntityType;
  entityId: string;
  description?: string;
}

export function renderTabs(config: TabsConfig) {
  const { entityType, entityId } = config;

  const tabContainer = document.createElement('div');
  const tabDiv = `
    <ul class="nav nav-tabs nav-fill">
      <li class="nav-item">
        <a class="nav-link active files" data-tab="files">
          <i class="fa-solid fa-paperclip"></i>Files
        </a>
      </li>
      <li class="nav-item">
        <a class="nav-link description" data-tab="description">
          <i class="fa-solid fa-italic"></i>Description
        </a>
      </li>
      <li class="nav-item">
        <a class="nav-link times" data-tab="times">
          <i class="fa-solid fa-stopwatch"></i>Time Registrations
        </a>
      </li>
    </ul>
    <div class="tab-content">
      <div class="tab-pane active" id="files-content"></div>
      <div class="tab-pane info-row" id="description-content"></div>
      <div class="tab-pane" id="times-content"></div>
    </div>
  `;

  tabContainer.innerHTML = tabDiv;

  if (entityType === 'users' || entityType === 'clients') {
    // Remove description tab and its content pane
    const descTabLi = tabContainer.querySelector('.nav-link.description')?.closest('li');
    const descPane = tabContainer.querySelector('#description-content');

    descTabLi?.remove();
    (descPane as HTMLElement | null)?.remove();
  }

  if (entityType === 'clients') {
    // Remove time registrations tab and its content pane
    const timeTabLi = tabContainer.querySelector('.nav-link.times')?.closest('li');
    const timePane = tabContainer.querySelector('#times-content');

    timeTabLi?.remove();
    (timePane as HTMLElement | null)?.remove();
  }


  async function handleTabClick(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.classList.contains('nav-link')) return;

    const tabs = tabContainer.querySelectorAll('.nav-link');
    const panes = tabContainer.querySelectorAll('.tab-pane');

    tabs.forEach((tab) => tab.classList.remove('active'));
    panes.forEach((pane) => pane.classList.remove('active'));

    target.classList.add('active');

    const tabName = target.getAttribute('data-tab');
    const contentPane = tabContainer.querySelector(`#${tabName}-content`);
    if (contentPane) {
      contentPane.classList.add('active');
    }

    if (tabName === 'files') {
      await loadFiles({ entityType, entityId, container: tabContainer });
    } else if (tabName === 'description') {
      // Load description content
      const descriptionContent = tabContainer.querySelector('#description-content');
      descriptionContent!.innerHTML = renderDescriptionTab(config.description || '');

    } else if (tabName === 'times') {
      await loadTimeEntries({ entityType, entityId, container: tabContainer });
    }
  }

  tabContainer.addEventListener('click', handleTabClick);

  // initial load of files tab
  loadFiles({ entityType, entityId, container: tabContainer });

  return tabContainer;
}

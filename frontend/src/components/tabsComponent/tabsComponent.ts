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
        <a class="nav-link active" data-tab="files">
          <i class="fa-solid fa-paperclip"></i>Files
        </a>
      </li>
      <li class="nav-item">
        <a class="nav-link" data-tab="description">
          <i class="fa-solid fa-italic"></i>Description
        </a>
      </li>
      <li class="nav-item">
        <a class="nav-link" data-tab="times">
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

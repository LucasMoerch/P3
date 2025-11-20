import { http } from '../../api/http';

type EntityType = 'clients' | 'cases' | 'users';

export interface TimeTabConfig {
  entityType: EntityType;
  entityId: string;
  container: HTMLElement; // the tabs container created in renderTabs
}

interface TimeEntry {
  _id: string;
  caseId?: string;
  userId?: string;
  userName: string;
  date: string;
  startTime: string;
  stopTime: string;
  totalTime: string;
  description: string;
}

export async function loadTimeEntries(config: TimeTabConfig) {
  const { entityType, entityId, container } = config;

  try {
    const entries = (await http.get(`/times/${entityType}/${entityId}`)) as TimeEntry[];

    const timeContent = container.querySelector('#times-content') as HTMLElement | null;
    if (!timeContent) return;

    timeContent.innerHTML = renderTimeList(entries);
  } catch (e) {
    console.error('Error loading time entries', e);
  }
}

function renderTimeList(entries: TimeEntry[]) {
  if (!entries || entries.length === 0) {
    return '<p class="text-muted">No time registrations yet.</p>';
  }

  return `
    <ul class="list-group">
      ${entries
        .map(
          (t) => `
        <li class="list-group-item d-flex justify-content-between">
          <div>
            <strong>${t.date}</strong> ${t.startTime} - ${t.stopTime} (${t.totalTime}) - <small>${t.caseId}</small><br/>
            <small>${t.userName}</small><br/>
            <span>${t.description ?? ''}</span>
          </div>
        </li>
      `,
        )
        .join('')}
    </ul>
  `;
}

import './cardComponent.scss';
import http from '../../api/http';
import { UserDTO } from '../../pages/staff';
import { loadUsersAndClients } from './dataLoader';
import { createCheckboxDropdown } from './checkboxDropdown';
import { normalizeIdArray, friendlyForValue } from './utils';

type RenderCardOptions = {
  edit?: boolean;
  endpoint?: string;
  data?: Record<string, any>;
};

export function renderCard(options: RenderCardOptions = {}): HTMLElement {
  const overlay = document.createElement('div');
  overlay.className = 'overlay pt-md-5';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');

  const card = document.createElement('div');
  card.className = 'card bg-card-bg';

  const closeBtn = document.createElement('button');
  closeBtn.className =
    'btn back-button border-0 bg-transparent text-primary position-absolute top-0 start-0 m-3 fs-2';
  closeBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';

  // preload users/clients for cases
  let preloaded: { users?: UserDTO[]; clients?: any[] } = {};

  // If from cases endpoint, load users and clients
  const hasCasesEndpoint = options.endpoint === 'cases';
  if (hasCasesEndpoint) {
    loadUsersAndClients()
      .then((r) => {
        preloaded = r;

        // populate assignedUsers display names in existing card content (if present)
        const assignedSpans = card.querySelectorAll<HTMLElement>(
          '.info-row .value.dropdown[data-field="assignedUsers"]',
        );

        const assignedIds = normalizeIdArray(options.data?.assignedUserIds ?? []);
        assignedSpans.forEach((span) => {
          if (assignedIds.length && preloaded.users?.length) {
            const names = assignedIds.map((id) => {
              const u = preloaded.users!.find((x) => x.id === id);
              return u ? u.profile?.displayName || u.auth.email : id;
            });
            span.textContent = names.join(', ');
          } else {
            span.textContent = 'None';
          }
        });

        // populate clientId name if present
        const clientSpans = card.querySelectorAll<HTMLElement>(
          '.info-row .value[data-field="clientId"]',
        );

        clientSpans.forEach((span) => {
          const clientId =
            normalizeIdArray(options.data?.clientId ?? span.textContent?.trim() ?? '')[0] ?? '';
          const client = preloaded.clients?.find((c: any) => c.id === clientId);
          span.textContent = client
            ? (client.name ?? client.displayName ?? clientId)
            : clientId || 'None';
        });
      })
      .catch((err) => {
        console.error('Failed to preload users/clients', err);
      });
  }

  if (options.edit) {
    const editBtn = document.createElement('button');
    editBtn.className =
      'btn edit-button border-0 bg-transparent text-primary position-absolute top-0 end-0 m-3 fs-2';
    editBtn.innerHTML = '<i class="fa-solid fa-pen-to-square"></i>';
    card.appendChild(editBtn);

    editBtn.addEventListener('click', async () => {
      // ensure preloaded data exists for special fields
      if (hasCasesEndpoint && (!preloaded.users || !preloaded.clients)) {
        try {
          preloaded = await loadUsersAndClients();
        } catch (e) {
          console.error('Failed to load users/clients for edit mode', e);
        }
      }

      const infoRows = card.querySelectorAll('.info-row');

      infoRows.forEach((row) => {
        const valueSpan = row.querySelector<HTMLElement>('.value');
        if (!valueSpan) return;

        const field = valueSpan.dataset.field;
        if (!field || valueSpan.dataset.editable === 'false') return;

        // Only dropdown fields become editable
        if (!valueSpan.classList.contains('dropdown')) return;

        // If already converted, skip
        if (valueSpan.querySelector('[data-edit-widget]')) return;

        // If assignedUsers, use custom checkbox dropdown
        if (field === 'assignedUsers') {
          const users = preloaded.users || [];
          const assignedFromAttr = valueSpan.dataset.assignedIds
            ? JSON.parse(valueSpan.dataset.assignedIds)
            : undefined;

          const assignedIds = normalizeIdArray(
            options.data?.assignedUserIds ?? assignedFromAttr ?? [],
          );

          const { container, getSelectedIds, setSelectedIds } = createCheckboxDropdown(
            users,
            assignedIds,
          );

          container.dataset.editWidget = 'assignedUsers';
          container.dataset.field = field;

          valueSpan.textContent = '';
          valueSpan.appendChild(container);

          (valueSpan as any).__getSelectedIds = getSelectedIds;
          (valueSpan as any).__setSelectedIds = setSelectedIds;

          return;
        }

        // If clientId field use single-select dropdown
        if (field === 'clientId') {
          const clients = preloaded.clients || [];
          const select = document.createElement('select');
          select.className = 'form-select text-end fw-semibold';
          select.dataset.field = field;

          const clientFromAttr = valueSpan.dataset.clientId ?? undefined;
          const currentClientId =
            normalizeIdArray(
              options.data?.clientId ?? clientFromAttr ?? valueSpan.textContent?.trim() ?? '',
            )[0] ?? '';

          clients.forEach((c: any) => {
            const option = document.createElement('option');
            option.value = c.id;
            option.textContent = c.name ?? c.displayName ?? c.id;
            if (c.id === currentClientId) option.selected = true;
            select.appendChild(option);
          });

          if (!clients.length && currentClientId) {
            const option = document.createElement('option');
            option.value = currentClientId;
            option.textContent = currentClientId;
            option.selected = true;
            select.appendChild(option);
          }

          if (valueSpan.dataset.transform) select.dataset.transform = valueSpan.dataset.transform;

          valueSpan.textContent = '';
          valueSpan.appendChild(select);
          return;
        }

        // Select dropdown that uses data-options
        const select = document.createElement('select');
        select.className = 'form-select text-end fw-semibold';
        select.dataset.field = field;

        const optionsAttr = valueSpan.dataset.options || '';
        const opts = optionsAttr
          .split(',')
          .map((o) => o.trim())
          .filter(Boolean);

        const currentText = valueSpan.textContent?.trim() || '';
        if (currentText && !opts.includes(currentText)) opts.unshift(currentText);

        opts.forEach((opt) => {
          const optionEl = document.createElement('option');
          optionEl.value = opt;
          optionEl.textContent = opt;
          if (opt === currentText) optionEl.selected = true;
          select.appendChild(optionEl);
        });

        if (valueSpan.dataset.transform) select.dataset.transform = valueSpan.dataset.transform;

        valueSpan.textContent = '';
        valueSpan.appendChild(select);
      });

      // Save button
      const saveBtn = document.createElement('button');
      saveBtn.className = 'btn btn-primary btn-lg';
      saveBtn.innerText = 'Save';

      const btnContainer = document.createElement('div');
      btnContainer.className = 'd-flex justify-content-center mt-3';
      btnContainer.appendChild(saveBtn);
      card.appendChild(btnContainer);

      // small helpers used only in save scope to ensure proper typing
      const setNestedValue = (target: Record<string, unknown>, path: string, value: unknown) => {
        const segments = path.split('.');
        let current: Record<string, unknown> = target;
        for (let i = 0; i < segments.length - 1; i += 1) {
          const seg = segments[i];
          if (
            current[seg] === undefined ||
            current[seg] === null ||
            typeof current[seg] !== 'object'
          ) {
            current[seg] = {};
          }
          current = current[seg] as Record<string, unknown>;
        }
        current[segments[segments.length - 1]] = value;
      };

      const buildIdToName = () => {
        const idToName = new Map<string, string>();

        (preloaded.users || []).forEach((u) => {
          const uid = String((u as any).id ?? (u as any)._id ?? '');
          const uname =
            u.profile?.displayName ?? (u as any).auth?.email ?? (u as any).auth?.email ?? uid;
          if (uid) idToName.set(uid, uname);
        });

        (preloaded.clients || []).forEach((c: any) => {
          const cid = String(c.id ?? c._id ?? '');
          const cname = c.name ?? c.displayName ?? c.company ?? c.email ?? cid;
          if (cid) idToName.set(cid, cname);
        });

        return idToName;
      };

      saveBtn.addEventListener('click', async () => {
        const updated: Record<string, unknown> = options.data ? { ...options.data } : {};

        const selects = Array.from(
          card.querySelectorAll<HTMLSelectElement>('.info-row .value select'),
        );
        const dropdownSpans = Array.from(
          card.querySelectorAll<HTMLElement>('.info-row .value.dropdown'),
        );

        const idToName = buildIdToName();

        const updates: Array<{ parent: HTMLElement; field: string; value: string | string[] }> = [];

        // Handle normal select fields
        selects.forEach((sel) => {
          const field = sel.dataset.field;
          if (!field) return;

          let value: string | string[] = sel.multiple
            ? Array.from(sel.selectedOptions).map((o) => o.value)
            : sel.value;

          switch (sel.dataset.transform) {
            case 'uppercase':
              if (Array.isArray(value)) value = value.map((v) => v.toUpperCase());
              else value = (value as string).toUpperCase();
              break;
            case 'commaList':
              if (typeof value === 'string') {
                value = value
                  .split(',')
                  .map((s) => s.trim())
                  .filter(Boolean);
              }
              break;
            default:
              break;
          }

          setNestedValue(updated, field, value);
          updates.push({ parent: sel.parentElement as HTMLElement, field, value });
        });

        // Handle dropdown spans
        dropdownSpans.forEach((span) => {
          const field = span.dataset.field;
          if (!field) return;

          const getter = (span as any).__getSelectedIds;

          if (field === 'assignedUsers' && typeof getter === 'function') {
            const value = normalizeIdArray(getter());
            setNestedValue(updated, 'assignedUserIds', value);
            updates.push({ parent: span, field: 'assignedUserIds', value });
            return;
          }

          if (typeof getter === 'function') {
            const value = getter() as string[];
            setNestedValue(updated, field, value);
            updates.push({ parent: span, field, value });
          }
        });

        // keep id unchanged
        if ('id' in (options.data ?? {})) {
          updated.id = (options.data as any).id;
        }

        try {
          saveBtn.disabled = true;
          const prev = saveBtn.innerText;
          saveBtn.innerText = 'Saving...';

          await http.put(`/${options.endpoint}/${options.data?.id}`, updated);

          // create friendly text using friendlyForValue function
          updates.forEach(({ parent, value }) => {
            parent.textContent = friendlyForValue(value, idToName) || 'None';
          });

          overlay.remove();
          saveBtn.innerText = prev;
        } catch (e) {
          console.error(e);
          alert('Failed to save changes.');
          saveBtn.disabled = false;
        }
      });

      editBtn.disabled = true;
    });
  }

  // Append card inside overlay
  const header = document.createElement('div');
  header.className = 'header mt-4 text-center fw-semibold fs-3 ';
  header.innerText = 'placeholder';

  const body = document.createElement('div');
  body.className = 'body';

  closeBtn.addEventListener('click', () => {
    overlay.remove();
  });
  card.appendChild(closeBtn);
  overlay.appendChild(card);
  card.appendChild(header);
  card.appendChild(body);

  overlay.addEventListener('click', (event) => {
    if (event.target === overlay) overlay.remove();
  });

  // Return overlay, but let caller add content to the card
  return overlay;
}

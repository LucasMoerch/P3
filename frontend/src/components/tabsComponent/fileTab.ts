import { http } from '../../api/http';
import { getMe } from '../../auth/auth';

export type EntityType = 'clients' | 'cases' | 'users'; // So the request URL can be constructed

export interface FileTabConfig {
  entityType: EntityType;
  entityId: string;
  container: HTMLElement; // the tabs container created in renderTabs
}

export async function loadFiles(config: FileTabConfig) {
  const { entityType, entityId, container } = config;

  try {
    const response = (await http.get(`/${entityType}/${entityId}/documents`)) as any[];

    const filesContent = container.querySelector('#files-content') as HTMLElement | null;
    if (!filesContent) return;

    filesContent.innerHTML = `
      <div class="card bg-card-bg border-0 shadow-sm mt-3">
        <div class="card-body d-flex flex-wrap align-items-center gap-2">
          <div class="d-flex align-items-center gap-2 flex-grow-1">
            <label for="upload-input" class="btn-primary btn-sm btn-outline-secondary mb-0">
              <i class="fa-solid fa-file-arrow-up me-1"></i> Choose file
            </label>
            <input type="file" id="upload-input" class="d-none" />
            <button class="btn btn-sm btn-success" id="upload-btn">
              <i class="fa-solid fa-upload me-1"></i> Upload
            </button>
          </div>
          <span id="upload-status" class="small text-muted ms-auto"></span>
        </div>
        <div class="card-body pt-0">
          ${renderFilesList(response)}
        </div>
      </div>
    `;

    attachFileEventListeners(config);
    attachUploadListener(config);
  } catch (error) {
    console.error('Error loading files:', error);
    const filesContent = config.container.querySelector('#files-content');
    if (filesContent) {
      filesContent.innerHTML = '<p class="text-danger">Failed to load files.</p>';
    }
  }
}

function renderFilesList(documents: any[]) {
  if (!documents || documents.length === 0) {
    return '<p class="text-muted">No files uploaded yet.</p>';
  }

  return `
    <ul class="list-group">
      ${documents
        .map(
          (doc, index) => `
        <li class="list-group-item d-flex justify-content-between align-items-center">
          <div>
            <i class="fa-solid fa-file"></i>
            <span class="ms-2">${doc.filename || doc.fileName}</span>
            <small class="text-muted ms-2">(${formatDate(
              doc.uploadedAt,
            )}) by ${doc.createdBy}</small>
            <button class="btn btn-sm me-2" data-action="download" data-index="${index}">
              <i class="fa-solid fa-download"></i>
            </button>
          </div>
          <div>
            <button class="btn btn-sm" data-action="delete" data-index="${index}">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </li>
      `,
        )
        .join('')}
    </ul>
  `;
}

function attachFileEventListeners(config: FileTabConfig) {
  const { container } = config;
  const filesContent = container.querySelector('#files-content');
  if (!filesContent) return;

  filesContent.querySelectorAll('[data-action]').forEach((button) => {
    button.addEventListener('click', async (e) => {
      const target = e.currentTarget as HTMLElement;
      const action = target.getAttribute('data-action');
      const index = parseInt(target.getAttribute('data-index') || '0', 10);

      if (action === 'download') {
        await downloadFile(index, config);
      } else if (action === 'delete') {
        await deleteFile(index, config);
      }
    });
  });
}

function attachUploadListener(config: FileTabConfig) {
  const { entityType, entityId, container } = config;

  const filesContent = container.querySelector('#files-content');
  if (!filesContent) return;

  const fileInput = filesContent.querySelector<HTMLInputElement>('#upload-input');
  const uploadBtn = filesContent.querySelector<HTMLButtonElement>('#upload-btn');
  const uploadStatus = filesContent.querySelector<HTMLSpanElement>('#upload-status');

  if (uploadBtn && fileInput && uploadStatus) {
    uploadBtn.addEventListener('click', async () => {
      if (!fileInput.files || fileInput.files.length === 0) {
        uploadStatus.textContent = 'Please select a file first.';
        uploadStatus.classList.remove('text-success', 'text-danger');
        uploadStatus.classList.add('text-warning');
        return;
      }

      const file = fileInput.files[0];
      uploadBtn.disabled = true;
      uploadStatus.textContent = 'Uploading...';
      uploadStatus.classList.remove('text-success', 'text-danger', 'text-warning');
      uploadStatus.classList.add('text-muted');

      const formData = new FormData();
      formData.append('file', file);
      formData.append('createdBy', getMe()?.displayName || 'unknown');

      try {
        await http.post(`/${entityType}/${entityId}/uploadDocument`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        uploadStatus.textContent = 'Upload successful!';
        uploadStatus.classList.remove('text-muted', 'text-danger', 'text-warning');
        uploadStatus.classList.add('text-success');
        fileInput.value = '';
        await loadFiles(config);
      } catch (err) {
        uploadStatus.textContent = 'Upload failed.';
        uploadStatus.classList.remove('text-muted', 'text-success', 'text-warning');
        uploadStatus.classList.add('text-danger');
        console.error('Upload failed:', err);
      } finally {
        uploadBtn.disabled = false;
      }
    });
  }
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString();
}

async function downloadFile(index: number, config: FileTabConfig) {
  const { entityType, entityId } = config;

  try {
    const response = (await http.get(`/${entityType}/${entityId}/documents/${index}/download`, {
      responseType: 'blob',
    })) as any;

    const blob = new Blob([response]);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.setAttribute('download', `document_${index}`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading file:', error);
    alert('Failed to download file');
  }
}

async function deleteFile(index: number, config: FileTabConfig) {
  const { entityType, entityId } = config;

  if (confirm('Are you sure you want to delete this file?')) {
    try {
      await http.delete(`/${entityType}/${entityId}/documents/${index}`);
      await loadFiles(config);
    } catch (error) {
      console.error('Error deleting file:', error);
      alert('Failed to delete file');
    }
  }
}

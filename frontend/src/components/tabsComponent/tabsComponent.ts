import './tabsStyling.scss';
import http from '../../api/http';
import { getMe } from '../../auth/auth';

interface TabsConfig {
  entityType: 'clients' | 'cases' | 'users'; // users = admin & staff
  entityId: string;
}

export function renderTabs(config: TabsConfig) {
  const { entityType, entityId } = config;

  const tabContainer = document.createElement('div');
  const tabDiv = `<ul class="nav nav-tabs nav-fill">
    <li class="nav-item">
      <a class="nav-link active" data-tab="files"><i class="fa-solid fa-paperclip"></i>Files</a>
    </li>
    <li class="nav-item">
      <a class="nav-link" data-tab="description"><i class="fa-solid fa-italic"></i>Description</a>
    </li>
    <li class="nav-item">
      <a class="nav-link" data-tab="notes"><i class="fa-solid fa-note-sticky"></i>Notes</a>
    </li>
    </ul>
    <div class="tab-content">
      <div class="tab-pane active" id="files-content"></div>
      <div class="tab-pane" id="description-content"></div>
      <div class="tab-pane" id="notes-content"></div>
    </div>`;

  async function loadFiles() {
    try {
      const response = (await http.get(`/${entityType}/${entityId}/documents`)) as any[];
      const filesContent = tabContainer.querySelector('#files-content');

      if (filesContent) {
        filesContent.innerHTML = `
          <div class="mb-3">
            <input type="file" id="upload-input" style="display:inline-block" />
            <button class="btn btn-sm btn-success ms-2" id="upload-btn">
              <i class="fa-solid fa-upload"></i> Upload
            </button>
            <span id="upload-status" class="ms-2"></span>
          </div>
          ${renderFilesList(response)}
        `;
        attachFileEventListeners();
        attachUploadListener();
      }
    } catch (error) {
      console.error('Error loading files:', error);
      const filesContent = tabContainer.querySelector('#files-content');
      if (filesContent) {
        filesContent.innerHTML = '<p class="text-danger">Failed to load files.</p>';
      }
    }
  }

  function renderFilesList(documents: any[]) {
    if (!documents || documents.length === 0) {
      return '<p class="text-muted">No files uploaded yet.</p>';
    }
    console.log(documents);
    return `
      <ul class="list-group">
        ${documents.map((doc, index) => `
          <li class="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <i class="fa-solid fa-file"></i>
              <span class="ms-2">${doc.filename || doc.fileName}</span>
              <small class="text-muted ms-2">(${formatDate(doc.uploadedAt)}) by ${doc.createdBy}</small>
            </div>
            <div>
              <button class="btn btn-sm btn-primary me-2" data-action="download" data-index="${index}">
                <i class="fa-solid fa-download"></i> Download
              </button>
              <button class="btn btn-sm btn-danger" data-action="delete" data-index="${index}">
                <i class="fa-solid fa-trash"></i> Delete
              </button>
            </div>
          </li>
        `).join('')}
      </ul>
    `;
  }

  function attachFileEventListeners() {
    const filesContent = tabContainer.querySelector('#files-content');
    if (!filesContent) return;
    filesContent.querySelectorAll('[data-action]').forEach(button => {
      button.addEventListener('click', async (e) => {
        const target = e.currentTarget as HTMLElement;
        const action = target.getAttribute('data-action');
        const index = parseInt(target.getAttribute('data-index') || '0', 10);
        if (action === 'download') {
          await downloadFile(index);
        } else if (action === 'delete') {
          await deleteFile(index);
        }
      });
    });
  }

  // Handle file uploads
  function attachUploadListener() {
    const filesContent = tabContainer.querySelector('#files-content');
    if (!filesContent) return;
    const fileInput = filesContent.querySelector<HTMLInputElement>('#upload-input');
    const uploadBtn = filesContent.querySelector<HTMLButtonElement>('#upload-btn');
    const uploadStatus = filesContent.querySelector<HTMLSpanElement>('#upload-status');

    if (uploadBtn && fileInput) {
      uploadBtn.addEventListener('click', async () => {
        if (!fileInput.files || fileInput.files.length === 0) {
          uploadStatus!.textContent = "Please select a file first.";
          return;
        }
        const file = fileInput.files[0];
        uploadBtn.disabled = true;
        uploadStatus!.textContent = "Uploading...";

        const formData = new FormData();
        formData.append('file', file);
        formData.append('createdBy', getMe()?.displayName || 'unknown');


        try {
          await http.post(`/${entityType}/${entityId}/uploadDocument`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
          uploadStatus!.textContent = "Upload successful!";
          fileInput.value = '';
          await loadFiles();
        } catch (err) {
          uploadStatus!.textContent = "Upload failed.";
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

  async function downloadFile(index: number) {
    try {
      const response = await http.get(
        `/${entityType}/${entityId}/documents/${index}/download`,
        { responseType: 'blob' }
      ) as any;
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

  async function deleteFile(index: number) {
    if (confirm('Are you sure you want to delete this file?')) {
      try {
        await http.delete(`/${entityType}/${entityId}/documents/${index}`);
        await loadFiles();
      } catch (error) {
        console.error('Error deleting file:', error);
        alert('Failed to delete file');
      }
    }
  }

  async function handleTabClick(event: Event) {
    const target = event.target as HTMLElement;
    if (target.classList.contains('nav-link')) {
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
        await loadFiles();
      } else if (tabName === 'description') {
        // TODO: Load description content
      } else if (tabName === 'notes') {
        // TODO: Load notes content
      }
    }
  }

  tabContainer.addEventListener('click', handleTabClick);
  tabContainer.innerHTML = tabDiv;
  loadFiles();
  return tabContainer;
}

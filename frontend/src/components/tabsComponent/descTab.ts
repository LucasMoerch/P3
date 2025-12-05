export function renderDescriptionTab(description: string): string {
  return `
    <div class="p-3">
      <h5>Description</h5>
      <p class='value' data-field='description'>${description || '<span class="text-muted">No description available.</span>'}</p>
    </div>
  `;
}

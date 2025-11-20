import './cancelCard.scss';

export function showCancelConfirmation(overlay: HTMLElement) {
    const wrapper = document.createElement("div");

    wrapper.innerHTML = `
    <div class="cancel-confirm-overlay">
      <div class="card cancel-confirm-card">
        <p>Are you sure you want to cancel, non-saved changes will be lost</p>
        <div class="cancel-confirm-buttons">
          <button id="confirmYes" class="btn btn-danger px-3">Yes</button>
          <button id="confirmNo" class="btn btn-secondary px-3">No</button>
        </div>
      </div>
    </div>
    `;

    document.body.appendChild(wrapper);

    const yesBtn = wrapper.querySelector("#confirmYes") as HTMLButtonElement;
    const noBtn = wrapper.querySelector("#confirmNo") as HTMLButtonElement;

    const cleanup = () => wrapper.remove();

    yesBtn.onclick = () => {
        cleanup();
        overlay.remove();
    };

    noBtn.onclick = cleanup;

}
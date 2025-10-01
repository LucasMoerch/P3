import "./cardComponent.scss"


export function renderCard(): HTMLElement {
    const overlay = document.createElement("div");
    overlay.className = "overlay";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");

    const card = document.createElement("div");
    card.className = "card bg-card-bg";

    // Append card inside overlay

    const header = document.createElement("div");
    header.className = "header";
    header.innerText = "Time Registration";

    const body = document.createElement("div");
    body.className = "body";
    body.innerHTML = `<p>Track your time spent on tasks.</p>`;





    overlay.appendChild(card);
    card.appendChild(header);
    card.appendChild(body);
   

    // Return overlay, but let caller add content to the card
    return overlay;
}
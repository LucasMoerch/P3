import http from "../../api/http"
import "./timetracker.scss";

export function renderTimeTracker(): HTMLElement {
    const div = document.createElement("div");
    div.className = "col text-end pl-3 mt-3";
    const openCardButton = document.createElement("button");
    openCardButton.className = "btn btn-primary";
    openCardButton.innerHTML = "Time Tracking";
    

    let cardEl: HTMLElement | null = null; // gemmer Kort referencen

    openCardButton.addEventListener("click", () => {
        if (!cardEl) {
            cardEl = renderTimeTrackingCard();
            document.body.appendChild(cardEl);
        } else {
            if (cardEl && document.body.contains(cardEl)) { document.body.removeChild(cardEl); }
            cardEl = null; // reset reference
        }
        console.log("Time Tracking clicked...");
    });

    div.appendChild(openCardButton);
    function closeElement(elementName: HTMLElement){
        elementName.remove();
    }

function renderTimeTrackingCard() {
    // Create overlay
    const overlay = document.createElement("div");
    overlay.className = "time-tracker-overlay overlay";
   
 
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");

    const card = document.createElement("div"); 
    card.className = "card time-tracker-card";

    const closeBtn = document.createElement("button");
    closeBtn.className = "btn btn-secondary col-1";
    closeBtn.innerText = "X";

    const startTimeBtn = document.createElement("button");
    startTimeBtn.className = "btn btn-success col-1";
    startTimeBtn.innerText = "Start Time";

    const stopTimeBtn = document.createElement("button");
    stopTimeBtn.className = "btn btn-danger col-1";
    stopTimeBtn.innerText = "Stop Time";

    const pauseBtn = document.createElement("button");
    pauseBtn.className = "btn btn-warning col-1";
    pauseBtn.innerText = "Pause Time";

    const header = document.createElement("div");
    header.className = "card-header";
    header.innerText = "Time Registration";

    const body = document.createElement("div");
    body.className = "card-body";
    body.innerHTML = `<p>Track your time spent on tasks.</p>`;
    

    card.appendChild(closeBtn);
    card.appendChild(header);
    card.appendChild(body);
    body.appendChild(startTimeBtn);

    overlay.appendChild(card);

    // Events
    closeBtn.addEventListener("click", () => {
        overlay.remove();
        cardEl = null;
    });

    startTimeBtn.addEventListener("click", () => {
        startTimeBtn.remove();
        body.appendChild(pauseBtn);
        body.appendChild(stopTimeBtn);
        console.log("Start Time clicked...");
    });

   

    return overlay;
}
    
    return div;
}
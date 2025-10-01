import http from "../../api/http"
import "./timetracker.scss";
import { renderCard } from "../cardComponent/cardComponent";
import { renderCalendar } from "../calendarComponent/calendar"

export function renderTimeTracker(): HTMLElement {
    const div = document.createElement("div");
    div.className = "col text-end pl-3 mt-3";
    const openCardButton = document.createElement("button");
    openCardButton.className = "btn btn-primary";
    openCardButton.innerHTML = "Time Tracking";


    openCardButton.addEventListener("click", () => {
        const cardEl = renderTimeTrackingCard();
        document.body.appendChild(cardEl);
      
        console.log("Time Tracking clicked...");
    });

    div.appendChild(openCardButton);
    function closeElement(elementName: HTMLElement){
        elementName.remove();
    }

function renderTimeTrackingCard() {
    // Create overlay
    const overlay = renderCard();
    const card = overlay.querySelector(".card") as HTMLElement;
    const header= card.querySelector(".header") as HTMLElement;
    const body= card.querySelector(".body") as HTMLElement;
    // Add your custom content

    const closeBtn = document.createElement("button");
    closeBtn.className = "btn btn-secondary col-3";
    closeBtn.innerText = "X";

    const startTimeBtn = document.createElement("button");
    startTimeBtn.className = "btn btn-primary fw-bold col-3";
    startTimeBtn.innerText = "Check in";

    const stopTimeBtn = document.createElement("button");
    stopTimeBtn.className = "btn btn-danger fw-semibold col-3";
    stopTimeBtn.innerText = "Stop Time";

    const pauseBtn = document.createElement("button");
    pauseBtn.className = "btn btn-warning fw-semibold col-3";
    pauseBtn.innerText = "Pause Time";

    // Render the calendar field
    body.appendChild(renderCalendar())

    card.appendChild(closeBtn);

    body.appendChild(startTimeBtn);

    overlay.appendChild(card);
    card.appendChild(header);
    card.appendChild(body); 

    // Events
    closeBtn.addEventListener("click", () => {
        overlay.remove();
    
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
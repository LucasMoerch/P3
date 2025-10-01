import http from "../../api/http"
import "./timetracker.scss";
import { renderCard } from "../cardComponent/cardComponent";

export function renderTimeTracker(): HTMLElement {
    const div = document.createElement("div");

    div.style.position = "fixed";
    div.style.top = "50%"; //Makes the button stay in the middle
    div.style.right = "0"; //0px from the right edge
    div.style.transform = "translateY(-50%)";

    const openCardButton = document.createElement("button");
    openCardButton.className = "btn";
    openCardButton.style.backgroundColor = "#007bff";
    openCardButton.style.color = "white";
    openCardButton.innerHTML = "⏱️";

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
    closeBtn.className = "btn btn-secondary col-1";
    closeBtn.innerText = "X";

    const startTimeBtn = document.createElement("button");
    startTimeBtn.className = "btn btn-primary col-1";
    startTimeBtn.innerText = "Start Time";

    const stopTimeBtn = document.createElement("button");
    stopTimeBtn.className = "btn btn-danger col-1";
    stopTimeBtn.innerText = "Stop Time";

    const pauseBtn = document.createElement("button");
    pauseBtn.className = "btn btn-warning col-1";
    pauseBtn.innerText = "Pause Time";

 

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


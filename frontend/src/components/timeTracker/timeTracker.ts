import http from "../../api/http";
import "./timetracker.scss";
import { renderCard } from "../cardComponent/cardComponent";

// Utility function to get current time as HH:MM:SS
function getTimeNow(): string {
    const startTime: Date = new Date(); // stores the current time the moment the start button is clicked
    const timeNow: string =
        startTime.getHours().toString().padStart(2,'0') + ':' +
        startTime.getMinutes().toString().padStart(2,'0') + ':' +
        startTime.getSeconds().toString().padStart(2,'0');

    return timeNow;
}

function closeElement(element: HTMLElement): void {
    element.remove();
}


export function renderTimeTracker(): HTMLElement {
    const div: HTMLDivElement = document.createElement("div");
    div.className = "col text-end pl-3 mt-3";

    const openCardButton: HTMLButtonElement = document.createElement("button");
    openCardButton.className = "btn btn-primary";
    openCardButton.innerHTML = "Time Tracking";

    openCardButton.addEventListener("click", (): void => {
        const cardEl = renderTimeTrackingCard();
        document.body.appendChild(cardEl);
        console.log("Time Tracking clicked...");
    });

    

      //Build openCardButton
        div.appendChild(openCardButton);

    function renderTimeTrackingCard(): HTMLElement {
        const overlay: HTMLElement = renderCard();
        const card: HTMLElement = overlay.querySelector(".card") as HTMLElement;
        const header: HTMLElement = card.querySelector(".header") as HTMLElement;
        const body: HTMLElement = card.querySelector(".body") as HTMLElement;

        // Buttons
        const closeBtn: HTMLButtonElement = document.createElement("button");
        closeBtn.className = "btn btn-secondary col-1";
        closeBtn.innerText = "X";

        const completeBtn: HTMLButtonElement = document.createElement("button");
        completeBtn.className = "btn btn-primary col-1";
        completeBtn.innerText = "Complete";

        const startTimeBtn: HTMLButtonElement = document.createElement("button");
        startTimeBtn.className = "btn btn-success col-1";
        startTimeBtn.innerText = "Start Time";

        const stopTimeBtn: HTMLButtonElement = document.createElement("button");
        stopTimeBtn.className = "btn btn-danger col-1";
        stopTimeBtn.innerText = "Stop Time";

        const timeDisplay: HTMLDivElement = document.createElement("div")
        timeDisplay.innerHTML = "00:00:00"
        
        
        
      
        // Build card
        overlay.appendChild(card);
        card.appendChild(closeBtn);
        card.appendChild(header);
        card.appendChild(body);
        body.appendChild(timeDisplay);
        body.appendChild(startTimeBtn);

        // Event listeners
        closeBtn.addEventListener("click", (): void => {
            overlay.remove();
        });

        startTimeBtn.addEventListener("click", (): void => {
            const startTimeNow: string = getTimeNow();
            timeDisplay.innerHTML = startTimeNow ;
            startTimeBtn.remove();
            body.appendChild(stopTimeBtn);
            console.log("Start Time clicked...", startTimeNow);
        });

        stopTimeBtn.addEventListener("click", (): void => {
            const stopTimeNow: string = getTimeNow();
            timeDisplay.innerHTML =  stopTimeNow;
            body.appendChild(completeBtn);
            console.log("Stop Time clicked...", stopTimeNow);
        });

        return overlay;
    }

    return div;
}
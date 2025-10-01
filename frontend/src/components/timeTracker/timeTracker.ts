import http from "../../api/http";
import "./timetracker.scss";
import { renderCard } from "../cardComponent/cardComponent";

// Utility function to get current time as HH:MM:SS
function getTimeNow(): string {
    const now = new Date();
    return [
        now.getHours().toString().padStart(2, '0'),
        now.getMinutes().toString().padStart(2, '0'),
        now.getSeconds().toString().padStart(2, '0')
    ].join(':');
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

    div.appendChild(openCardButton);

    function closeElement(element: HTMLElement): void {
        element.remove();
    }

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

        const timeDisplay: HTMLDivElement = document.createElement("div");
        body.appendChild(timeDisplay);

        // Build card
        card.appendChild(closeBtn);
        body.appendChild(startTimeBtn);
        overlay.appendChild(card);
        card.appendChild(header);
        card.appendChild(body);

        // Event listeners
        closeBtn.addEventListener("click", (): void => {
            overlay.remove();
        });

        startTimeBtn.addEventListener("click", (): void => {
            const startTimeNow: string = getTimeNow();
            timeDisplay.innerHTML = "Start Time: " + startTimeNow + "<br>";
            startTimeBtn.remove();
            body.appendChild(stopTimeBtn);
            console.log("Start Time clicked...", startTimeNow);
        });

        stopTimeBtn.addEventListener("click", (): void => {
            const stopTimeNow: string = getTimeNow();
            timeDisplay.innerHTML += "Stop Time: " + stopTimeNow + "<br>";
            body.appendChild(completeBtn);
            console.log("Stop Time clicked...", stopTimeNow);
        });

        return overlay;
    }

    return div;
}
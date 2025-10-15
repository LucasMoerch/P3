import http from '../../api/http';
import './timetracker.scss';
import '../../styles/custom.scss';
import { renderCard } from '../cardComponent/cardComponent';
import { renderCalendar } from '../calendarComponent/calendar';

// Utility function to get current time as HH:MM:SS
function getTimeNow(): string {
  const startTime: Date = new Date(); // stores the current time the moment the start button is clicked
  const timeNow: string =
    startTime.getHours().toString().padStart(2, '0') +
    ':' +
    startTime.getMinutes().toString().padStart(2, '0') +
    ':' +
    startTime.getSeconds().toString().padStart(2, '0');

  return timeNow;
}

function displayTime(elementId: string, time: string): void {
  const element = document.getElementById(elementId);
  if (element) {
    element.innerHTML = time;
  }
}

export function renderTimeTracker(): HTMLElement {
  const div = document.createElement('div');
  div.className = 'time-tracker-container p-4 rounded';

  const openCardButton = document.createElement('button');
  openCardButton.className = 'time-tracker-button shadow';
  openCardButton.innerHTML = '<i class="fa-solid fa-stopwatch"></i>';

  openCardButton.addEventListener('click', (): void => {
    const cardEl = renderTimeTrackingCard();
    document.body.appendChild(cardEl);
    console.log('Time Tracking clicked...');
  });

  div.appendChild(openCardButton);

  function renderTimeTrackingCard(): HTMLElement {
    // Create overlay
    const overlay: HTMLElement = renderCard();
    const card: HTMLElement = overlay.querySelector('.card') as HTMLElement;
    const header: HTMLElement = card.querySelector('.header') as HTMLElement;
    const body: HTMLElement = card.querySelector('.body') as HTMLElement;
    // Add your custom content

    const dropDownRow: HTMLDivElement = document.createElement('div');
    dropDownRow.innerHTML = `
    <div class="container p-4 rounded">
      <select class="form-select" id="caseSelect">
        <option selected>Choose a case...</option>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
      </select>
    </div>`;

    const description: HTMLDivElement = document.createElement('div');
    description.className = 'container col-12 p-4';
    description.innerHTML = `
    
    <textarea class="form-control border-0 shadow-sm rounded-3" id="description" 
    rows="6" placeholder="Add a short description..."
    ></textarea>
    `;

    const buttonRow: HTMLDivElement = document.createElement('div');
    buttonRow.className = 'container d-flex justify-content-between px-4 pb-5';

    const startTimeBtn = document.createElement('button');
    startTimeBtn.className = 'btn btn-success col-4 rounded-pill ms-4';
    startTimeBtn.innerText = 'Start Time';

    const stopTimeBtn = document.createElement('button');
    stopTimeBtn.className = 'btn btn-danger col-4 rounded-pill ms-4';
    stopTimeBtn.innerText = 'Stop Time';

    const completeBtn: HTMLButtonElement = document.createElement('button');
    completeBtn.className = 'btn btn-primary col-4 rounded-pill me-4';
    completeBtn.innerText = 'Complete';

    const clockField: HTMLDivElement = document.createElement('div');
    clockField.className = 'container rounded';
    clockField.innerHTML = `
    <div class="d-flex justify-content-center">
     <span id="clockText" class="clock-field text-center light-bg p-4 m-5 rounded w-auto">
        00:00:00
     </span>
    </div>
    `;
    const startStopTimeRow: HTMLDivElement = document.createElement('div');
    startStopTimeRow.className = 'container p-4 rounded d-flex justify-content-between ';
    startStopTimeRow.innerHTML = `
    <div class="container col-6 col-md-4 mx-1 rounded text-center light-bg py-2">
      <label for="startTime" class="form-label">Start Time</label> <br>
      <div class="container col rounded text-center bg-transparent py-1">
      <input 
        type="time" 
        step="1" 
        class="form-control mx-auto lighter-bg text-center" 
        id="startTime" 
        value="00:00:00">
      </div>
    </div>
    <div class="container col-6 col-md-4 mx-1 rounded text-center light-bg py-2">
      <label for="stopTime" class="form-label">Stop Time</label> <br>
      <div class="container col rounded text-center bg-transparent py-1">
      <input 
        type="time" 
        step="1" 
        class="form-control mx-auto lighter-bg text-center" 
        id="stopTime" 
        value="00:00:00">
      </div>
    </div>`;

    // Build card
    body.appendChild(dropDownRow);
    overlay.appendChild(card);
    card.appendChild(header);
    card.appendChild(body);
    body.appendChild(renderCalendar());
    body.appendChild(clockField);
    body.appendChild(startStopTimeRow);
    body.appendChild(description);
    body.appendChild(buttonRow);
    buttonRow.appendChild(startTimeBtn);

    // Events

    // Event listeners
    startTimeBtn.addEventListener('click', (): void => {
      const startTimeNow: string = getTimeNow();
      startTimeBtn.remove();
      buttonRow.appendChild(stopTimeBtn);
      displayTime('clockText', startTimeNow);
      displayTime('startTime', startTimeNow);
    });

    stopTimeBtn.addEventListener('click', (): void => {
      const stopTimeNow: string = getTimeNow();
      buttonRow.appendChild(completeBtn);
      displayTime('clockText', stopTimeNow);
      displayTime('stopTime', stopTimeNow);
    });

    return overlay;
  }

  return div;
}

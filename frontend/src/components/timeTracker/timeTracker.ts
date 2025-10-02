import http from '../../api/http';
import './timetracker.scss';
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

function closeElement(element: HTMLElement): void {
  element.remove();
}

export function renderTimeTracker(): HTMLElement {
  const div = document.createElement('div');
  div.className = 'time-tracker-container';

  const openCardButton = document.createElement('button');
  openCardButton.className = 'time-tracker-button';
  openCardButton.innerHTML = '⏱️';

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

    const closeBtn = document.createElement('button');
    closeBtn.className = 'btn btn-secondary col-3';
    closeBtn.innerText = 'X';

    const startTimeBtn = document.createElement('button');
    startTimeBtn.className = 'btn btn-success col-3';
    startTimeBtn.innerText = 'Start Time';

    const stopTimeBtn = document.createElement('button');
    stopTimeBtn.className = 'btn btn-danger col-3';
    stopTimeBtn.innerText = 'Stop Time';

    const pauseBtn = document.createElement('button');
    pauseBtn.className = 'btn btn-warning col-3';
    pauseBtn.innerText = 'Pause Time';

    // Render the calendar field
    body.appendChild(renderCalendar());

    const completeBtn: HTMLButtonElement = document.createElement('button');
    completeBtn.className = 'btn btn-primary col-1';
    completeBtn.innerText = 'Complete';

    const timeDisplay: HTMLDivElement = document.createElement('div');
    timeDisplay.innerHTML = '00:00:00';

    // Build card
    overlay.appendChild(card);
    card.appendChild(closeBtn);
    card.appendChild(header);
    card.appendChild(body);
    body.appendChild(timeDisplay);
    body.appendChild(startTimeBtn);

    // Events
    closeBtn.addEventListener('click', () => {
      overlay.remove();

      //Build openCardButton
      div.appendChild(openCardButton);
    });

    // Buttons
    // Event listeners
    startTimeBtn.addEventListener('click', (): void => {
      const startTimeNow: string = getTimeNow();
      timeDisplay.innerHTML = startTimeNow;
      startTimeBtn.remove();
      body.appendChild(pauseBtn);
      body.appendChild(stopTimeBtn);
      console.log('Start Time clicked...', startTimeNow);
    });

    stopTimeBtn.addEventListener('click', (): void => {
      const stopTimeNow: string = getTimeNow();
      timeDisplay.innerHTML = stopTimeNow;
      body.appendChild(completeBtn);
      console.log('Stop Time clicked...', stopTimeNow);
    });

    return overlay;
  }

  return div;
}

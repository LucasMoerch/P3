import http from '../../api/http';
import './timetracker.scss';
import '../../styles/custom.scss';
import { renderCard } from '../cardComponent/cardComponent';
import { renderCalendar } from '../calendarComponent/calendar';
import { CaseDto } from '../../pages/cases';
import { userId as getUserId, getDisplayName } from '../../auth/auth';


//api functions

async function loadCases() {
  try {
    const cases = (await http.get('/cases')) as CaseDto[];

    const caseData = (cases ?? []).map((c) => ({
      title: c.title || 'Untitled',
      id: c.id || 'Untitled',
    }));

    console.log('Loaded cases:', caseData);
    const casesSelect = document.getElementById('caseSelect') as HTMLSelectElement;
    if (!casesSelect) {
      console.error('Case select element not found');
      return;
    }
    caseData.forEach((caseItem) => {
      const option = document.createElement('option');
      option.value = caseItem.title;
      option.textContent = caseItem.title;
      option.id = caseItem.id;
      casesSelect.appendChild(option);
    });
  } catch (err) {
    console.error('Failed to load cases:', err);
  }
}

async function sendStartTimeData(startTime: string, userId: string, currentUserName: string): Promise<void> {
  try {
    const response = await http.post('/times/start', new URLSearchParams({ startTime, userId, currentUserName }));
    console.log('Response:', response);
  } catch (error: any) {
    console.error('Error:', error.response?.data || error.message);
  }
}

async function updateTimeData(
  startTime: string,
  stopTime: string,
  totalTime: string,
  description: string,
  date: string,
  caseId: string,
  originalStartTime: string,
): Promise<void> {
  try {
    const response = await http.patch(
      '/times/update',
      new URLSearchParams({
        startTime,
        stopTime,
        totalTime,
        description,
        date,
        caseId,
        originalStartTime,
      }),
    );
    console.log('Response:', response);
  } catch (error: any) {
    console.error('Error:', error.response?.data || error.message);
  }
}

// Regular functions
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
  //if the element is found, check if it's an input or a span and set the value or innerHTML accordingly
  if (element) {
    if (element instanceof HTMLInputElement) {
      element.value = time;
    } else {
      element.innerHTML = time;
    }
  }
}

function calculateTotalTime(startTime: string, stopTime: string): string {
  //splits the stop and start time strings into hours, minutes and seconds
  const [startHours, startMinutes, startSeconds] = startTime.split(':').map(Number);
  const [stopHours, stopMinutes, stopSeconds] = stopTime.split(':').map(Number);

  let totalSeconds =
    stopHours * 3600 +
    stopMinutes * 60 +
    stopSeconds -
    (startHours * 3600 + startMinutes * 60 + startSeconds);

  if (totalSeconds < 0) {
    totalSeconds += 24 * 3600; // Adjust for times that cross midnight
  }

  const hours = Math.floor(totalSeconds / 3600)
    .toString()
    .padStart(2, '0');
  const minutes = Math.floor((totalSeconds % 3600) / 60)
    .toString()
    .padStart(2, '0');
  const seconds = (totalSeconds % 60).toString().padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}

function getDateNow(date: string): string {
  if (date) {
    // if date is not empty, return the selected date
    const [year, month, day] = date.split('-').map(Number);
    return `${day}-${month}-${year}`;
  }
  // if no date was chosen from the calender. then return the current date
  const dateObj: Date = new Date();
  const month: string = (dateObj.getMonth() + 1).toString().padStart(2, '0');
  const day: string = dateObj.getDate().toString().padStart(2, '0');
  const year: string = dateObj.getFullYear().toString();
  return `${day}-${month}-${year}`;
}
function getCaseIdFromSelect(): string {
  const casesSelect = document.getElementById('caseSelect') as HTMLSelectElement;
  const selectedOption = casesSelect.options[casesSelect.selectedIndex];
  const selectedCaseId = selectedOption.id;
  return selectedCaseId;
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
  });

  div.appendChild(openCardButton);

  function renderTimeTrackingCard(): HTMLElement {
    // Create overlay
    const overlay: HTMLElement = renderCard();
    const card: HTMLElement = overlay.querySelector('.card') as HTMLElement;
    const header: HTMLElement = card.querySelector('.header') as HTMLElement;
    const body: HTMLElement = card.querySelector('.body') as HTMLElement;

    card.classList.add('d-flex', 'flex-column', 'h-100');
    header.classList.add('flex-shrink-0');
    body.classList.add('d-flex', 'flex-column', 'flex-grow-1', 'overflow-auto', 'pb-4');

    const dropDownRow: HTMLDivElement = document.createElement('div');
    dropDownRow.innerHTML = `
    <div class="container p-4 rounded">
      <select class="form-select shadow-sm" id="caseSelect">
        <option selected>Choose a case...</option>

      </select>
    </div>`;

    const description: HTMLDivElement = document.createElement('div');
    description.className = 'container col-12 p-4';
    description.innerHTML = `
    
    <textarea class="form-control shadow border-0 shadow-sm rounded-3" id="description" 
    rows="6" placeholder="Add a short description..."
    ></textarea>
    `;

    const buttonRow: HTMLDivElement = document.createElement('div');
    buttonRow.className =
      'container d-flex justify-content-between align-items-center gap-3 px-4 pb-4 pt-3 position-sticky bottom-0';

    const startTimeBtn = document.createElement('button');
    startTimeBtn.className = 'btn btn-success shadow col-4 rounded-pill ms-4';
    startTimeBtn.innerText = 'Start Time';

    const stopTimeBtn = document.createElement('button');
    stopTimeBtn.className = 'btn btn-danger shadow col-4 rounded-pill ms-4';
    stopTimeBtn.innerText = 'Stop Time';

    const completeBtn: HTMLButtonElement = document.createElement('button');
    completeBtn.className = 'btn btn-primary shadow col-4 rounded-pill me-4';
    completeBtn.innerText = 'Complete';


    const startStopTimeRow: HTMLDivElement = document.createElement('div');
    startStopTimeRow.className = 'container p-2 rounded d-flex justify-content-between gap-1';
    startStopTimeRow.innerHTML = `
    <div class="container col-5 rounded text-center shadow-sm light-bg py-2">
      <label for="startTime" class="form-label">Start Time</label> <br>
      <div class="container col-12 rounded text-center bg-transparent py-1">
      <input 
        type="time" 
        step="1" 
        class="form-control mx-auto px-2 shadow-sm lighter-bg clockText text-center" 
        id="startTime" 
        value="00:00:00">
      </div>
    </div>
    <div class="container col-5 rounded text-center shadow-sm light-bg py-2">
      <label for="stopTime" class="form-label">Stop Time</label> <br>
      <div class="container col-12 rounded text-center bg-transparent py-1">
      <input 
        type="time" 
        step="1" 
        class="form-control mx-auto px-2 shadow-sm lighter-bg clockText text-center " 
        id="stopTime" 
        value="00:00:00">
      </div>
    </div>`;

    const calender: HTMLElement = renderCalendar();

    // Build card
    body.appendChild(dropDownRow);
    overlay.appendChild(card);
    card.appendChild(header);
    card.appendChild(body);
    body.appendChild(calender);
    body.appendChild(startStopTimeRow);

    const bottomSection: HTMLDivElement = document.createElement('div');
    bottomSection.className = 'mt-auto d-flex flex-column  gap-3';
    bottomSection.appendChild(description);
    bottomSection.appendChild(buttonRow);

    body.appendChild(bottomSection);
    buttonRow.appendChild(startTimeBtn);

    loadCases();
    let originalStartTime: string;
    // Event listeners
    startTimeBtn.addEventListener('click', async (): Promise<void> => {
      //get Start time
      const startTimeNow: string = getTimeNow();
      //get the user who pressed start time
      const currentUserId = getUserId();
      if (!currentUserId) {
        console.error('User ID is not available.');
        return;
      }
      const currentUserName = getDisplayName();
      if (!currentUserName) {
        console.error('User display name is not available.');
        return;
      }

      console.log('Current User ID:', currentUserId);
      //This time needs to be stored the same place as the Id so that each account has a latest time that can be queried
      originalStartTime = startTimeNow;

      startTimeBtn.remove();
      buttonRow.appendChild(stopTimeBtn);
      displayTime('startTime', startTimeNow);
      //const result = await getTimeData();
      sendStartTimeData(startTimeNow, currentUserId, currentUserName);
    });

    stopTimeBtn.addEventListener('click', (): void => {
      //Gets the time of stopping
      const stopTimeNow: string = getTimeNow();
      buttonRow.appendChild(completeBtn);
      displayTime('stopTime', stopTimeNow);
    });

    completeBtn.addEventListener('click', (): void => {
      //gets the start time
      const startTimeInput: string = (document.getElementById('startTime') as HTMLInputElement)
        .value;
      //gets the stop time
      const stopTimeInput: string = (document.getElementById('stopTime') as HTMLInputElement).value;
      //Gets the text from the description
      const description: string = (document.getElementById('description') as HTMLInputElement)
        .value;

      const calenderField: string = (document.getElementById('dateInput') as HTMLInputElement)
        .value;

      const caseId: string = getCaseIdFromSelect();

      console.log('Selected case ID:', caseId);

      //updates the values after pressing complete
      updateTimeData(
        startTimeInput,
        stopTimeInput,
        calculateTotalTime(startTimeInput, stopTimeInput),
        description,
        getDateNow(calenderField),
        caseId,
        originalStartTime,
      );

      document.body.removeChild(overlay);
    });
    return overlay;
  }

  return div;
}

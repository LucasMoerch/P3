import { Calendar, type Options } from 'vanilla-calendar-pro';
import 'vanilla-calendar-pro/styles/index.css';
import './calendar.custom.scss';

export function renderCalendar(): HTMLElement {
  const wrapper = document.createElement('div');
  wrapper.className = 'container p-4 rounded';

  const inputGroup = document.createElement('div');
  inputGroup.className = 'd-flex gap-2 shadow-sm align-items-center';

  const calenderBtn = document.createElement('button');
  calenderBtn.className = 'btn btn-primary shadow-sm rounded';
  calenderBtn.innerHTML = `<i class="fa-solid fa-calendar"></i>`;

  const input = document.createElement('input');
  input.id = 'dateInput';
  input.type = 'text';
  input.placeholder = 'Choose date';

  input.className = 'form-control rounded w-100 lighter-bg';
  inputGroup.appendChild(input);
  inputGroup.appendChild(calenderBtn);
  wrapper.appendChild(inputGroup);

  const options: Options = {
    inputMode: true,
    positionToInput: 'auto',
    onChangeToInput(self) {
      if (!self.context.inputElement) return;
      if (self.context.selectedDates[0]) {
        self.context.inputElement.value = self.context.selectedDates[0];
        self.hide();
      } else {
        self.context.inputElement.value = '';
      }
    },
  };

  const calendar = new Calendar(input, options);
  calendar.init();
  calenderBtn.addEventListener('click', () => {
    calendar.show();
  });

  return wrapper;
}

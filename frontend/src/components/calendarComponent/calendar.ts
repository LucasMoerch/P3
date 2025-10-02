import { Calendar, type Options } from 'vanilla-calendar-pro';
import 'vanilla-calendar-pro/styles/index.css';
import './calendar.custom.scss';

export function renderCalendar(): HTMLElement {
  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = 'Choose date';
  input.className = 'form-control';

  // DOCS: https://vanilla-calendar.pro/docs/learn/type-default
  const options: Options = {
    inputMode: true,
    positionToInput: 'auto',
    onChangeToInput(self) {
      // inserts selected date to input field
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

  return input;
}

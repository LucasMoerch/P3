import './home.scss';
import './creatingCaseComponent';
import { renderNewCase } from './creatingCaseComponent';
import { renderCard } from '../../components/cardComponent/cardComponent';

export function renderHomePage(): HTMLElement {
  const container = document.createElement('div');
  container.className = 'home-container';

  const cardsContainer = document.createElement('div');
  cardsContainer.className = 'cards-container';
  /*--------------------------------------------------------------------*/
  //card for hours worked
  const hoursContainer = document.createElement('div');
  hoursContainer.className = 'hours-worked-container';

  const hours_worked = document.createElement('button');
  hours_worked.className = `
      card border-0 shadow-sm bg-white text-dark rounded p-3 
      d-flex flex-column justify-content-start gap-1 w-100
      `;
  hours_worked.style.height = '130px';
  hours_worked.style.cursor = 'pointer';

  hours_worked.innerHTML = `
      <div class="d-flex align-items-center mb-2" style="justify-content: space-around;"">
        <span class="fs-large fw-semibold">16.5</span>
        <i class="fa-regular fa-clock fs-big"></i>
      </div>
      <p class="fs-6 fw-medium mb-0">Hours worked</p>
      <p class="fs-6 text-muted mb-0">This week</p>
      `;

  hoursContainer.appendChild(hours_worked);
  cardsContainer.appendChild(hoursContainer);

  /*--------------------------------------------------------------------*/
  //Card for when you want to create a new case.
  const create_new_container = document.createElement('div');
  create_new_container.className = 'create-new-container';

  const create_new = document.createElement('button');
  create_new.className = `
      card border-0 shadow-sm bg-white text-dark rounded 
      d-flex flex-column justify-content-center align-items-center 
      w-100 p-3
      `;
  create_new.style.height = '130px';
  create_new.style.cursor = 'pointer';

  create_new.innerHTML = `
      <i class="fa-solid fa-circle-plus fs-1"></i>
      `;

  create_new_container.appendChild(create_new);
  cardsContainer.appendChild(create_new_container);

  container.appendChild(cardsContainer);

  create_new.addEventListener('click', (): void => {
    const cardEl = creating_case();
    document.body.appendChild(cardEl);
    console.log('creating new case clicked');
  });

  function creating_case(): HTMLElement {
    const overlay: HTMLElement = renderCard();
    const card: HTMLElement = overlay.querySelector('.card') as HTMLElement;
    const header: HTMLElement = card.querySelector('.header') as HTMLElement;
    const body: HTMLElement = card.querySelector('.body') as HTMLElement;

  

    overlay.appendChild(card);
    card.appendChild(header);
    card.appendChild(body);

    // //Function for what happens when you hit complete button
    // completeBtn.addEventListener('click', (): void => {
    //   const newCase = document.createElement('div');
    //   newCase.className = `
    //         card bg-white text-dark shadow-sm border-0 
    //         text-center d-flex justify-content-center align-items-center 
    //         p-3 mb-3 col-12 col-md-5
    //         `;

    //   newCase.style.height = '130px';
    //   newCase.style.width = '48%'; // Two cards per row

    //   newCase.innerHTML = `<p class="fw-medium text-dark mb-0">Empty Case</p>`;

    //   active_cases_container.appendChild(newCase);

    //   overlay.remove();
    // });



    return overlay;
  }

  /*--------------------------------------------------------------------*/
  //Text for active cases
  const headerRow = document.createElement('div');
  headerRow.className = 'cases-header';

  const active_cases = document.createElement('p');
  active_cases.className = 'active-cases';
  active_cases.textContent = 'Active Cases';

  headerRow.appendChild(active_cases);

  /*--------------------------------------------------------------------*/
  //sort
  const sort = document.createElement('div');
  sort.className = 'sort-by';
  sort.innerHTML = `<i class="fa-solid fa-arrow-down-short-wide"></i>`;

  headerRow.appendChild(sort);

  container.appendChild(headerRow);

  /*--------------------------------------------------------------------*/
  //container to hold active tasks (just an empty template for now)

  const active_cases_container = document.createElement('div');
  active_cases_container.className = `d-flex flex-wrap justify-content-between align-items-start w-100 mt-3`;
  container.appendChild(active_cases_container);

  return container;
}

import './home.scss'
import './creatingCaseComponent'
import {renderNewCase} from "./creatingCaseComponent";

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
    hours_worked.className = 'hours-worked-card';
    hours_worked.innerHTML = `
    <div class="hours-top">
      <span class="hours-value">16.5</span>
      <div class="hours-icon">
        <i class="fa-regular fa-clock"></i>
      </div>
    </div>
    <p class="hours-label">Hours worked</p>
    <p class="hours-subtext">This week</p>
    `;


    hoursContainer.appendChild(hours_worked);
    cardsContainer.appendChild(hoursContainer);

    /*--------------------------------------------------------------------*/
    //Card for when you want to create a new case.
    const create_new_container = document.createElement('div');
    create_new_container.className = 'create-new-container';

    const create_new = document.createElement('button');
    create_new.className = 'create-new-card';
    create_new.innerHTML = `
    <div class="plus-icon">
        <i class="fa-solid fa-circle-plus"></i>
    </div>
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
        const overlay: HTMLElement = renderNewCase();
        const card: HTMLElement = overlay.querySelector('.card') as HTMLElement;
        const header: HTMLElement = card.querySelector('.header') as HTMLElement;
        const body: HTMLElement = card.querySelector('.body') as HTMLElement;

        const closeBtn = document.createElement('button');
        closeBtn.className = 'btn btn-secondary col-3';
        closeBtn.innerText = 'X';

        const completeBtn: HTMLButtonElement = document.createElement('button');
        completeBtn.className = 'btn btn-primary';
        completeBtn.innerText = 'Complete';

        overlay.appendChild(card);
        card.appendChild(closeBtn);
        card.appendChild(header);
        card.appendChild(body);
        body.appendChild(completeBtn);


        //Function for what happens when you hit complete button
        completeBtn.addEventListener('click', (): void =>{
            const newCase = document.createElement('div');
            newCase.className = 'case-card';
            newCase.innerHTML = `<p class="case-label">Empty Case</p>`;

            active_cases_container.appendChild(newCase);

            overlay.remove();
        });

        closeBtn.addEventListener('click', () => {
            overlay.remove();
        });

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

    //container to hold active tasks (just a empty template for now)

    const active_cases_container = document.createElement('div');
    active_cases_container.className = 'active-cases-container';
    container.appendChild(active_cases_container);




    return container;
}

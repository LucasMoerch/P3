import { renderTable } from "../components/tableComponent/tableComponent"
import { renderSearchComponent } from "../components/searchBar/searchBar";
import { renderAddNewStaffCard } from "../components/newCard/addNewStaffCard"
import { renderNewButton } from "../components/newButton/newButton"

export function renderStaffPage(): HTMLElement {
    const div = document.createElement("div");
    div.innerHTML = `<h1>Staff page</h1>`;

    const container = document.createElement("div");
    container.classList.add("container");
    container.appendChild(div);
    container.appendChild(renderSearchComponent());


    const placeholderData: {name: string; role: string}[] = [
        { name: "John Johnson", role: "CEO" },
        { name: "Bruce Wayne", role: "Staff" },
        { name: "Guy Black", role: "Manager" },
        { name: "Bro Big", role: "Big Bro"}
    ];

    container.appendChild(renderTable(placeholderData));
    return container;
}

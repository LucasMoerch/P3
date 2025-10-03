import { renderTable } from "../components/tableComponent/tableComponent"

export function renderStaffPage(): HTMLElement {
    const div = document.createElement("div");
    div.innerHTML = `<h1>Staff page</h1>`;

    const container = document.createElement("div");
    container.classList.add("container");
    container.appendChild(div);

    const placeholderData: {name: string; role: string}[] = [
        { name: "John Johnson", role: "CEO" },
        { name: "Bruce Wayne", role: "Staff" },
        { name: "Guy Black", role: "Manager" },
    ];

    container.appendChild(renderTable(placeholderData));
    return container;
}

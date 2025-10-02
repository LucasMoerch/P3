import { renderHealthCheck} from "../components/healthCheck";

export function renderStaffPage(): HTMLElement{
    const div = document.createElement("div");
    div.innerHTML = `<h1>Staff page<h1>`;

    const container = document.createElement("container");
    container.appendChild(div);
    container.appendChild(renderHealthCheck())

    return container
}
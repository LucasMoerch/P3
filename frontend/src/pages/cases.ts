import { renderHealthCheck} from "../components/healthCheck";

export function renderCasesPage(): HTMLElement{
    const div = document.createElement("div");
    div.innerHTML = `<h1>Cases<h1>`;

    const container = document.createElement("container");
    container.appendChild(div);
    container.appendChild(renderHealthCheck())

    return container
}
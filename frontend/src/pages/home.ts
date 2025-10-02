import { renderHealthCheck} from "../components/healthCheck";
import { renderTimeTracker } from "../components/timeTracker/timeTracker";

export function renderHomePage(): HTMLElement{
    const div = document.createElement("div");
    div.innerHTML = `<h1>Home page<h1>`;

    div.className = "primary"
    const container = document.createElement("div");
    container.appendChild(div);
    container.appendChild(renderHealthCheck())

     const timeTracking = document.createElement("div");
    container.appendChild(timeTracking);
    container.appendChild(renderTimeTracker())

    const loginLink = document.createElement("a");
    loginLink.innerHTML = "Login"
    loginLink.href = "/login"
    container.appendChild(loginLink)

    return container
}
import { renderHealthCheck} from "../components/healthCheck";
import { renderTimeTracker } from "../components/timeTracker/timeTracker";
import {exampleComponent} from "../components/exampleComponent/exampleComponent"

export function renderHomePage(): HTMLElement{
    const div = document.createElement("div");
    div.innerHTML = `<h1>Home page<h1>`;

   

    const container = document.createElement("container");
    container.appendChild(div);
    container.appendChild(renderHealthCheck())

     const timeTracking = document.createElement("div");
    container.appendChild(timeTracking);
    container.appendChild(renderTimeTracker())

    const exampleComp = document.createElement("div");
    exampleComp.appendChild(exampleComponent());
    container.appendChild(exampleComp);

    const loginLink = document.createElement("a");
    loginLink.innerHTML = "Login"
    loginLink.href = "/login"
    container.appendChild(loginLink)

    return container
}
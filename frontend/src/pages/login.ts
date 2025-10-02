import {renderHealthCheck} from "../components/healthCheck";
import {renderLogIn} from "../components/logInBtn";

export function renderLoginPage(): HTMLElement{
    const div = document.createElement("div");
    div.innerHTML = `<h1>Log In page</h1>`;

    div.className = "primary"
    const container = document.createElement("div");
    container.appendChild(div);

    const loginLink = document.createElement("a");
    loginLink.innerHTML = "Log In"
    loginLink.href = "/home"
    loginLink.setAttribute("data-link", "");

    container.appendChild(loginLink)
    container.appendChild(renderLogIn())



    return container
}
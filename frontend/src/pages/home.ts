import { renderHealthCheck} from "../components/healthCheck";

export function renderHomePage(): HTMLElement{
    const div = document.createElement("div");
    div.innerHTML = `<h1>Home page<h1>`;

   

    const container = document.createElement("container");
    container.appendChild(div);
    container.appendChild(renderHealthCheck())

    const loginLink = document.createElement("a");
    loginLink.innerHTML = "Login"
    loginLink.href = "/login"
    container.appendChild(loginLink)

    return container
}
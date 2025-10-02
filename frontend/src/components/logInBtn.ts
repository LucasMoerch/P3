import http from "../api/http"

export function renderLogIn(): HTMLElement {
    const div = document.createElement("div");
    const button = document.createElement("button");
    button.id = "ping"
    button.className = "btn btn-primary"
    button.innerHTML = "Log In"


    div.appendChild(button)
    return div;
}
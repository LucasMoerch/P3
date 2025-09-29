import http from "../api/http"

export function renderHealthCheck(): HTMLElement {
    const div = document.createElement("div");
    const button = document.createElement("button");
    button.id = "ping"
    button.className = "btn btn-primary"
    button.innerHTML = "Check"

    // test connection
    button.addEventListener("click", async ()=> {
        console.log("Pinging server...");
        try {
            const { data } = await http.get("/actuator/health")
            console.log(data);
        }
        catch (error: any){
            console.log(error)
        }
    })

    div.appendChild(button)
    return div;
}
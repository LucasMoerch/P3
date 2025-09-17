import http from "../api/http";

const app = document.getElementById("app")!;
app.innerHTML = `
  <div class="card">
    <div class="card-body">
      <h1 class="h1">Frontend is running!!!</h1>
      <button id="ping" class="btn btn-primary">Ping API</button>
    </div>
  </div>
`;

// test connection
document.getElementById("ping")?.addEventListener("click", async ()=> {
    console.log("Pinging server...");
    try {
        const { data } = await http.get("/actuator/health")
        console.log(data);
    }
    catch (error: any){
        console.log(error)
    }
})

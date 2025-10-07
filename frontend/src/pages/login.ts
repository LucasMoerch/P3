import { renderLogo } from "../components/logoComponent/logo"

export function renderLoginPage(): HTMLElement {
    const container = document.createElement("div");
    container.className = "container d-flex justify-content-center align-items-center vh-100";

    const row = document.createElement("div");
    row.className = "row w-100 justify-content-center";

    const col = document.createElement("div");
    col.className = "col-12 col-md-8 col-lg-6";

    const card = document.createElement("div");
    card.className = "card p-5 login-card d-flex flex-column justify-content-center";

    const form = document.createElement("form");
    form.id = "login-form";
    form.innerHTML = `
    <div class="mb-3">
      <label for="email" class="form-label">E-mail</label>
      <input type="email" class="form-control" id="email" placeholder="Enter your email" /*required*/>
    </div>
    <div class="mb-3">
      <label for="password" class="form-label">Password</label>
      <input type="password" class="form-control" id="password" placeholder="Enter your password" /*required*/>
    </div>
    <div class="d-grid">
      <button type="submit" class="btn btn-primary">Log in</button>
    </div>
    <div class="d-grid">
</div>
  `;

    const googleBtn = document.createElement("div");
    googleBtn.className = "";
    googleBtn.innerHTML = '<a href="http://localhost:8080/api/oauth2/authorization/google">Sign in with Google</a>';
    form.appendChild(googleBtn);

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        window.location.href = "/home";
    });

    card.appendChild(renderLogo());
    card.appendChild(form);
    col.appendChild(card);
    row.appendChild(col);
    container.appendChild(row);

    return container;
}

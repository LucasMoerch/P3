export function renderLoginPage(): HTMLElement {
    const container = document.createElement("div");
    container.className = "container d-flex justify-content-center align-items-center vh-100";

    const card = document.createElement("div");
    card.className = "card p-5 shadow";
    card.style.maxWidth = "800px";
    card.style.width = "100%";
    card.style.minHeight = "500px";  // ⬅️ makes it taller
    card.style.display = "flex";
    card.style.flexDirection = "column";
    card.style.justifyContent = "center";

    // Logo
    const logoDiv = document.createElement("div");
    logoDiv.className = "text-center mb-4";
    logoDiv.innerHTML = `
      <img src="/enevold.jpg" alt="Logo" 
       class="img-fluid mb-3" style="max-height: 150px;">
    `;

    // Form
    const form = document.createElement("form");
    form.id = "login-form";

    form.innerHTML = `
  <div class="mb-3">
    <label for="email" class="form-label">E-mail</label>
    <input type="email" class="form-control" id="email" placeholder="Enter your email" required>
  </div>
  <div class="mb-3">
    <label for="password" class="form-label">Password</label>
    <input type="password" class="form-control" id="password" placeholder="Enter your password" required>
  </div>
  <div class="d-grid">
    <button type="submit" 
            class="btn text-white rounded-pill" 
            style="background-color: #867B5E; border: none;">
      Log in
    </button>
  </div>
`;


    form.addEventListener("submit", (e) => {
        console.log("Form submitted!");
        e.preventDefault();
        window.location.href = "/home";
    });

    // Assemble
    card.appendChild(logoDiv);
    card.appendChild(form);
    container.appendChild(card);

    return container;
}

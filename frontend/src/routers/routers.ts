import { renderHomePage } from "../pages/home";
import { renderLoginPage } from "../pages/login"

export function resolveRoute(path: string): HTMLElement {
    switch (path) {
        case "/login": return renderLoginPage();
        default: return renderHomePage();
    }
}

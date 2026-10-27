import { renderAuth } from "./auth-ui.js";
import { supabase, supabaseConfigured } from "../supabase/client.js";

const PRIVATE_ROUTES = new Set(["/app", "/workspace", "/history"]);

function normalizedPath() {
  const path = window.location.hash.replace(/^#/, "").split("?")[0] || "/";
  return path.length > 1 ? path.replace(/\/$/, "") : path;
}

export function createRouteGuard({ app, renderProtected, renderPublic }) {
  let user = null;
  let checking = false;
  let renderSequence = 0;

  const go = (path) => {
    window.location.hash = path;
  };

  async function requireUser() {
    if (!supabaseConfigured) return false;
    try {
      const { data, error } = await supabase().auth.getUser();
      if (error) throw error;
      user = data.user ?? null;
      return Boolean(user);
    } catch (error) {
      console.error("3L0 route guard error", error);
      user = null;
      return false;
    }
  }

  async function renderRoute() {
    const sequence = ++renderSequence;
    checking = true;
    const path = normalizedPath();
    try {
      if (PRIVATE_ROUTES.has(path)) {
        const authenticated = await requireUser();
        if (sequence !== renderSequence) return;
        if (!authenticated) {
          renderAuth({
            app,
            onAuthenticated: () => go("/app"),
            onBack: () => go("/")
          });
          return;
        }
        renderProtected({ app, user, path, onLogout });
        return;
      }
      if (sequence !== renderSequence) return;
      if (path === "/login" || path === "/signup") {
        renderAuth({
          app,
          onAuthenticated: () => go("/app"),
          onBack: () => go("/")
        });
        if (path === "/signup") {
          document.querySelector("#mode-signup")?.click();
        }
        return;
      }
      renderPublic?.({ app, onLogin: () => go("/login") });
    } finally {
      if (sequence === renderSequence) checking = false;
    }
  }

  async function onLogout() {
    if (supabaseConfigured) {
      const { error } = await supabase().auth.signOut();
      if (error) console.error("3L0 sign-out error", error);
    }
    user = null;
    go("/login");
  }

  function start() {
    window.addEventListener("hashchange", renderRoute);
    if (supabaseConfigured) {
      supabase().auth.onAuthStateChange((_event, session) => {
        user = session?.user ?? null;
        if (normalizedPath() === "/app" || PRIVATE_ROUTES.has(normalizedPath())) void renderRoute();
      });
    }
    void renderRoute();
    return () => window.removeEventListener("hashchange", renderRoute);
  }

  return { start, go, onLogout };
}

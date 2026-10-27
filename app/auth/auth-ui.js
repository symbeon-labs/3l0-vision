import { supabase, supabaseConfigured } from "../supabase/client.js";

export function renderAuth({ app, onAuthenticated, onBack }) {
  app.innerHTML = `
    <main class="shell auth-shell">
      <header class="topbar">
        <a class="brand-mark" href="#" id="auth-home" aria-label="3L0 Vision início">3L0<span class="brand-dot">.</span></a>
        <div class="status">ACESSO <span>RESTRITO</span></div>
      </header>
      <section class="hero auth-hero">
        <p class="eyebrow">3L0 VISION · AMBIENTE DE TESTE</p>
        <h1>Identifique-se<br /><strong>para continuar.</strong></h1>
        <p class="description">Acesse seu espaço de trabalho. Seus dados operacionais não devem ficar compartilhados entre usuários.</p>
        <div class="auth-mode" role="group" aria-label="Modo de acesso">
          <button type="button" class="auth-mode-button active" id="mode-login" aria-pressed="true">Entrar</button>
          <button type="button" class="auth-mode-button" id="mode-signup" aria-pressed="false">Criar conta</button>
        </div>
        <form class="auth-form" id="auth-form">
          <label for="auth-email">E-MAIL</label>
          <input id="auth-email" name="email" type="email" autocomplete="email" required maxlength="254" />
          <label for="auth-password">SENHA</label>
          <input id="auth-password" name="password" type="password" autocomplete="current-password" required minlength="8" />
          <button class="primary" id="auth-submit" type="submit">ENTRAR</button>
          <p class="auth-message" id="auth-message" role="status" aria-live="polite"></p>
        </form>
        <button class="back auth-back" id="auth-back" type="button">← VOLTAR AO INÍCIO</button>
        <p class="auth-footnote">Não use credenciais de produção em testes. O cadastro pode exigir confirmação por e-mail conforme a configuração do Supabase.</p>
      </section>
    </main>`;

  let mode = "login";
  const form = document.querySelector("#auth-form");
  const emailInput = document.querySelector("#auth-email");
  const passwordInput = document.querySelector("#auth-password");
  const submit = document.querySelector("#auth-submit");
  const message = document.querySelector("#auth-message");
  const loginButton = document.querySelector("#mode-login");
  const signupButton = document.querySelector("#mode-signup");

  function setMode(nextMode) {
    mode = nextMode;
    const signup = mode === "signup";
    submit.textContent = signup ? "CRIAR CONTA" : "ENTRAR";
    passwordInput.autocomplete = signup ? "new-password" : "current-password";
    loginButton.classList.toggle("active", !signup);
    signupButton.classList.toggle("active", signup);
    loginButton.setAttribute("aria-pressed", String(!signup));
    signupButton.setAttribute("aria-pressed", String(signup));
    message.textContent = "";
  }

  loginButton.addEventListener("click", () => setMode("login"));
  signupButton.addEventListener("click", () => setMode("signup"));
  document.querySelector("#auth-home").addEventListener("click", (event) => {
    event.preventDefault();
    onBack?.();
  });
  document.querySelector("#auth-back").addEventListener("click", () => onBack?.());

  if (!supabaseConfigured) {
    message.textContent = "Configuração pendente: adicione VITE_SUPABASE_URL e VITE_SUPABASE_PUBLISHABLE_KEY no Vercel e no ambiente local.";
    submit.disabled = true;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!supabaseConfigured) return;
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    submit.disabled = true;
    message.textContent = mode === "signup" ? "Criando conta..." : "Verificando acesso...";

    try {
      const auth = supabase().auth;
      const result = mode === "signup"
        ? await auth.signUp({ email, password })
        : await auth.signInWithPassword({ email, password });

      if (result.error) throw result.error;

      if (mode === "signup" && !result.data.session) {
        message.textContent = "Cadastro recebido. Confira seu e-mail para confirmar a conta e depois entre.";
        return;
      }

      if (mode === "login" || result.data.session) {
        message.textContent = "Acesso confirmado.";
        onAuthenticated?.(result.data.user);
      }
    } catch (error) {
      // Show a bounded user-facing message and retain details only in developer console.
      message.textContent = error?.message || "Não foi possível autenticar. Verifique os dados e tente novamente.";
      console.error("3L0 Auth error", error);
    } finally {
      submit.disabled = false;
    }
  });
}

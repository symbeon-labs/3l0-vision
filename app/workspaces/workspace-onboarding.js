import { createWorkspaceDraft, validateWorkspaceDraft } from "../../core/workspaces/contracts.js";
import { authConfigured, supabase } from "./auth-client.js";

const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
})[char]);

const splitList = (value) => value.split(/[\n,;]+/).map((item) => item.trim()).filter(Boolean);

export function renderWorkspaceOnboarding({ app, onBack }) {
  let session = null;
  let savedWorkspace = null;

  app.innerHTML = `
    <main class="shell workspace-shell">
      <header class="topbar">
        <button class="back" id="workspace-back" type="button">← VOLTAR AO GUIA</button>
        <div class="status">WORKSPACE <span>CASE 01</span></div>
      </header>
      <section class="workspace-hero">
        <p class="eyebrow">PLATAFORMA OPERACIONAL · CASE 01</p>
        <h1>Um contexto.<br /><strong>Uma operação.</strong></h1>
        <p class="description">Entre com sua conta para criar e recuperar workspaces persistidos. O acesso real depende da configuração do projeto Supabase.</p>
        <div class="workspace-warning" id="workspace-config-warning" role="status">
          <strong>CONFIGURAÇÃO NECESSÁRIA</strong>
          <p>O backend só estará disponível após configurar as variáveis Supabase no ambiente de hospedagem e aplicar a migração SQL. Não use dados reais até concluir os testes de segurança.</p>
        </div>
      </section>
      <section class="workspace-card" id="auth-card">
        <p class="eyebrow">00 · ACESSO</p>
        <h2>Autenticação</h2>
        <form id="auth-form" class="workspace-form" novalidate>
          <label for="auth-email">E-mail</label>
          <input id="auth-email" name="email" type="email" autocomplete="email" required maxlength="254" placeholder="voce@empresa.com" />
          <label for="auth-password">Senha</label>
          <input id="auth-password" name="password" type="password" autocomplete="current-password" required minlength="8" maxlength="128" placeholder="Mínimo de 8 caracteres" />
          <div class="workspace-actions">
            <button class="primary" type="submit" data-auth-mode="signin">ENTRAR</button>
            <button class="workspace-secondary" type="button" id="auth-signup">CRIAR CONTA</button>
          </div>
        </form>
        <div id="auth-status" class="workspace-help" role="status"></div>
        <button class="workspace-secondary" id="auth-signout" type="button" hidden>Sair da conta</button>
      </section>
      <form id="workspace-form" class="workspace-form" novalidate>
        <section class="workspace-card">
          <p class="eyebrow">01 · CONTEXTO</p>
          <h2>Organização e workspace</h2>
          <label for="organization-name">Nome da organização <span>obrigatório</span></label>
          <input id="organization-name" name="organizationName" required maxlength="120" placeholder="Ex.: Organização de demonstração" />
          <label for="workspace-name">Nome do workspace <span>obrigatório</span></label>
          <input id="workspace-name" name="workspaceName" required maxlength="120" placeholder="Ex.: Recebimento — Case 01" />
          <label for="pilot-objective">Objetivo operacional do piloto <span>obrigatório</span></label>
          <input id="pilot-objective" name="pilotObjective" required maxlength="240" placeholder="Qual resultado queremos avaliar?" />
          <label for="current-process">Como o processo funciona hoje? <span>obrigatório</span></label>
          <textarea id="current-process" name="currentProcess" required maxlength="1200" rows="3" placeholder="Descreva o fluxo em termos gerais, sem dados confidenciais."></textarea>
        </section>
        <section class="workspace-card">
          <p class="eyebrow">02 · AMBIENTE</p>
          <h2>Sistemas e critérios</h2>
          <label for="workspace-systems">Sistemas e fontes envolvidos</label>
          <input id="workspace-systems" name="systems" maxlength="500" placeholder="Planilhas, ERP, WMS (separados por vírgula)" />
          <label for="workspace-criteria">Como saberemos se melhorou? <span>obrigatório</span></label>
          <textarea id="workspace-criteria" name="successCriteria" required maxlength="800" rows="3" placeholder="Ex.: tempo por recebimento, retrabalho, correções"></textarea>
          <p class="workspace-help">Os critérios são declarações do usuário, não evidências verificadas automaticamente.</p>
        </section>
        <div id="workspace-errors" class="workspace-errors" role="alert" hidden></div>
        <button class="primary" type="submit" id="workspace-submit">CRIAR WORKSPACE RASCUNHO <span aria-hidden="true">→</span></button>
      </form>
      <section class="workspace-card" id="workspace-list-card">
        <p class="eyebrow">03 · PERSISTÊNCIA</p>
        <h2>Seus workspaces</h2>
        <button class="workspace-secondary" id="workspace-refresh" type="button">ATUALIZAR LISTA</button>
        <div id="workspace-list" class="workspace-help" role="status">Entre para consultar seus workspaces.</div>
      </section>
      <div id="workspace-review" class="workspace-review" hidden></div>
      <footer><span>3L0 VISION</span><span>CONTEXTO ANTES DA AUTOMAÇÃO.</span></footer>
    </main>`;

  const $ = (selector) => app.querySelector(selector);
  const authStatus = $("#auth-status");
  const authForm = $("#auth-form");
  const workspaceForm = $("#workspace-form");
  const workspaceErrors = $("#workspace-errors");
  const workspaceList = $("#workspace-list");

  $("#workspace-back").addEventListener("click", onBack);

  function showStatus(message, isError = false) {
    authStatus.textContent = message;
    authStatus.style.color = isError ? "#ff9b9b" : "";
  }

  function updateAuthUI() {
    $("#auth-signout").hidden = !session;
    $("#auth-email").disabled = Boolean(session);
    $("#auth-password").disabled = Boolean(session);
    authForm.querySelector('[data-auth-mode="signin"]').hidden = Boolean(session);
    $("#auth-signup").hidden = Boolean(session);
    workspaceForm.querySelector("button[type=submit]").disabled = !session;
    $("#workspace-refresh").disabled = !session;
    $("#workspace-config-warning").hidden = authConfigured && Boolean(session);
    if (session) showStatus(`Conectado: ${session.user.email || session.user.id}`);
  }

  async function requestWorkspaceList() {
    if (!session) {
      workspaceList.textContent = "Entre para consultar seus workspaces.";
      return;
    }
    workspaceList.textContent = "Carregando…";
    try {
      const response = await fetch("/api/workspaces", {
        headers: { Authorization: `Bearer ${session.access_token}` }
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Não foi possível consultar os workspaces.");
      const items = payload.workspaces || [];
      if (!items.length) {
        workspaceList.textContent = "Nenhum workspace persistido para esta conta.";
        return;
      }
      workspaceList.innerHTML = items.map((item) => `
        <article class="workspace-review-state">
          <span>${escapeHtml(item.organization?.name || item.organization_name || "Organização")}</span>
          <strong>${escapeHtml(item.name || "Workspace")}</strong>
          <p>Estado: ${escapeHtml(item.status || "indefinido")} · Papel: ${escapeHtml(item.role || "membro")}</p>
        </article>`).join("");
    } catch (error) {
      workspaceList.textContent = error.message || "Falha ao carregar workspaces.";
    }
  }

  async function acceptSession(nextSession) {
    session = nextSession;
    updateAuthUI();
    await requestWorkspaceList();
  }

  async function refreshSession() {
    if (!authConfigured) {
      showStatus("Supabase não configurado neste ambiente. Configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.", true);
      $("#workspace-config-warning").hidden = false;
      workspaceForm.querySelector("button[type=submit]").disabled = true;
      return;
    }
    const { data, error } = await supabase.auth.getSession();
    if (error) showStatus(error.message, true);
    await acceptSession(data?.session || null);
    if (!session) showStatus("Entre ou crie uma conta para continuar.");
  }

  authForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!authConfigured) return showStatus("Supabase não configurado neste ambiente.", true);
    const form = new FormData(authForm);
    const email = String(form.get("email") || "").trim();
    const password = String(form.get("password") || "");
    showStatus("Autenticando…");
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return showStatus(error.message, true);
    await acceptSession(data.session);
  });

  $("#auth-signup").addEventListener("click", async () => {
    if (!authConfigured) return showStatus("Supabase não configurado neste ambiente.", true);
    const email = $("#auth-email").value.trim();
    const password = $("#auth-password").value;
    if (!email || password.length < 8) return showStatus("Informe e-mail e senha com pelo menos 8 caracteres.", true);
    showStatus("Criando conta…");
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return showStatus(error.message, true);
    if (data.session) {
      await acceptSession(data.session);
    } else {
      showStatus("Conta solicitada. Confirme o e-mail e depois entre para continuar.");
    }
  });

  $("#auth-signout").addEventListener("click", async () => {
    if (!supabase) return;
    const { error } = await supabase.auth.signOut();
    if (error) return showStatus(error.message, true);
    session = null;
    updateAuthUI();
    await requestWorkspaceList();
    showStatus("Sessão encerrada.");
  });

  $("#workspace-refresh").addEventListener("click", requestWorkspaceList);

  workspaceForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!session) return showStatus("Entre antes de criar um workspace.", true);
    const form = new FormData(workspaceForm);
    const input = {
      organizationName: String(form.get("organizationName") || ""),
      workspaceName: String(form.get("workspaceName") || ""),
      pilotObjective: String(form.get("pilotObjective") || ""),
      currentProcess: String(form.get("currentProcess") || ""),
      systems: splitList(String(form.get("systems") || "")),
      successCriteria: splitList(String(form.get("successCriteria") || ""))
    };
    const validation = validateWorkspaceDraft(input);
    if (!validation.valid) {
      workspaceErrors.hidden = false;
      workspaceErrors.innerHTML = "<strong>Revise os campos:</strong><ul>" + validation.errors.map((error) => "<li>" + escapeHtml(error) + "</li>").join("") + "</ul>";
      return;
    }
    workspaceErrors.hidden = true;
    const button = $("#workspace-submit");
    button.disabled = true;
    button.textContent = "SALVANDO NO SERVIDOR…";
    try {
      const response = await fetch("/api/workspaces", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify(input)
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Falha ao persistir workspace.");
      savedWorkspace = payload.workspace;
      renderReview(savedWorkspace);
      await requestWorkspaceList();
    } catch (error) {
      workspaceErrors.hidden = false;
      workspaceErrors.textContent = error.message || "Não foi possível salvar. Confira a configuração do backend.";
    } finally {
      button.disabled = !session;
      button.innerHTML = 'CRIAR WORKSPACE RASCUNHO <span aria-hidden="true">→</span>';
    }
  });

  function renderReview(workspace) {
    const review = $("#workspace-review");
    review.hidden = false;
    review.innerHTML = `
      <section class="workspace-card">
        <p class="eyebrow">04 · CONFIRMAÇÃO DO SERVIDOR</p>
        <h2>Workspace persistido.</h2>
        <div class="workspace-review-state"><span>ESTADO</span><strong>${escapeHtml(workspace.status || "draft")} · NÃO ATIVADO</strong></div>
        <div class="workspace-review-state"><span>ORGANIZAÇÃO</span><strong>${escapeHtml(workspace.organizationName || "—")}</strong></div>
        <div class="workspace-review-state"><span>WORKSPACE</span><strong>${escapeHtml(workspace.name || "—")}</strong></div>
        <div class="workspace-review-state"><span>OBJETIVO</span><strong>${escapeHtml(workspace.objective || "—")}</strong></div>
        <div class="workspace-review-state"><span>ID</span><p>${escapeHtml(workspace.id || "—")}</p></div>
        <div class="workspace-warning"><strong>RASCUNHO PERSISTIDO</strong><p>O servidor confirmou a gravação. O workspace ainda não está ativado para operação real.</p></div>
      </section>`;
    review.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  if (supabase) {
    supabase.auth.onAuthStateChange((_event, nextSession) => {
      session = nextSession;
      updateAuthUI();
      if (session) requestWorkspaceList();
      else workspaceList.textContent = "Entre para consultar seus workspaces.";
    });
  }

  updateAuthUI();
  refreshSession();
}

import { validateWorkspaceDraft } from "../../core/workspaces/contracts.js";

const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
})[char]);

const splitList = (value) => value.split(/[\n,;]+/).map((item) => item.trim()).filter(Boolean);

export function renderWorkspaceOnboarding({ app, onBack, supabase }) {
  let session = null;
  app.innerHTML = `
    <main class="shell workspace-shell">
      <header class="topbar">
        <button class="back" id="workspace-back" type="button">← VOLTAR AO GUIA</button>
        <div class="status">WORKSPACE <span>CASE 01</span></div>
      </header>
      <section class="workspace-hero">
        <p class="eyebrow">PLATAFORMA OPERACIONAL · CASE 01</p>
        <h1>Um contexto.<br /><strong>Uma operação.</strong></h1>
        <p class="description">Crie e consulte workspaces persistidos usando a sessão autenticada da aplicação.</p>
        <div class="workspace-warning" id="workspace-config-warning" role="status">
          <strong>AMBIENTE EXPERIMENTAL</strong>
          <p>O backend exige as variáveis Supabase no servidor, a migração aplicada e testes de autorização concluídos. Não use dados reais antes da validação.</p>
        </div>
      </section>
      <section class="workspace-card">
        <p class="eyebrow">00 · SESSÃO</p>
        <h2 id="workspace-session-title">Validando sessão…</h2>
        <p id="workspace-session-status" class="workspace-help" role="status">A sessão é herdada da autenticação principal do 3L0 Vision.</p>
      </section>
      <form id="workspace-form" class="workspace-form" novalidate>
        <section class="workspace-card">
          <p class="eyebrow">01 · CONTEXTO</p>
          <h2>Organização e workspace</h2>
          <label for="organization-name">Nome da organização <span>obrigatório</span></label>
          <input id="organization-name" name="organizationName" required maxlength="120" placeholder="Organização de demonstração" />
          <label for="workspace-name">Nome do workspace <span>obrigatório</span></label>
          <input id="workspace-name" name="workspaceName" required maxlength="120" placeholder="Recebimento — Case 01" />
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
        <button class="primary" type="submit" id="workspace-submit" disabled>CRIAR WORKSPACE RASCUNHO <span aria-hidden="true">→</span></button>
      </form>
      <section class="workspace-card">
        <p class="eyebrow">03 · PERSISTÊNCIA</p>
        <h2>Seus workspaces</h2>
        <button class="workspace-secondary" id="workspace-refresh" type="button" disabled>ATUALIZAR LISTA</button>
        <div id="workspace-list" class="workspace-help" role="status">Validando sessão…</div>
      </section>
      <div id="workspace-review" class="workspace-review" hidden></div>
      <footer><span>3L0 VISION</span><span>CONTEXTO ANTES DA AUTOMAÇÃO.</span></footer>
    </main>`;

  const $ = (selector) => app.querySelector(selector);
  const form = $("#workspace-form");
  const errors = $("#workspace-errors");
  const list = $("#workspace-list");
  const submit = $("#workspace-submit");
  $("#workspace-back").addEventListener("click", onBack);

  function showError(message) {
    errors.hidden = false;
    errors.textContent = message;
  }

  async function requestWorkspaceList() {
    if (!session?.access_token) {
      list.textContent = "Nenhuma sessão autenticada disponível.";
      return;
    }
    list.textContent = "Carregando workspaces…";
    try {
      const response = await fetch("/api/workspaces", {
        headers: { Authorization: `Bearer ${session.access_token}` }
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Não foi possível consultar os workspaces.");
      const items = payload.workspaces || [];
      if (!items.length) {
        list.textContent = "Nenhum workspace persistido para esta conta.";
        return;
      }
      list.innerHTML = items.map((item) => `
        <article class="workspace-review-state">
          <span>${escapeHtml(item.organization?.name || "Organização")}</span>
          <strong>${escapeHtml(item.name || "Workspace")}</strong>
          <p>Estado: ${escapeHtml(item.status || "indefinido")} · Papel: ${escapeHtml(item.role || "membro")}</p>
        </article>`).join("");
    } catch (error) {
      list.textContent = error.message || "Falha ao carregar workspaces.";
    }
  }

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

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!session?.access_token) return showError("A sessão expirou. Entre novamente na aplicação.");
    const data = new FormData(form);
    const input = {
      organizationName: String(data.get("organizationName") || ""),
      workspaceName: String(data.get("workspaceName") || ""),
      pilotObjective: String(data.get("pilotObjective") || ""),
      currentProcess: String(data.get("currentProcess") || ""),
      systems: splitList(String(data.get("systems") || "")),
      successCriteria: splitList(String(data.get("successCriteria") || ""))
    };
    const validation = validateWorkspaceDraft(input);
    if (!validation.valid) {
      errors.hidden = false;
      errors.innerHTML = "<strong>Revise os campos:</strong><ul>" + validation.errors.map((error) => "<li>" + escapeHtml(error) + "</li>").join("") + "</ul>";
      return;
    }
    errors.hidden = true;
    submit.disabled = true;
    submit.textContent = "SALVANDO NO SERVIDOR…";
    try {
      const response = await fetch("/api/workspaces", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify(input)
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Falha ao persistir workspace.");
      renderReview(payload.workspace || {});
      await requestWorkspaceList();
    } catch (error) {
      showError(error.message || "Não foi possível salvar. Confira a configuração do backend.");
    } finally {
      submit.disabled = !session;
      submit.innerHTML = 'CRIAR WORKSPACE RASCUNHO <span aria-hidden="true">→</span>';
    }
  });

  $("#workspace-refresh").addEventListener("click", requestWorkspaceList);

  async function init() {
    if (!supabase) {
      $("#workspace-session-title").textContent = "Autenticação indisponível";
      $("#workspace-session-status").textContent = "A aplicação não disponibilizou uma sessão Supabase.";
      $("#workspace-config-warning").hidden = false;
      return;
    }
    const { data, error } = await supabase.auth.getSession();
    if (error || !data?.session) {
      $("#workspace-session-title").textContent = "Sessão necessária";
      $("#workspace-session-status").textContent = "Volte ao início e autentique-se para continuar.";
      return;
    }
    session = data.session;
    $("#workspace-session-title").textContent = "Sessão autenticada";
    $("#workspace-session-status").textContent = `Conectado: ${session.user.email || session.user.id}`;
    submit.disabled = false;
    $("#workspace-refresh").disabled = false;
    await requestWorkspaceList();
  }

  void init();
}

import { createWorkspaceDraft, validateWorkspaceDraft } from "../../core/workspaces/contracts.js";

const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
})[char]);

const splitList = (value) => value.split(/[\n,;]+/).map((item) => item.trim()).filter(Boolean);

export function renderWorkspaceOnboarding({ app, onBack }) {
  let draft = null;

  app.innerHTML = `
    <main class="shell workspace-shell">
      <header class="topbar">
        <button class="back" id="workspace-back" type="button">← VOLTAR AO GUIA</button>
        <div class="status">WORKSPACE <span>EXPERIMENTAL</span></div>
      </header>
      <section class="workspace-hero">
        <p class="eyebrow">PLATAFORMA OPERACIONAL · CASE 01</p>
        <h1>Um contexto.<br /><strong>Uma operação.</strong></h1>
        <p class="description">Configure o ambiente de trabalho e o objetivo do piloto. O workspace organiza o contexto; não substitui o ERP nem comprova dados declarados.</p>
        <div class="workspace-warning" role="note">
          <strong>PROTÓTIPO LOCAL — SEM AUTENTICAÇÃO OU PERSISTÊNCIA</strong>
          <p>Não informe dados pessoais, financeiros, confidenciais ou reais de clientes. Este fluxo mantém o rascunho apenas na memória desta página. Não cria uma conta, não convida operadores e não ativa isolamento de organizações.</p>
        </div>
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
          <textarea id="workspace-criteria" name="successCriteria" required maxlength="800" rows="3" placeholder="Ex.: tempo por recebimento, retrabalho, correções (separados por vírgula)"></textarea>
          <p class="workspace-help">Respostas são consideradas declaradas e não verificadas. Critérios devem ser observáveis e acordados antes do piloto.</p>
        </section>
        <div id="workspace-errors" class="workspace-errors" role="alert" hidden></div>
        <button class="primary" type="submit">REVISAR RASCUNHO <span aria-hidden="true">→</span></button>
      </form>
      <div id="workspace-review" class="workspace-review" hidden></div>
      <footer><span>3L0 VISION</span><span>CONTEXTO ANTES DA AUTOMAÇÃO.</span></footer>
    </main>`;

  document.querySelector("#workspace-back").addEventListener("click", onBack);

  document.querySelector("#workspace-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const input = {
      organizationName: form.get("organizationName")?.toString() ?? "",
      workspaceName: form.get("workspaceName")?.toString() ?? "",
      pilotObjective: form.get("pilotObjective")?.toString() ?? "",
      currentProcess: form.get("currentProcess")?.toString() ?? "",
      systems: splitList(form.get("systems")?.toString() ?? ""),
      successCriteria: splitList(form.get("successCriteria")?.toString() ?? "")
    };
    const validation = validateWorkspaceDraft(input);
    const errors = document.querySelector("#workspace-errors");
    if (!validation.valid) {
      errors.hidden = false;
      errors.innerHTML = "<strong>Revise os campos:</strong><ul>" + validation.errors.map((error) => "<li>" + escapeHtml(error) + "</li>").join("") + "</ul>";
      return;
    }
    errors.hidden = true;
    draft = input;
    renderReview();
  });

  function renderReview() {
    const review = document.querySelector("#workspace-review");
    const workspace = createWorkspaceDraft(draft, {
      id: "ws-draft-" + (globalThis.crypto?.randomUUID?.() ?? Date.now().toString(36)),
      createdAt: new Date().toISOString()
    });
    review.hidden = false;
    review.innerHTML = `
      <section class="workspace-card">
        <p class="eyebrow">03 · REVISÃO</p>
        <h2>Rascunho estruturado.</h2>
        <div class="workspace-review-state"><span>ESTADO</span><strong> DRAFT · NÃO ATIVADO</strong></div>
        <div class="workspace-review-state"><span>ORGANIZAÇÃO</span><strong>${escapeHtml(workspace.organizationName)}</strong></div>
        <div class="workspace-review-state"><span>WORKSPACE</span><strong>${escapeHtml(workspace.workspaceName)}</strong></div>
        <div class="workspace-review-state"><span>OBJETIVO</span><strong>${escapeHtml(workspace.pilotObjective)}</strong></div>
        <div class="workspace-review-state"><span>PROCESSO ATUAL</span><p>${escapeHtml(workspace.currentProcess)}</p></div>
        <div class="workspace-review-state"><span>SISTEMAS DECLARADOS</span><p>${workspace.systems.length ? workspace.systems.map(escapeHtml).join(", ") : "Não informado"}</p></div>
        <div class="workspace-review-state"><span>CRITÉRIOS DE SUCESSO</span><ul>${workspace.successCriteria.map((item) => "<li>" + escapeHtml(item) + "</li>").join("")}</ul></div>
        <div class="workspace-warning"><strong>AINDA NÃO É UM WORKSPACE ATIVO</strong><p>O objeto foi validado no cliente e existe somente na memória da página. Ativação real exige autenticação, autorização no servidor, persistência protegida, associação de membros e testes de isolamento.</p></div>
        <button class="primary" id="workspace-edit" type="button">VOLTAR E CORRIGIR</button>
      </section>`;
    review.scrollIntoView({ behavior: "smooth", block: "start" });
    document.querySelector("#workspace-edit").addEventListener("click", () => {
      review.hidden = true;
      document.querySelector("#workspace-form").scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }
}

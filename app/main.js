import { createClient } from "@supabase/supabase-js";
import { OrcClient } from "../core/orc/client.js";
import { deterministicResolver } from "../core/orc/deterministic-resolver.js";
import { ResolutionPipeline } from "../core/pipeline/resolution-pipeline.js";
import { BrowserCaptureAdapter } from "./capture/browser-capture.js";
import { parseGlyphReference } from "../core/vision/glyph-reference.js";
import { LocalCatalog } from "./catalog/local-catalog.js";
import { renderWorkspaceOnboarding } from "./workspaces/workspace-onboarding.js";
import "./styles.css";

const app = document.querySelector("#app");
const catalog = new LocalCatalog();
const client = new OrcClient({ resolver: deterministicResolver });
let captureAdapter = null;
let resolutions = 0;
let supabase = null;
let authUser = null;
let authTransition = false;
let activeWorkspace = null;
const WORKSPACE_STORAGE_KEY = "3l0.activeWorkspaceId";
function getStoredWorkspaceId() {
  try { return localStorage.getItem(WORKSPACE_STORAGE_KEY); } catch { return null; }
}
function setActiveWorkspace(workspace) {
  activeWorkspace = workspace || null;
  try {
    if (activeWorkspace?.id) localStorage.setItem(WORKSPACE_STORAGE_KEY, activeWorkspace.id);
    else localStorage.removeItem(WORKSPACE_STORAGE_KEY);
  } catch { /* Server authorization remains authoritative. */ }
}

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

function renderAuth(message = "", mode = "signin") {
  stopCapture();
  const signup = mode === "signup";
  app.innerHTML = `
    <main class="shell auth-shell">
      <header class="topbar"><a class="brand-mark" href="/" aria-label="3L0 Vision">3L0<span class="brand-dot">.</span></a><div class="status">ACESSO <span>SEGURO</span></div></header>
      <section class="auth-panel">
        <p class="eyebrow">3L0 VISION · AMBIENTE EXPERIMENTAL</p>
        <h1>${signup ? "Criar acesso." : "Bem-vindo<br /><strong>de volta.</strong>"}</h1>
        <p class="description">${signup ? "Crie sua conta para acessar o ambiente experimental de conferência e identificação." : "Entre para continuar sua conferência de mercadorias."}</p>
        <form class="auth-form" id="auth-form">
          ${signup ? '<label for="full-name">NOME</label><input id="full-name" name="fullName" autocomplete="name" maxlength="120" required />' : ""}
          <label for="auth-email">E-MAIL</label>
          <input id="auth-email" name="email" type="email" autocomplete="email" required />
          <label for="auth-password">SENHA</label>
          <input id="auth-password" name="password" type="password" autocomplete="${signup ? "new-password" : "current-password"}" minlength="8" required />
          <p class="auth-message" id="auth-message" role="status" aria-live="polite">${message}</p>
          <button class="primary auth-submit" type="submit">${signup ? "CRIAR CONTA" : "ENTRAR"}</button>
        </form>
        <button class="auth-switch" id="auth-switch" type="button">${signup ? "Já tem acesso? Entrar" : "Primeiro acesso? Criar conta"}</button>
        ${!signup ? '<button class="auth-switch" id="auth-reset" type="button">Esqueci minha senha</button>' : ""}
        <p class="auth-footnote">Acesso protegido por Supabase Auth. Os dados de cada espaço dependem das permissões verificadas no banco.</p>
      </section>
    </main>`;
  document.querySelector("#auth-switch").addEventListener("click", () => renderAuth("", signup ? "signin" : "signup"));
  const reset = document.querySelector("#auth-reset");
  if (reset) reset.addEventListener("click", async () => {
    const email = document.querySelector("#auth-email").value.trim();
    const target = document.querySelector("#auth-message");
    if (!email) { target.textContent = "Informe seu e-mail para receber o link de recuperação."; return; }
    reset.disabled = true;
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin });
    target.textContent = error ? "Não foi possível solicitar a recuperação agora. Confira o e-mail e tente novamente." : "Se houver uma conta para esse e-mail, enviaremos as instruções de recuperação.";
    reset.disabled = false;
  });
  document.querySelector("#auth-form").addEventListener("submit", async event => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") || "").trim();
    const password = String(form.get("password") || "");
    const target = document.querySelector("#auth-message");
    const submit = document.querySelector(".auth-submit");
    submit.disabled = true;
    target.textContent = signup ? "Criando sua conta…" : "Verificando seu acesso…";
    try {
      const result = signup
        ? await supabase.auth.signUp({ email, password, options: { data: { full_name: String(form.get("fullName") || "").trim() } } })
        : await supabase.auth.signInWithPassword({ email, password });
      if (result.error) throw result.error;
      if (signup && !result.data.session) {
        target.textContent = "Conta criada. Confira seu e-mail para confirmar o cadastro antes de entrar.";
        submit.disabled = false;
        return;
      }
      authUser = result.data.user;
      renderHome();
    } catch (error) {
      target.textContent = error?.message?.includes("Invalid login credentials") ? "E-mail ou senha não conferem. Verifique os dados e tente novamente." : error?.message?.includes("Email not confirmed") ? "Confirme seu e-mail antes de entrar." : "Não foi possível concluir o acesso. Confira os dados e tente novamente.";
      submit.disabled = false;
    }
  });
}

function mountSessionControl() {
  const topbar = document.querySelector(".topbar");
  if (!topbar || !authUser) return;
  const control = document.createElement("button");
  control.type = "button";
  control.className = "session-control";
  control.textContent = "SAIR";
  control.setAttribute("aria-label", "Encerrar sessão");
  control.addEventListener("click", async () => {
    control.disabled = true;
    const { error } = await supabase.auth.signOut();
    if (error) {
      control.disabled = false;
      console.error("Sign out failed", error);
    }
  });
  topbar.append(control);
}

async function bootApp() {
  if (!supabaseUrl || !supabaseKey) {
    renderAuth();
    const form = document.querySelector("#auth-form");
    if (form) form.hidden = true;
    const sw = document.querySelector("#auth-switch");
    if (sw) sw.hidden = true;
    const reset = document.querySelector("#auth-reset");
    if (reset) reset.hidden = true;

    // Keep configuration diagnostics visible even when the form itself is hidden.
    const notice = document.createElement("p");
    notice.className = "auth-message auth-config-notice";
    notice.setAttribute("role", "alert");
    notice.textContent = "Configuração pendente: defina VITE_SUPABASE_URL e VITE_SUPABASE_PUBLISHABLE_KEY nas variáveis de ambiente do Vercel para este Preview/ambiente e faça um novo deploy.";
    const footnote = document.querySelector(".auth-footnote");
    if (footnote) footnote.before(notice);
    else document.querySelector(".auth-panel")?.append(notice);
    console.error("[3L0 Auth] Missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY.");
    return;
  }
  supabase = createClient(supabaseUrl, supabaseKey, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } });
  const { data, error } = await supabase.auth.getUser();
  if (error && error.name !== "AuthSessionMissingError") console.warn("Auth session validation:", error.message);
  authUser = data?.user ?? null;
  supabase.auth.onAuthStateChange((event, session) => {
    if (authTransition) return;
    authTransition = true;
    authUser = session?.user ?? null;
    if (event === "SIGNED_OUT") {
      stopCapture();
      renderAuth();
    }
    authTransition = false;
  });
  if (authUser) renderHome();
  else renderAuth();
}

function renderHome() {
  stopCapture();
  app.innerHTML = `
    <main class="shell home-shell">
      <header class="topbar"><a class="brand-mark" href="#" aria-label="3L0 Vision início">3L0<span class="brand-dot">.</span></a><div class="status">PROTÓTIPO <span>FASE 1</span></div></header>
      <section class="home-hero">
        <p class="eyebrow">RESOLUÇÃO OPERACIONAL · 01</p>
        <h1>O que vamos<br /><strong>resolver?</strong></h1>
        <p class="description">Confira um produto relacionando códigos e informações disponíveis. O sistema apresenta correspondências e pontos que precisam de revisão; uma leitura isolada não confirma a identidade do item.</p>
        <section class="active-workspace-panel" aria-labelledby="active-workspace-title">
          <p class="eyebrow">CONTEXTO ATIVO</p>
          <label for="workspace-selector" id="active-workspace-title">Espaço de trabalho da operação</label>
          <select id="workspace-selector" class="workspace-selector" aria-describedby="workspace-context-help">
            <option value="">Carregando seus workspaces…</option>
          </select>
          <p id="workspace-context-help" class="workspace-help">Escolha o espaço que define o contexto desta conferência. O servidor verifica suas permissões antes de autorizar a operação.</p>
        </section>
        <button class="capture-card" id="identify" type="button" disabled><span class="capture-icon">⌾</span><span><strong>COMEÇAR IDENTIFICAÇÃO</strong><small>Selecione um workspace para iniciar</small></span><span class="arrow">→</span></button>
        <button class="workspace-entry" id="workspace-entry" type="button"><span><strong>GERENCIAR ESPAÇOS DE TRABALHO</strong><small>Criar um espaço ou consultar os espaços disponíveis</small></span><span aria-hidden="true">→</span></button>
        <section class="active-workspace-panel" aria-labelledby="resolution-history-title">
          <p class="eyebrow">PERSISTÊNCIA NO SERVIDOR</p>
          <label id="resolution-history-title">Últimas execuções deste workspace</label>
          <div id="resolution-history" class="workspace-help" role="status">Selecione um workspace para consultar o histórico.</div>
          <button class="workspace-entry" id="refresh-resolution-history" type="button">ATUALIZAR HISTÓRICO</button>
        </section>
        <div class="demo-note"><span class="pulse-dot"></span> AMBIENTE EXPERIMENTAL <span>·</span> CATÁLOGO LOCAL DE DEMONSTRAÇÃO</div>
      </section>
      <section class="learning-section" aria-labelledby="how-title">
        <div class="section-heading"><p class="eyebrow">COMO USAR</p><h2 id="how-title">Da observação<br />ao estado.</h2></div>
        <div class="steps-grid">
          <article class="step-card"><span class="step-number">01</span><h3>Observe</h3><p>Leia um código pela câmera ou digite o identificador manualmente. A captura registra um sinal, não uma identidade definitiva.</p></article>
          <article class="step-card"><span class="step-number">02</span><h3>Relacione</h3><p>O protótipo compara o identificador com o catálogo local disponível e encaminha a observação para o fluxo de resolução.</p></article>
          <article class="step-card"><span class="step-number">03</span><h3>Verifique</h3><p>Confira o resultado. Se não houver evidência suficiente, não trate a correspondência como confirmada.</p></article>
        </div>
      </section>
      <section class="states-section" aria-labelledby="states-title">
        <div class="section-heading"><p class="eyebrow">LEITURA DOS RESULTADOS</p><h2 id="states-title">Três estados.<br />Sem falsa certeza.</h2></div>
        <div class="state-list">
          <div class="state-row"><span class="state-mark resolved-mark">✓</span><div><strong>RESOLVED</strong><p>O fluxo encontrou uma correspondência única de acordo com as regras atuais do protótipo.</p></div></div>
          <div class="state-row"><span class="state-mark uncertain-mark">?</span><div><strong>UNCERTAIN</strong><p>As evidências disponíveis não sustentam uma resolução única. É necessário revisar ou obter mais dados.</p></div></div>
          <div class="state-row"><span class="state-mark conflict-mark">!</span><div><strong>CONFLICT</strong><p>Há sinais incompatíveis segundo as regras do resolvedor. Não significa, por si só, fraude ou erro físico.</p></div></div>
        </div>
      </section>
      <section class="limits-panel">
        <p class="eyebrow">IMPORTANTE SOBRE ESTA DEMO</p>
        <h2>O que ela faz — e o que ainda não faz.</h2>
        <div class="limits-grid"><p><strong>Disponível agora</strong><br />Captura de códigos compatíveis, entrada manual, normalização da observação e resolução determinística com catálogo local de demonstração.</p><p><strong>Ainda não disponível</strong><br />OCR operacional completo, catálogo multiusuário persistente, integração real com ERP/WMS, emissão/consulta de registro Glyph e validação em campo.</p></div>
        <p class="limits-footnote">QR Glyph valida apenas o formato sintático da referência. Isso não prova autenticidade da etiqueta nem identidade física do produto.</p>
      </section>
      <section class="activity"><div><span>SESSÃO ATUAL</span><strong>${resolutions} resolução${resolutions === 1 ? "" : "ões"} concluída${resolutions === 1 ? "" : "s"}</strong></div><p>Contagem temporária desta sessão; não é uma métrica de desempenho nem fica sincronizada entre dispositivos.</p></section>
      <footer><span>3L0 VISION</span><span>TORNAR O MUNDO FÍSICO COMPUTÁVEL.</span></footer>
    </main>`;
  mountSessionControl();
  const identifyButton = document.querySelector("#identify");
  const workspaceSelector = document.querySelector("#workspace-selector");
  identifyButton.addEventListener("click", () => { if (activeWorkspace) renderCapture(); });
  workspaceSelector.addEventListener("change", () => {
    const option = workspaceSelector.selectedOptions[0];
    let workspace = null;
    try { workspace = option?.dataset.workspace ? JSON.parse(option.dataset.workspace) : null; } catch {}
    setActiveWorkspace(workspace);
    identifyButton.disabled = !activeWorkspace;
    identifyButton.querySelector("small").textContent = activeWorkspace
      ? "Contexto: " + activeWorkspace.name + " · Câmera, códigos ou entrada manual"
      : "Selecione um workspace para iniciar";
    void loadResolutionHistory(activeWorkspace?.id);
  });
  document.querySelector("#refresh-resolution-history").addEventListener("click", () => void loadResolutionHistory(activeWorkspace?.id));
  void loadWorkspaceChoices(workspaceSelector, identifyButton);
  document.querySelector("#workspace-entry").addEventListener("click", () => renderWorkspaceOnboarding({ app, onBack: renderHome, supabase }));
  document.querySelector(".brand-mark").addEventListener("click", event => { event.preventDefault(); renderHome(); });
}

async function loadWorkspaceChoices(selector, identifyButton) {
  try {
    const { data } = await supabase.auth.getSession();
    const token = data?.session?.access_token;
    if (!token) throw new Error("Sessão expirada. Entre novamente.");
    const response = await fetch("/api/workspaces", { headers: { Authorization: "Bearer " + token } });
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.error || "Não foi possível carregar os workspaces.");
    const workspaces = payload.workspaces || [];
    selector.innerHTML = '<option value="">Selecione um workspace…</option>';
    for (const workspace of workspaces) {
      const option = document.createElement("option");
      option.value = workspace.id;
      option.textContent = workspace.name;
      option.dataset.workspace = JSON.stringify(workspace);
      selector.append(option);
    }
    const storedId = getStoredWorkspaceId();
    const stored = workspaces.find((item) => item.id === storedId);
    setActiveWorkspace(stored || null);
    selector.value = stored?.id || "";
    identifyButton.disabled = !stored;
    identifyButton.querySelector("small").textContent = stored
      ? "Espaço ativo: " + stored.name + " · Câmera ou código manual"
      : workspaces.length ? "Escolha um espaço de trabalho para iniciar" : "Crie um espaço de trabalho antes de iniciar";
    if (!workspaces.length) {
      selector.innerHTML = '<option value="">Nenhum espaço de trabalho disponível</option>';
      document.querySelector("#workspace-context-help").textContent = "Você ainda não tem acesso a um espaço de trabalho. Use “Gerenciar espaços de trabalho” para criar um ou consulte a pessoa administradora.";
    }
    await loadResolutionHistory(stored?.id);
  } catch (error) {
    selector.innerHTML = '<option value="">Não foi possível carregar os espaços</option>';
    document.querySelector("#workspace-context-help").textContent = "Não conseguimos consultar seus espaços agora. Verifique sua conexão e tente novamente. Se o problema continuar, entre em contato com a equipe responsável.";
    console.error("[3L0 Workspaces] Failed to load workspace choices:", error);
    identifyButton.disabled = true;
  }
}

async function loadResolutionHistory(workspaceId) {
  const target = document.querySelector("#resolution-history");
  if (!target) return;
  if (!workspaceId) {
    target.textContent = "Selecione um workspace autorizado para consultar o histórico.";
    return;
  }
  target.textContent = "Carregando execuções registradas…";
  try {
    const { data, error } = await supabase.auth.getSession();
    const token = data?.session?.access_token;
    if (error || !token) throw new Error("Sessão expirada. Entre novamente.");
    const response = await fetch("/api/resolution-runs?workspaceId=" + encodeURIComponent(workspaceId), {
      headers: { Authorization: "Bearer " + token }
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload.error || "Não foi possível consultar o histórico.");
    const runs = payload.runs || [];
    if (!runs.length) {
      target.textContent = "Nenhuma execução persistida neste workspace ainda.";
      return;
    }
    target.replaceChildren();
    for (const run of runs) {
      const article = document.createElement("article");
      article.className = "workspace-review-state";
      const heading = document.createElement("strong");
      heading.textContent = run.status + " · " + run.input_code;
      const detail = document.createElement("p");
      detail.textContent = new Date(run.created_at).toLocaleString("pt-BR") + " · " + run.input_scheme + " · ID " + run.id;
      article.append(heading, detail);
      target.append(article);
    }
  } catch (error) {
    target.textContent = error?.message || "Falha ao carregar o histórico.";
  }
}

function renderCapture() {
  if (!activeWorkspace?.id) { renderHome(); return; }
  app.innerHTML = '<main class="shell"><header class="topbar"><button class="back" id="back" type="button">← VOLTAR AO GUIA</button><div class="status">WORKSPACE <span>ATIVO</span></div></header><section class="capture-stage"><p class="eyebrow">ETAPA 01 · OBSERVAÇÃO</p><div class="camera-frame"><video id="camera" playsinline muted></video><img id="captured-image" class="captured-image" alt="Prévia da imagem capturada" hidden /><div class="scan-line" id="scan-line"></div><div class="camera-hint" id="camera-status" role="status" aria-live="polite">Solicitando câmera...</div></div><div class="capture-actions"><button class="primary" id="capture-photo" type="button" disabled>CAPTURAR FOTO</button><label class="upload-button" for="image-upload">ENVIAR IMAGEM</label><input id="image-upload" class="visually-hidden" type="file" accept="image/*" capture="environment" /></div><p id="image-status" class="image-status" role="status" aria-live="polite">Você pode fotografar um rótulo ou enviar uma imagem. A leitura de texto (OCR) ainda não está conectada nesta versão.</p><form class="manual-form" id="manual-form"><label for="code">OU INFORME O CÓDIGO PARA O ORC</label><div class="manual-row"><input id="code" name="code" autocomplete="off" placeholder="EAN / identificador" /><button type="submit">RESOLVER</button></div></form><p class="capture-note">O leitor automático detecta códigos de barras/QR quando o navegador oferece suporte. O ORC compara identificadores com o catálogo local; não extrai texto de fotografias.</p></section></main>';
  document.querySelector("#back").addEventListener("click", renderHome);
  const video = document.querySelector("#camera");
  const captureButton = document.querySelector("#capture-photo");
  const imageInput = document.querySelector("#image-upload");
  const preview = document.querySelector("#captured-image");
  captureButton.addEventListener("click", captureStillImage);
  imageInput.addEventListener("change", () => {
    const file = imageInput.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      document.querySelector("#image-status").textContent = "Arquivo inválido. Selecione uma imagem.";
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      preview.src = String(reader.result);
      preview.hidden = false;
      video.hidden = true;
      document.querySelector("#scan-line").hidden = true;
      document.querySelector("#image-status").textContent = "Imagem carregada para inspeção visual. OCR não executado: informe o código manualmente ou use a câmera para leitura de código.";
    };
    reader.readAsDataURL(file);
  });
  captureAdapter = new BrowserCaptureAdapter({ videoElement: video, onStatus: handleCaptureStatus });
  captureAdapter.start().catch(function (error) { handleCaptureStatus({ type: "camera_error", error }); });
}


function captureStillImage() {
  const video = document.querySelector("#camera");
  const preview = document.querySelector("#captured-image");
  const status = document.querySelector("#image-status");
  if (!video || !preview || !video.videoWidth || !video.videoHeight) {
    status.textContent = "A câmera ainda não está pronta. Permita o acesso à câmera ou use ENVIAR IMAGEM.";
    return;
  }
  const canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const context = canvas.getContext("2d");
  if (!context) {
    status.textContent = "Não foi possível capturar a imagem neste navegador.";
    return;
  }
  context.drawImage(video, 0, 0, canvas.width, canvas.height);
  preview.src = canvas.toDataURL("image/jpeg", 0.92);
  preview.hidden = false;
  video.hidden = true;
  document.querySelector("#scan-line").hidden = true;
  status.textContent = "Foto capturada e exibida. OCR ainda não está conectado; nenhum texto foi extraído da imagem.";
  captureAdapter?.stop();
  captureAdapter = null;
}

function handleCaptureStatus(status) {
  const target = document.querySelector("#camera-status");
  if (!target) return;
  if (status.type === "camera_ready") { target.textContent = "APONTE PARA O CÓDIGO"; const button = document.querySelector("#capture-photo"); if (button) button.disabled = false; }
  if (status.type === "barcode_unavailable") target.textContent = "LEITURA AUTOMÁTICA INDISPONÍVEL · USE A ENTRADA MANUAL";
  if (status.type === "camera_error") { target.textContent = "CÂMERA INDISPONÍVEL · USE ENVIAR IMAGEM OU A ENTRADA MANUAL"; const button = document.querySelector("#capture-photo"); if (button) button.disabled = true; }
  if (status.type === "barcode_scan_error") target.textContent = "FALHA TÉCNICA NA LEITURA · TENTE NOVAMENTE OU INFORME O CÓDIGO";
  if (status.type === "barcode_detected") {
    try {
      const glyph = status.format === "qr_code" ? parseGlyphReference(status.value) : null;
      const code = glyph ? glyph.value : status.value;
      const scheme = glyph ? glyph.scheme : formatToScheme(status.format);
      target.textContent = glyph ? "REFERÊNCIA GLYPH RECONHECIDA · VALIDADA SINTATICAMENTE" : "CÓDIGO DETECTADO · " + status.format;
      void resolveInput({ code, scheme, method: "barcode", glyphVersion: glyph?.version ?? null });
    } catch (error) {
      target.textContent = "REFERÊNCIA GLYPH INVÁLIDA OU NÃO SUPORTADA";
      console.warn("Glyph QR validation failed", error);
    }
  }
}

async function resolveInput(input) {
  stopCapture();
  renderProcessing();
  try {
    const pipeline = new ResolutionPipeline({
      captureAdapter: {
        async capture() {
          return {
            source: input.method === "barcode" ? "browser-camera" : "manual-entry",
            modality: "identifier",
            identifiers: [{ scheme: input.scheme, value: input.code }],
            context: { capture_method: input.method, ...(input.glyphVersion ? { glyph: { version: input.glyphVersion, validation: "syntax-only" } } : {}) }
          };
        }
      },
      entityRepository: catalog,
      orcClient: client,
      onStage: function (event) { updateProcessingStage(event.name); }
    });
    const output = await pipeline.run({ input, context: {
      operation: "identify_product",
      interface: "web",
      workspace: activeWorkspace ? { id: activeWorkspace.id, name: activeWorkspace.name, organization_id: activeWorkspace.organization_id, status: activeWorkspace.status } : null
    } });
    let persistence;
    try {
      persistence = await persistResolutionRun({ input, output });
    } catch (error) {
      persistence = { saved: false, error: error?.message || "Não foi possível salvar a execução." };
      console.error("[3L0 Persistence] Resolution was computed but not persisted:", error);
    }
    renderResult(output, persistence);
  } catch (error) { renderError(error); }
}

async function persistResolutionRun({ input, output }) {
  const { data, error: sessionError } = await supabase.auth.getSession();
  const token = data?.session?.access_token;
  if (sessionError || !token) throw new Error("Sessão expirada. Entre novamente para salvar a execução.");
  if (!activeWorkspace?.id) throw new Error("Selecione um workspace autorizado antes de salvar a execução.");

  const response = await fetch("/api/resolution-runs", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token
    },
    body: JSON.stringify({
      workspaceId: activeWorkspace.id,
      input: { scheme: input.scheme, code: input.code, method: input.method },
      output: {
        observation: output.observation,
        result: output.result,
        state: output.state
      }
    })
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || "Falha ao persistir a execução.");
  return { saved: true, id: payload.run?.id };
}

function renderProcessing() { app.innerHTML = '<main class="shell"><section class="hero processing" aria-live="polite" aria-busy="true"><p class="eyebrow">PROCESSAMENTO</p><div class="result-icon processing-icon">◌</div><h1>Resolvendo<br /><strong>observação.</strong></h1><p class="description" id="stage">Capturando...</p></section></main>'; }
function updateProcessingStage(stage) { const target = document.querySelector("#stage"); if (!target) return; const labels = { CAPTURING: "Capturando...", OBSERVING: "Representando observação...", NORMALIZING: "Normalizando evidências...", RESOLVING: "Consultando resolução...", RESOLVED: "Projetando estado operacional...", COMPLETED: "Concluído." }; target.textContent = labels[stage] || stage; }

function renderResult(output, persistence = { saved: false, error: "Persistência não confirmada." }) {
  const result = output.result;
  const state = output.state;
  const resolved = result.status === "RESOLVED";
  if (resolved && persistence.saved) resolutions += 1;
  const persistenceLabel = persistence.saved
    ? "Salvo no servidor · " + String(persistence.id || "").slice(0, 8)
    : "NÃO SALVO · " + (persistence.error || "Falha de persistência");
  const persistenceNotice = persistence.saved
    ? "A execução foi registrada no servidor para este workspace. O resultado continua limitado às evidências e regras disponíveis."
    : "ATENÇÃO: a resolução foi calculada, mas não foi confirmada a gravação no servidor. Não trate esta execução como registrada. " + (persistence.error || "");
  app.innerHTML = '<main class="shell"><section class="hero" aria-live="polite"><p class="eyebrow">' + (resolved ? "CORRESPONDÊNCIA ENCONTRADA" : "REVISÃO NECESSÁRIA") + '</p><div class="result-icon ' + state.toLowerCase() + '">' + (resolved ? "✓" : "!") + '</div><h1>' + (resolved ? "Produto<br /><strong>identificado.</strong>" : "Precisamos<br /><strong>verificar.</strong>") + '</h1><div class="result-card"><div><span>RESULTADO</span><strong>' + (resolved ? "Correspondência encontrada" : state === "CONFLICT" ? "Informações em conflito" : state === "UNCERTAIN" ? "Informações insuficientes" : "Revisão necessária") + '</strong></div><div><span>CONTEXTO</span><strong>Catálogo local de demonstração</strong></div><div><span>ITEM CORRESPONDENTE</span><strong>' + (resolved ? result.entities[0] : "Ainda não identificado") + '</strong></div><div><span>PERSISTÊNCIA</span><strong>' + persistenceLabel + '</strong></div></div><p class="capture-note">' + persistenceNotice + ' O catálogo de produtos continua local nesta versão; persistir esta execução não significa que o catálogo foi sincronizado com o servidor nem confirma a identidade física do produto. Revise as informações antes de tomar uma decisão operacional.</p><button class="primary" id="again" type="button">VOLTAR AO GUIA</button></section></main>';
  document.querySelector("#again").addEventListener("click", renderHome);
}

function renderError(error) { app.innerHTML = '<main class="shell"><section class="hero"><p class="eyebrow">ERRO TÉCNICO</p><div class="result-icon conflict">!</div><h1>Não foi possível<br /><strong>processar.</strong></h1><p class="description">A operação falhou antes de produzir um resultado. Isso não significa que o produto esteja incorreto ou que exista uma divergência. Tente novamente.</p><button class="primary" id="retry" type="button">TENTAR NOVAMENTE</button></section></main>'; document.querySelector("#retry").addEventListener("click", renderCapture); console.error(error); }
function stopCapture() { if (captureAdapter) captureAdapter.stop(); captureAdapter = null; }
function inferScheme(code) { return /^\d{8}$|^\d{12,14}$/.test(code) ? "ean" : "identifier"; }
function formatToScheme(format) { return format && format.indexOf("ean") === 0 ? "ean" : format === "qr_code" ? "qr" : format === "code_128" ? "code128" : "identifier"; }

bootApp();

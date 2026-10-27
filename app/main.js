import { createClient } from "@supabase/supabase-js";
import { OrcClient } from "../core/orc/client.js";
import { deterministicResolver } from "../core/orc/deterministic-resolver.js";
import { ResolutionPipeline } from "../core/pipeline/resolution-pipeline.js";
import { BrowserCaptureAdapter } from "./capture/browser-capture.js";
import { parseGlyphReference } from "../core/vision/glyph-reference.js";
import { LocalCatalog } from "./catalog/local-catalog.js";
import "./styles.css";

const app = document.querySelector("#app");
const catalog = new LocalCatalog();
const client = new OrcClient({ resolver: deterministicResolver });
let captureAdapter = null;
let resolutions = 0;
let supabase = null;
let authUser = null;
let authTransition = false;

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
        <p class="description">${signup ? "Crie sua conta para acessar o ambiente de identificação operacional." : "Entre para continuar no ambiente de identificação operacional."}</p>
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
    target.textContent = error ? error.message : "Se houver uma conta para esse e-mail, enviaremos as instruções de recuperação.";
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
    target.textContent = signup ? "Criando conta..." : "Validando acesso...";
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
      target.textContent = error?.message || "Não foi possível autenticar. Tente novamente.";
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
    renderAuth("Configuração pendente: adicione VITE_SUPABASE_URL e VITE_SUPABASE_PUBLISHABLE_KEY nas variáveis de ambiente da Vercel.", "signin");
    const form = document.querySelector("#auth-form");
    if (form) form.hidden = true;
    const sw = document.querySelector("#auth-switch");
    if (sw) sw.hidden = true;
    const reset = document.querySelector("#auth-reset");
    if (reset) reset.hidden = true;
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
        <p class="description">Conecte o que você observa no mundo físico à identidade operacional correta. Sem transformar uma leitura isolada em certeza.</p>
        <button class="capture-card" id="identify" type="button"><span class="capture-icon">⌾</span><span><strong>COMEÇAR IDENTIFICAÇÃO</strong><small>Câmera, código de barras, QR ou entrada manual</small></span><span class="arrow">→</span></button>
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
  document.querySelector("#identify").addEventListener("click", renderCapture);
  document.querySelector(".brand-mark").addEventListener("click", event => { event.preventDefault(); renderHome(); });
}

function renderCapture() {
  app.innerHTML = '<main class="shell"><header class="topbar"><button class="back" id="back" type="button">← VOLTAR AO GUIA</button><div class="status">CAPTURA <span>AO VIVO</span></div></header><section class="capture-stage"><p class="eyebrow">ETAPA 01 · OBSERVAÇÃO</p><div class="camera-frame"><video id="camera" playsinline muted></video><div class="scan-line"></div><div class="camera-hint" id="camera-status">Solicitando câmera...</div></div><form class="manual-form" id="manual-form"><label for="code">OU INFORME O CÓDIGO</label><div class="manual-row"><input id="code" name="code" autocomplete="off" placeholder="EAN / identificador" /><button type="submit">RESOLVER</button></div></form><p class="capture-note">A câmera observa. O ORC resolve. Se a câmera não estiver disponível, use a entrada manual.</p></section></main>';
  document.querySelector("#back").addEventListener("click", renderHome);
  captureAdapter = new BrowserCaptureAdapter({ videoElement: document.querySelector("#camera"), onStatus: handleCaptureStatus });
  document.querySelector("#manual-form").addEventListener("submit", async function (event) {
    event.preventDefault();
    const code = new FormData(event.currentTarget).get("code")?.toString().trim();
    if (code) await resolveInput({ code, scheme: inferScheme(code), method: "manual" });
  });
  captureAdapter.start().catch(function (error) { handleCaptureStatus({ type: "camera_error", error }); });
}

function handleCaptureStatus(status) {
  const target = document.querySelector("#camera-status");
  if (!target) return;
  if (status.type === "camera_ready") target.textContent = "APONTE PARA O CÓDIGO";
  if (status.type === "barcode_unavailable") target.textContent = "LEITURA AUTOMÁTICA INDISPONÍVEL · USE A ENTRADA MANUAL";
  if (status.type === "camera_error") target.textContent = "CÂMERA INDISPONÍVEL · USE A ENTRADA MANUAL";
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
    const output = await pipeline.run({ input, context: { operation: "identify_product", interface: "web" } });
    renderResult(output);
  } catch (error) { renderError(error); }
}

function renderProcessing() { app.innerHTML = '<main class="shell"><section class="hero processing"><p class="eyebrow">PROCESSAMENTO</p><div class="result-icon processing-icon">◌</div><h1>Resolvendo<br /><strong>observação.</strong></h1><p class="description" id="stage">Capturando...</p></section></main>'; }
function updateProcessingStage(stage) { const target = document.querySelector("#stage"); if (!target) return; const labels = { CAPTURING: "Capturando...", OBSERVING: "Representando observação...", NORMALIZING: "Normalizando evidências...", RESOLVING: "Consultando resolução...", RESOLVED: "Projetando estado operacional...", COMPLETED: "Concluído." }; target.textContent = labels[stage] || stage; }

function renderResult(output) {
  const result = output.result; const state = output.state; const resolved = result.status === "RESOLVED"; if (resolved) resolutions += 1;
  app.innerHTML = '<main class="shell"><section class="hero"><p class="eyebrow">' + (resolved ? "RESOLUÇÃO CONCLUÍDA" : "EXCEÇÃO OPERACIONAL") + '</p><div class="result-icon ' + state.toLowerCase() + '">' + (resolved ? "✓" : "!") + '</div><h1>' + (resolved ? "Produto<br /><strong>identificado.</strong>" : "Precisamos<br /><strong>verificar.</strong>") + '</h1><div class="result-card"><div><span>ESTADO</span><strong>' + state + '</strong></div><div><span>ORIGEM</span><strong>OBSERVAÇÃO + ORC</strong></div><div><span>ENTIDADE</span><strong>' + (resolved ? result.entities[0] : "—") + '</strong></div></div><p class="capture-note">Este resultado é limitado ao catálogo local e às regras do protótipo. Não equivale a uma verificação independente do produto físico.</p><button class="primary" id="again" type="button">VOLTAR AO GUIA</button></section></main>';
  document.querySelector("#again").addEventListener("click", renderHome);
}

function renderError(error) { app.innerHTML = '<main class="shell"><section class="hero"><p class="eyebrow">ERRO TÉCNICO</p><div class="result-icon conflict">!</div><h1>Não foi possível<br /><strong>processar.</strong></h1><p class="description">A operação falhou tecnicamente. Isso não é uma resolução incerta.</p><button class="primary" id="retry" type="button">TENTAR NOVAMENTE</button></section></main>'; document.querySelector("#retry").addEventListener("click", renderCapture); console.error(error); }
function stopCapture() { if (captureAdapter) captureAdapter.stop(); captureAdapter = null; }
function inferScheme(code) { return /^\d{8}$|^\d{12,14}$/.test(code) ? "ean" : "identifier"; }
function formatToScheme(format) { return format && format.indexOf("ean") === 0 ? "ean" : format === "qr_code" ? "qr" : format === "code_128" ? "code128" : "identifier"; }

bootApp();

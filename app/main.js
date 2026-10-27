import { OrcClient } from "../core/orc/client.js";
import { deterministicResolver } from "../core/orc/deterministic-resolver.js";
import { ResolutionPipeline } from "../core/pipeline/resolution-pipeline.js";
import { BrowserCaptureAdapter } from "./capture/browser-capture.js";
import { parseGlyphReference } from "../core/vision/glyph-reference.js";
import { LocalCatalog } from "./catalog/local-catalog.js";
import "./styles.css";
import { createRouteGuard } from "./auth/route-guard.js";

const app = document.querySelector("#app");
const catalog = new LocalCatalog();
const client = new OrcClient({ resolver: deterministicResolver });
let captureAdapter = null;
let resolutions = 0;

function renderHome({ onLogin } = {}) {
  stopCapture();
  app.innerHTML = `
    <main class="shell home-shell">
      <header class="topbar"><a class="brand-mark" href="#" aria-label="3L0 Vision início">3L0<span class="brand-dot">.</span></a><div class="topbar-actions"><button class="auth-link" id="open-login" type="button">ENTRAR</button><div class="status">PROTÓTIPO <span>FASE 1</span></div></div></header>
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
  document.querySelector("#identify").addEventListener("click", renderCapture);
  document.querySelector("#open-login")?.addEventListener("click", () => onLogin?.());
  document.querySelector(".brand-mark").addEventListener("click", event => { event.preventDefault(); const routeGuard = createRouteGuard({
  app,
  renderPublic: ({ onLogin }) => renderHome({ onLogin }),
  renderProtected: ({ user, onLogout }) => renderWorkspace({ user, onLogout })
});

function renderWorkspace({ user, onLogout }) {
  stopCapture();
  const safeEmail = String(user?.email ?? "usuário autenticado").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[char]);
  app.innerHTML = `
    <main class="shell home-shell workspace-shell">
      <header class="topbar"><a class="brand-mark" href="#/" aria-label="3L0 Vision início">3L0<span class="brand-dot">.</span></a><div class="topbar-actions"><span class="status">SESSÃO <span>ATIVA</span></span><button class="auth-link" id="logout" type="button">SAIR</button></div></header>
      <section class="home-hero">
        <p class="eyebrow">ÁREA AUTENTICADA · AMBIENTE DE TESTE</p>
        <h1>Bem-vindo<br /><strong>ao 3L0.</strong></h1>
        <p class="description">Sessão autenticada como <strong>${safeEmail}</strong>. A camada de dados operacionais multiusuário ainda está em preparação e não é simulada como se estivesse pronta.</p>
        <button class="capture-card" id="identify" type="button"><span class="capture-icon">⌾</span><span><strong>COMEÇAR IDENTIFICAÇÃO</strong><small>Executar o fluxo de captura e resolução local</small></span><span class="arrow">→</span></button>
        <div class="demo-note"><span class="pulse-dot"></span> AUTENTICADO <span>·</span> CATÁLOGO LOCAL DO NAVEGADOR</div>
      </section>
      <section class="limits-panel"><p class="eyebrow">PRONTIDÃO DE TESTE</p><h2>Limites atuais</h2><div class="limits-grid"><p><strong>Configurado</strong><br />Login, sessão Auth e rota de interface protegida.</p><p><strong>Pendente</strong><br />Persistência de catálogo/evidências por workspace no banco e testes E2E de isolamento entre usuários.</p></div></section>
    </main>`;
  document.querySelector("#logout").addEventListener("click", () => { void onLogout(); });
  document.querySelector("#identify").addEventListener("click", renderCapture);
  document.querySelector(".brand-mark").addEventListener("click", (event) => { event.preventDefault(); window.location.hash = "/"; });
}

routeGuard.start(); });
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


const routeGuard = createRouteGuard({
  app,
  renderPublic: ({ onLogin }) => renderHome({ onLogin }),
  renderProtected: ({ user, onLogout }) => renderWorkspace({ user, onLogout })
});

function renderWorkspace({ user, onLogout }) {
  stopCapture();
  const safeEmail = String(user?.email ?? "usuário autenticado").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[char]);
  app.innerHTML = `
    <main class="shell home-shell workspace-shell">
      <header class="topbar"><a class="brand-mark" href="#/" aria-label="3L0 Vision início">3L0<span class="brand-dot">.</span></a><div class="topbar-actions"><span class="status">SESSÃO <span>ATIVA</span></span><button class="auth-link" id="logout" type="button">SAIR</button></div></header>
      <section class="home-hero">
        <p class="eyebrow">ÁREA AUTENTICADA · AMBIENTE DE TESTE</p>
        <h1>Bem-vindo<br /><strong>ao 3L0.</strong></h1>
        <p class="description">Sessão autenticada como <strong>${safeEmail}</strong>. A camada de dados operacionais multiusuário ainda está em preparação e não é simulada como se estivesse pronta.</p>
        <button class="capture-card" id="identify" type="button"><span class="capture-icon">⌾</span><span><strong>COMEÇAR IDENTIFICAÇÃO</strong><small>Executar o fluxo de captura e resolução local</small></span><span class="arrow">→</span></button>
        <div class="demo-note"><span class="pulse-dot"></span> AUTENTICADO <span>·</span> CATÁLOGO LOCAL DO NAVEGADOR</div>
      </section>
      <section class="limits-panel"><p class="eyebrow">PRONTIDÃO DE TESTE</p><h2>Limites atuais</h2><div class="limits-grid"><p><strong>Configurado</strong><br />Login, sessão Auth e rota de interface protegida.</p><p><strong>Pendente</strong><br />Persistência de catálogo/evidências por workspace no banco e testes E2E de isolamento entre usuários.</p></div></section>
    </main>`;
  document.querySelector("#logout").addEventListener("click", () => { void onLogout(); });
  document.querySelector("#identify").addEventListener("click", renderCapture);
  document.querySelector(".brand-mark").addEventListener("click", (event) => { event.preventDefault(); window.location.hash = "/"; });
}

routeGuard.start();

import { OrcClient } from "../core/orc/client.js";
import { deterministicResolver } from "../core/orc/deterministic-resolver.js";
import { ResolutionPipeline } from "../core/pipeline/resolution-pipeline.js";
import { BrowserCaptureAdapter } from "./capture/browser-capture.js";
import { LocalCatalog } from "./catalog/local-catalog.js";
import "./styles.css";

const app = document.querySelector("#app");
const catalog = new LocalCatalog();
const client = new OrcClient({ resolver: deterministicResolver });
let captureAdapter = null;
let resolutions = 0;

function renderHome() {
  stopCapture();
  app.innerHTML = '<main class="shell"><header class="topbar"><div class="brand-mark">3L0</div><div class="status">FASE 1 <span>VERTICAL SLICE</span></div></header><section class="hero"><p class="eyebrow">RESOLUÇÃO OPERACIONAL</p><h1>O que vamos<br /><strong>resolver?</strong></h1><p class="description">Observe. Relacione. Resolva.</p><button class="capture-card" id="identify" type="button"><span class="capture-icon">⌾</span><span><strong>IDENTIFICAR</strong><small>Câmera + código / entrada manual</small></span><span class="arrow">→</span></button></section><section class="activity"><div><span>HOJE</span><strong>' + resolutions + ' resolução' + (resolutions === 1 ? "" : "ões") + '</strong></div></section><footer><span>3L0 VISION</span><span>TORNAR O MUNDO FÍSICO COMPUTÁVEL.</span></footer></main>';
  document.querySelector("#identify").addEventListener("click", renderCapture);
}

function renderCapture() {
  app.innerHTML = '<main class="shell"><header class="topbar"><button class="back" id="back" type="button">← VOLTAR</button><div class="status">CAPTURA <span>AO VIVO</span></div></header><section class="capture-stage"><p class="eyebrow">OBSERVAÇÃO</p><div class="camera-frame"><video id="camera" playsinline muted></video><div class="scan-line"></div><div class="camera-hint" id="camera-status">Solicitando câmera...</div></div><form class="manual-form" id="manual-form"><label for="code">OU INFORME O CÓDIGO</label><div class="manual-row"><input id="code" name="code" inputmode="numeric" autocomplete="off" placeholder="EAN / identificador" /><button type="submit">RESOLVER</button></div></form><p class="capture-note">A câmera observa. O ORC resolve.</p></section></main>';
  document.querySelector("#back").addEventListener("click", renderHome);
  captureAdapter = new BrowserCaptureAdapter({ videoElement: document.querySelector("#camera"), onStatus: handleCaptureStatus });
  document.querySelector("#manual-form").addEventListener("submit", async function (event) { event.preventDefault(); const code = new FormData(event.currentTarget).get("code")?.toString().trim(); if (code) await resolveInput({ code, scheme: inferScheme(code), method: "manual" }); });
  captureAdapter.start().catch(function (error) { handleCaptureStatus({ type: "camera_error", error }); });
}

function handleCaptureStatus(status) {
  const target = document.querySelector("#camera-status");
  if (!target) return;
  if (status.type === "camera_ready") target.textContent = "APONTE PARA O CÓDIGO";
  if (status.type === "barcode_unavailable") target.textContent = "LEITURA AUTOMÁTICA INDISPONÍVEL · USE A ENTRADA MANUAL";
  if (status.type === "camera_error") target.textContent = "CÂMERA INDISPONÍVEL · USE A ENTRADA MANUAL";
  if (status.type === "barcode_detected") { target.textContent = "CÓDIGO DETECTADO · " + status.value; resolveInput({ code: status.value, scheme: formatToScheme(status.format), method: "barcode" }); }
}

async function resolveInput(input) {
  stopCapture();
  renderProcessing();
  try {
    const pipeline = new ResolutionPipeline({ captureAdapter: { async capture() { return { source: input.method === "barcode" ? "browser-camera" : "manual-entry", modality: "identifier", identifiers: [{ scheme: input.scheme, value: input.code }], context: { capture_method: input.method } }; } }, entityRepository: catalog, orcClient: client, onStage: function (event) { updateProcessingStage(event.name); } });
    const output = await pipeline.run({ input, context: { operation: "identify_product", interface: "web" } });
    renderResult(output);
  } catch (error) { renderError(error); }
}

function renderProcessing() { app.innerHTML = '<main class="shell"><section class="hero processing"><p class="eyebrow">PROCESSAMENTO</p><div class="result-icon processing-icon">◌</div><h1>Resolvendo<br /><strong>observação.</strong></h1><p class="description" id="stage">Capturando...</p></section></main>'; }
function updateProcessingStage(stage) { const target = document.querySelector("#stage"); if (!target) return; const labels = { CAPTURING: "Capturando...", OBSERVING: "Representando observação...", NORMALIZING: "Normalizando evidências...", RESOLVING: "Consultando resolução...", RESOLVED: "Projetando estado operacional...", COMPLETED: "Concluído." }; target.textContent = labels[stage] || stage; }

function renderResult(output) {
  const result = output.result; const state = output.state; const resolved = result.status === "RESOLVED"; if (resolved) resolutions += 1;
  app.innerHTML = '<main class="shell"><section class="hero"><p class="eyebrow">' + (resolved ? "RESOLUÇÃO CONCLUÍDA" : "EXCEÇÃO OPERACIONAL") + '</p><div class="result-icon ' + state.toLowerCase() + '">' + (resolved ? "✓" : "!") + '</div><h1>' + (resolved ? "Produto<br /><strong>identificado.</strong>" : "Precisamos<br /><strong>verificar.</strong>") + '</h1><div class="result-card"><div><span>ESTADO</span><strong>' + state + '</strong></div><div><span>ORIGEM</span><strong>OBSERVAÇÃO + ORC</strong></div><div><span>ENTIDADE</span><strong>' + (resolved ? result.entities[0] : "—") + '</strong></div></div><button class="primary" id="again" type="button">IDENTIFICAR OUTRO</button></section></main>';
  document.querySelector("#again").addEventListener("click", renderHome);
}

function renderError(error) { app.innerHTML = '<main class="shell"><section class="hero"><p class="eyebrow">ERRO TÉCNICO</p><div class="result-icon conflict">!</div><h1>Não foi possível<br /><strong>processar.</strong></h1><p class="description">A operação falhou tecnicamente. Isso não é uma resolução incerta.</p><button class="primary" id="retry" type="button">TENTAR NOVAMENTE</button></section></main>'; document.querySelector("#retry").addEventListener("click", renderCapture); console.error(error); }
function stopCapture() { if (captureAdapter) captureAdapter.stop(); captureAdapter = null; }
function inferScheme(code) { return /^\\d{8}$|^\\d{12,14}$/.test(code) ? "ean" : "identifier"; }
function formatToScheme(format) { return format && format.indexOf("ean") === 0 ? "ean" : format === "qr_code" ? "qr" : "identifier"; }

renderHome();
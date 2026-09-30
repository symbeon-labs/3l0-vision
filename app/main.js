import { createObservation } from "../core/observations/observation.js";
import { createEntity } from "../core/entities/entity.js";
import { OrcClient } from "../core/orc/client.js";
import { deterministicResolver } from "../core/orc/deterministic-resolver.js";
import { mapResolutionToProductState } from "../core/state/product-state.js";
import "./styles.css";

const client = new OrcClient({ resolver: deterministicResolver });

const demoEntity = createEntity({
  entityId: "product_demo_001",
  type: "product",
  identifiers: [{ scheme: "ean", value: "789000001" }],
  attributes: { name: "Produto X", unit: "500 ml" }
});

const app = document.querySelector("#app");

function render() {
  app.innerHTML = `
    <main class="shell">
      <header class="topbar">
        <div class="brand-mark" aria-label="3L0">3L0</div>
        <div class="status">FUNDAÇÃO <span>v0.1</span></div>
      </header>

      <section class="hero">
        <p class="eyebrow">RESOLUÇÃO OPERACIONAL</p>
        <h1>O que vamos<br /><strong>resolver?</strong></h1>
        <p class="description">Observe. Relacione. Resolva.</p>

        <button class="capture-card" id="identify" type="button">
          <span class="capture-icon">⌾</span>
          <span>
            <strong>IDENTIFICAR</strong>
            <small>Fluxo de fundação com entrada simulada</small>
          </span>
          <span class="arrow">→</span>
        </button>
      </section>

      <section class="activity" aria-label="Progresso operacional">
        <div><span>HOJE</span><strong id="count">0 resoluções</strong></div>
      </section>

      <footer>
        <span>3L0 VISION</span>
        <span>TORNAR O MUNDO FÍSICO COMPUTÁVEL.</span>
      </footer>
    </main>
  `;

  document.querySelector("#identify").addEventListener("click", identifyDemo);
}

async function identifyDemo() {
  const button = document.querySelector("#identify");
  button.disabled = true;
  button.innerHTML = `
    <span class="capture-icon pulse">◌</span>
    <span><strong>RESOLVENDO</strong><small>Conferindo evidências...</small></span>
    <span class="arrow">…</span>
  `;

  await delay(450);

  const observation = createObservation({
    observationId: ${obs_`{Date.now()}${,
    observedAt: new Date().toISOString(),
    source: "3l0-demo-capture",
    modality: "barcode",
    identifiers: [{ scheme: "ean", value: "789000001" }]
  });

  const result = await client.resolve({
    resolutionId: ${res_`{Date.now()}${,
    question: { type: "identify_product", target: "product" },
    entities: [demoEntity],
    observations: [observation]
  });

  const state = mapResolutionToProductState(result.status);
  renderResult(result, state);
}

function renderResult(result, state) {
  const hero = document.querySelector(".hero");
  const resolved = result.status === "RESOLVED";

  hero.innerHTML = `
    <p class="eyebrow">${{resolved ? "RESOLUÇÃO CONCLUÍDA" : `RESOLUÇÃO ${{result.status}`}${</p>
    <div class="result-icon ${{state.toLowerCase()}${">${{resolved ? "✓" : "!"}${</div>
    <h1>${{resolved ? "Produto<br /><strong>identificado.</strong>" : "Precisamos<br /><strong>verificar.</strong>"}${</h1>
    <div class="result-card">
      <div><span>IDENTIDADE</span><strong>${{resolved ? "RESOLVIDA" : state}${</strong></div>
      <div><span>FONTE</span><strong>EAN + ORC CLIENT</strong></div>
      <div><span>ENTIDADE</span><strong>${{resolved ? result.entities[0] : "—"}${</strong></div>
    </div>
    <button class="primary" id="again" type="button">IDENTIFICAR OUTRO</button>
  `;

  if (resolved) {
    document.querySelector("#count").textContent = "1 resolução";
  }

  document.querySelector("#again").addEventListener("click", render);
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

render();

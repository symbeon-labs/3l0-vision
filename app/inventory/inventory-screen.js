import { InventoryRepository } from "../../core/inventory/repository.js";

const TENANT_ID = "local-demo";
const STORAGE_WARNING = "Demonstração local neste navegador. Não use dados reais ou sensíveis; não há autenticação nem sincronização multiusuário.";
const makeId = (prefix) => `${prefix}-${globalThis.crypto?.randomUUID?.() ?? Date.now().toString(36) + Math.random().toString(36).slice(2)}`;
const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
const formatNumber = (value) => new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 3 }).format(value);

export function renderInventoryScreen({ app, onBack }) {
  const repository = new InventoryRepository({ storage: window.localStorage, tenantId: TENANT_ID });
  render();

  function render(message = "") {
    const products = repository.listProducts();
    const movements = repository.listMovements().slice().reverse();
    const balances = products.map((product) => ({ product, balance: repository.getStockBalance(product.productId) }));
    const totalUnits = balances.reduce((sum, item) => sum + item.balance.quantity, 0);
    app.innerHTML = `
      <main class="shell inventory-shell">
        <header class="topbar"><button class="back" id="inventory-back" type="button">← VOLTAR AO GUIA</button><div class="status">INVENTÁRIO <span>EXPERIMENTAL</span></div></header>
        <section class="inventory-hero">
          <p class="eyebrow">OPERAÇÃO · ESTOQUE</p><h1>Estado do<br /><strong>inventário.</strong></h1>
          <p class="description">Cadastre produtos, registre movimentações e acompanhe o saldo calculado a partir de movimentos confirmados.</p>
          <div class="inventory-warning" role="note"><strong>AMBIENTE DE PROTÓTIPO</strong><br />${STORAGE_WARNING}</div>
          ${message ? `<p class="inventory-message" role="status">${escapeHtml(message)}</p>` : ""}
          <div class="inventory-metrics"><article><span>PRODUTOS</span><strong>${products.length}</strong></article><article><span>MOVIMENTOS</span><strong>${movements.length}</strong></article><article><span>SALDO LÍQUIDO</span><strong>${formatNumber(totalUnits)}</strong></article></div>
        </section>
        <section class="inventory-grid">
          <form class="inventory-card" id="product-form">
            <p class="eyebrow">01 · CADASTRO</p><h2>Novo produto</h2>
            <label>Nome<input name="name" required maxlength="120" placeholder="Ex.: Café 500 g" /></label>
            <div class="inventory-form-row"><label>SKU (opcional)<input name="sku" maxlength="80" placeholder="SKU-001" /></label><label>Unidade<input name="unit" required maxlength="20" value="un" /></label></div>
            <button class="primary" type="submit">SALVAR PRODUTO</button>
          </form>
          <form class="inventory-card" id="movement-form">
            <p class="eyebrow">02 · MOVIMENTAÇÃO</p><h2>Registrar entrada ou saída</h2>
            <label>Produto<select name="productId" required ${products.length ? "" : "disabled"}><option value="">Selecione um produto</option>${products.map((product) => `<option value="${escapeHtml(product.productId)}">${escapeHtml(product.name)} · ${escapeHtml(product.unit)}</option>`).join("")}</select></label>
            <div class="inventory-form-row"><label>Tipo<select name="type"><option value="RECEIPT">Entrada</option><option value="ISSUE">Saída</option></select></label><label>Quantidade<input name="quantity" type="number" min="0.001" step="any" required placeholder="0" /></label></div>
            <label>Referência / motivo<input name="sourceReference" maxlength="120" placeholder="Nota, pedido ou motivo" /></label>
            <button class="primary" type="submit" ${products.length ? "" : "disabled"}>REGISTRAR MOVIMENTO</button>
            <p class="inventory-help">Movimentos entram no saldo apenas após serem marcados como CONFIRMED. Este formulário cria registros NEEDS_REVIEW; a confirmação é uma etapa deliberadamente separada.</p>
          </form>
        </section>
        <section class="inventory-table-section"><div class="inventory-section-head"><div><p class="eyebrow">03 · VISÃO CONSOLIDADA</p><h2>Saldo por produto</h2></div><button class="inventory-secondary" id="inventory-export" type="button" ${products.length ? "" : "disabled"}>EXPORTAR CSV</button></div>
          ${products.length ? `<div class="inventory-table-wrap"><table class="inventory-table"><thead><tr><th>Produto</th><th>SKU</th><th>Unidade</th><th>Saldo confirmado</th><th>Movimentos pendentes</th></tr></thead><tbody>${balances.map(({ product, balance }) => {
            const pending = repository.listMovements({ productId: product.productId }).filter((movement) => movement.state !== "CONFIRMED").length;
            return `<tr><td>${escapeHtml(product.name)}</td><td>${escapeHtml(product.sku || "—")}</td><td>${escapeHtml(product.unit)}</td><td>${formatNumber(balance.quantity)}</td><td><span class="inventory-badge">${pending}</span></td></tr>`;
          }).join("")}</tbody></table></div>` : '<div class="inventory-empty">Nenhum produto cadastrado. Comece pelo formulário acima.</div>'}
        </section>
        <section class="inventory-table-section"><div class="inventory-section-head"><div><p class="eyebrow">04 · RASTREABILIDADE</p><h2>Movimentações recentes</h2></div></div>
          ${movements.length ? `<div class="inventory-table-wrap"><table class="inventory-table"><thead><tr><th>Data</th><th>Produto</th><th>Tipo</th><th>Quantidade</th><th>Estado</th></tr></thead><tbody>${movements.slice(0, 30).map((movement) => {
            const product = repository.getProduct(movement.productId);
            return `<tr><td>${escapeHtml(new Date(movement.occurredAt).toLocaleString("pt-BR"))}</td><td>${escapeHtml(product?.name || "Produto indisponível")}</td><td>${escapeHtml(movement.type)}</td><td>${escapeHtml(formatNumber(movement.quantity))} ${escapeHtml(movement.unit)}</td><td><span class="inventory-badge">${escapeHtml(movement.state)}</span></td></tr>`;
          }).join("")}</tbody></table></div>` : '<div class="inventory-empty">Nenhuma movimentação registrada.</div>'}
        </section>
        <footer><span>3L0 VISION · INVENTÁRIO</span><span>PROTÓTIPO LOCAL · V0.1</span></footer>
      </main>`;

    document.querySelector("#inventory-back").addEventListener("click", onBack);
    document.querySelector("#product-form").addEventListener("submit", handleProduct);
    document.querySelector("#movement-form").addEventListener("submit", handleMovement);
    document.querySelector("#inventory-export")?.addEventListener("click", exportCsv);
  }

  function handleProduct(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    const unit = String(form.get("unit") ?? "").trim();
    if (!name || !unit) return render("Informe nome e unidade do produto.");
    try {
      repository.saveProduct({
        productId: makeId("prd"), name, unit, sku: String(form.get("sku") ?? "").trim() || null,
        state: "NEEDS_REVIEW",
        provenance: { sourceType: "manual", contractVersion: "inventory.v0.1" }
      });
      render("Produto salvo no armazenamento local.");
    } catch (error) {
      render("Não foi possível salvar o produto: " + error.message);
    }
  }

  function handleMovement(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const productId = String(form.get("productId") ?? "");
    const product = repository.getProduct(productId);
    const quantity = Number(form.get("quantity"));
    const type = String(form.get("type"));
    if (!product || !Number.isFinite(quantity) || quantity <= 0) return render("Selecione um produto e informe uma quantidade maior que zero.");
    const movementId = makeId("mov");
    try {
      repository.recordMovement({
        movementId, productId, type, direction: type === "RECEIPT" ? "IN" : "OUT",
        quantity, unit: product.unit, occurredAt: new Date().toISOString(),
        source: "manual-ui", sourceReference: String(form.get("sourceReference") ?? "").trim() || null,
        idempotencyKey: movementId, state: "NEEDS_REVIEW",
        provenance: { sourceType: "manual", contractVersion: "inventory.v0.1" },
        metadata: {}
      });
      render("Movimentação registrada como NEEDS_REVIEW; não altera o saldo confirmado.");
    } catch (error) {
      render("Não foi possível registrar a movimentação: " + error.message);
    }
  }

  function exportCsv() {
    const rows = [["productId", "name", "sku", "unit", "confirmedBalance", "pendingMovements"]];
    for (const product of repository.listProducts()) {
      const balance = repository.getStockBalance(product.productId);
      const pending = repository.listMovements({ productId: product.productId }).filter((movement) => movement.state !== "CONFIRMED").length;
      rows.push([product.productId, product.name, product.sku ?? "", product.unit, balance.quantity, pending]);
    }
    const csv = rows.map((row) => row.map((cell) => {
      const value = String(cell ?? "");
      return '"' + (/^[=+@\-\t\r]/.test(value) ? "'" + value : value).replace(/"/g, '""') + '"';
    }).join(",")).join("\r\n");
    const url = URL.createObjectURL(new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url; link.download = "3l0-inventory.csv"; link.click();
    URL.revokeObjectURL(url);
  }
}

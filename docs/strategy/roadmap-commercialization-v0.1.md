# 3L0 — Roadmap de comercialização e publicação

- Versão: 0.1
- Data: 2026-10-22
- Estado: proposta orientada por evidências; sem compromisso de calendário.

## Gate 1 — Mercado
Entrevistar clientes, comparar casos por frequência, valor, risco, custo e integração, identificar comprador e sistema de destino.
**Saída:** ICP e primeiro caso aprovados com evidência primária.

## Gate 2 — Oferta
Definir resultado, limites, inputs/outputs, exceções, revisão humana e separação entre plataforma, skill, consumo e integração.
**Saída:** oferta compreensível e testável.

## Gate 3 — Economia unitária
Medir custos por execução, incluindo OCR/modelos, ferramentas, APIs, armazenamento, retries e revisão humana. Testar unidade de cobrança e margem.
**Saída:** preço experimental, limites e margem aprovados; não publicar antes disso.

## Gate 4 — Contrato e medição
Definir registry/versionamento de skills, entitlements por tenant, eventos idempotentes, cotas, orçamento, consentimento para excedente e auditoria.
**Saída:** autorização e medição testadas ponta a ponta.

## Gate 5 — App
Mostrar skills habilitadas, entradas/saídas, limites, estimativa de custo, consentimento, resultado, consumo, falha e retries.
**Saída:** fluxo de uso compreensível e testado.

## Gate 6 — Portal
Publicar posicionamento e casos concretos. Distinguir disponível, piloto, em desenvolvimento e planejado. Publicar preço somente após aprovação; integrações apenas após implementação e validação.
**Saída:** conteúdo alinhado ao estado real do produto.

## Gate 7 — Expansão
Adicionar uma skill por vez, com demanda e margem verificadas. Priorizar adaptadores solicitados por clientes. Marketplace de terceiros só após governança, suporte, contratos e avaliação.

## Responsabilidades por repositório

| Repositório | Papel |
|---|---|
| 3l0-vision | Fonte canônica da estratégia de produto, pesquisa, negócio e roadmap |
| 3l0-core-vault | Contexto compacto, fontes, hipóteses e decisões |
| 3l0-agent | Orquestração, skill registry, entitlements, orçamento, aprovação e metering |
| 3l0-portal | Superfície pública que consome decisões aprovadas |
| 3L0 App | Descoberta, autorização, execução e histórico |

## Critérios para alterar o portal

Não publicar catálogo amplo de serviços antes de escolher ICP/caso inicial, decidir CTA, separar capacidades atuais de futuras e verificar cada alegação. Não publicar preço sem validação. Não declarar integração ativa sem evidência.

## Próxima ação
Pesquisa primária com potenciais clientes e comparação de 2–3 fluxos candidatos. Depois, especificar a primeira oferta e o contrato de skill.


## Trilha transversal — etiquetas e identificação

- **Gate A — contrato/validador:** auditar implementação atual; parser Glyph versionado; observação `3l0-glyph`; proveniência; integração Vision/ORC; estados RESOLVED/UNCERTAIN/CONFLICT; testes de QR inválido, versão desconhecida, referência ausente, duplicação e erro de leitura.
- **Gate B — leitura existente:** catalogar formatos e equipamentos do primeiro ambiente; medir sucesso, falhas e intervenção.
- **Gate C — geração/impressão:** somente com demanda validada; definir unicidade, token opaco, ciclo de vida, revogação, templates e critérios de leitura.
- **Gate D — integração/monetização:** mapear para ERP/WMS/CRM, medir custos e validar se geração/gestão é recurso base, add-on ou serviço.

Não declarar geração/impressão disponível antes de verificar código e testes. QR/etiqueta não prova autenticidade. A etiqueta é uma via de identificação opcional; o fluxo markerless permanece válido.

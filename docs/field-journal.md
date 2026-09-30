# 3L0 Vision — Diário de Bordo

**Estado:** Fase 0 concluída · Fase 1 aberta
**Repositório:** symbeon-labs/3l0-vision
**Núcleo:** Operational Resolution Core (ORC)
**Data de consolidação:** 30/09/2026

## 1. Origem

A investigação começou com um problema operacional: diferentes sistemas e pessoas observam partes diferentes da mesma realidade. Um produto pode aparecer como objeto físico, EAN, SKU, NF-e, registro ERP, imagem, OCR, declaração de operador, localização e operação.

A pergunta deixou de ser apenas “como cadastrar produtos?” e passou a ser:

> Como transformar representações heterogêneas do mesmo mundo físico em uma representação operacional coerente, rastreável e reutilizável?

## 2. Nascimento do ORC

O Operational Resolution Core foi separado como laboratório independente.

Tese:
> Sistemas operacionais podem precisar de uma camada explícita de resolução capaz de preservar asserções e evidências heterogêneas, contextualizar informações, resolver identidades e relações, representar conflito e incerteza e produzir estados operacionais rastreáveis.

## 3. Modelo conceitual

Seis candidatos a primitivas:
ENTITY · RELATION · ASSERTION · EVIDENCE · CONTEXT · RESOLUTION

Conceitos derivados/adjacentes:
Observation, Expectation, Inference, State, Event, Process, Consequence, Attestation.

Invariante central:
SOURCE → OBSERVATION/ASSERTION → EVIDENCE + CONTEXT → RESOLUTION → OPERATIONAL REPRESENTATION

## 4. Falsificação

Foram registrados 22 experimentos, incluindo:
- identidade ≠ relação;
- ocorrência ≠ evento;
- observação ≠ asserção;
- inferência ≠ fato;
- expectativa ≠ observação;
- tempo de observação ≠ validade;
- asserções contraditórias podem coexistir;
- múltiplos identificadores podem apontar para uma entidade;
- resolução depende da pergunta operacional;
- resolução não precisa escolher um “vencedor”;
- atestação ≠ resolução;
- arquitetura puramente orientada a eventos pode ser insuficiente;
- a hipótese precisa ser testada contra abordagens existentes e casos reais.

## 5. Minimal Computable Layer

Surgiu a hipótese de uma representação persistente mínima capaz de reconhecer uma entidade física, associar novas evidências e operar sobre ela sem reconstruir sua identidade.

Princípio:
> Uma entidade física pode ser criada uma vez e resolvida muitas vezes.

Primeiro encontro pode ser intelligence-heavy; encontros posteriores devem preferencialmente ser identity-heavy.

## 6. Visão, OCR e inteligência

Foi estabelecido:
câmera → preprocessing → barcode/OCR → normalização → matching determinístico → visão semântica se necessário → ORC

Confiança de modelo não é certeza operacional.

## 7. Caso de recebimento

O primeiro caso operacional combinou:
NF-e/XML + ERP + scanner + câmera + operador.

O sistema deve resolver identidade preservando a origem de cada representação. O caso não exige balança e permanece aberto à validação real.

## 8. ERP e dados fiscais

Foram mapeados domínios de identidade, descrição, comercial, estoque, fiscal e operacional.

Princípio:
> O operador deve trabalhar nas exceções, não redigitar aquilo que o sistema já consegue obter.

## 9. Attestation e JEV

Attestation foi separado de resolution.

JEV foi tratado como possível mecanismo de decisão delimitada, nunca como dependência conceitual do ORC. Inteligência deve permanecer substituível e subordinada ao contexto e às regras.

## 10. Nascimento do produto

Quando a pesquisa amadureceu, ORC e produto foram separados.

ORC:
semântica, resolução, entidades, relações, evidência, contexto, asserções, conflitos e incerteza.

3L0 Vision:
aplicação, captura, visão/OCR, UX, workflows, gamificação, histórico e integração ERP.

## 11. Nome e marca

O nome escolhido foi **3L0 Vision**:
- escrita: 3L0;
- leitura: Elo Vision;
- zero numérico.

A identidade usa near-black, cyan, green, amber, red, Inter e JetBrains Mono.

O símbolo representa:
CAPTURAR → RESOLVER → CONCLUIR.

## 12. UX

A interface foi organizada em torno de:
> O que vamos resolver?

Fluxo:
CAPTURANDO → ENTENDENDO → CONFERINDO → RESOLVENDO

Resultado e exceção são estados explícitos.

A regra é pedir somente aquilo que não pode ser resolvido com segurança.

## 13. Gamificação

Gamificação foi definida como visualização de progresso operacional, não competição.

Mostrar:
- resolvidos automaticamente;
- confirmados;
- pendentes;
- em revisão;
- lotes concluídos;
- sincronizações.

Evitar pontos arbitrários, rankings, streaks e incentivos à velocidade insegura.

## 14. Fase 0 — Fundação

Documentação criada:
product thesis, architecture, UX, vision, gamification, brand, roadmap, project map, strategic fronts, design tokens, ORC integration contract e application foundation.

Código criado:
app/main.js, app/styles.css, index.html, core/entities, core/observations, core/orc, core/state, tests e package.json.

Primeiro fluxo executável:
IDENTIFICAR → OBSERVAÇÃO → ORC CLIENT → MATCH DETERMINÍSTICO → RESOLVED/CONFLICT/UNCERTAIN → ESTADO 3L0 → INTERFACE

**Fase 0: CONCLUÍDA.**

## 15. Auditoria ORC ↔ 3L0

A auditoria identificou lacunas que não poderiam ser perdidas:
- Assertion model completo;
- Relation model completo;
- Evidence store;
- resolution history/replay;
- ruleset/versionamento;
- ORC service real;
- temporal validity;
- ERP synchronization.

Foram incorporados ao produto:
- REJECTED_FOR_AUTOMATION;
- evidence/context nas observações;
- relations nas entidades;
- human confirmation;
- docs/orc-coverage.md.

Regra permanente:
source → observation → evidence/context → resolution → operational state

## 16. Onde estamos

ORC: pesquisa e implementação de referência estruturadas.

3L0: fundação executável concluída.

Produto: ainda não validado em campo.

Ainda não há evidência suficiente para declarar precisão final, economia, confiabilidade em escala, vantagem competitiva ou valor comercial definitivo.

## 17. Fase 1 — Vertical Slice

Próximo objetivo:
CÂMERA/BARCODE → OBSERVAÇÃO REAL → NORMALIZAÇÃO → ORC → RESOLUTION → RESOLVED/CONFLICT/UNCERTAIN → CONFIRMAÇÃO/EXCEÇÃO → ENTIDADE PERSISTENTE

Prioridades:
1. captura real;
2. barcode/EAN;
3. OCR;
4. observation pipeline;
5. ORC boundary real;
6. resolution UI;
7. exception UI;
8. human confirmation;
9. persistência;
10. testes com dados reais.

## 18. Fase 2 — Receiving MVP

Aplicar o vertical slice ao recebimento de mercadorias e integrar NF-e/XML, produto físico, identificadores, ERP e operador.

## 19. Fase 3 — Field Pilot

Testar em estabelecimento real.

Medir:
- tempo;
- entradas manuais;
- resolução automática;
- conflitos;
- correções;
- duplicidade;
- intervenção humana;
- falhas de sincronização;
- confiança operacional;
- custo por operação.

## 20. Fase 4 — Expansão operacional

Depois do recebimento:
estoque, venda, devolução, transferência, localização e histórico.

## 21. Fase 5 — Plataforma

Somente após evidência:
API, SDK, providers de visão, OCR intercambiável, múltiplos ERPs, regras versionadas, observabilidade, replay e auditoria.

## 22. Fase 6 — Escala e validação comercial

Avaliar implantação, custo, confiabilidade, segurança, governança, ROI, escalabilidade e disposição real de pagamento.

## 23. Registro de estado

| Marco | Estado |
|---|---|
| Problema operacional | CONCLUÍDO |
| ORC como pesquisa | CONCLUÍDO |
| Modelo conceitual | CONCLUÍDO / EM FALSIFICAÇÃO |
| Experimentos | CONCLUÍDOS |
| Minimal Computable Layer | HIPÓTESE DOCUMENTADA |
| Vision/OCR boundary | DEFINIDO |
| Separação ORC/Produto | CONCLUÍDA |
| 3L0 Vision | DEFINIDO |
| Brand | DEFINIDA |
| UX | DEFINIDA |
| Gamificação | DEFINIDA |
| Roadmap | DEFINIDO |
| Fase 0 | CONCLUÍDA |
| Núcleo executável | CONCLUÍDO |
| Auditoria ORC ↔ 3L0 | CONCLUÍDA |
| Fase 1 | ABERTA |
| Validação de campo | PENDENTE |
| Validação comercial | PENDENTE |

## 24. Regra para retomada

Ao retomar:
1. ler este diário;
2. ler docs/orc-coverage.md;
3. ler docs/roadmap.md;
4. verificar o estado atual do ORC;
5. não reabrir decisões sem nova evidência;
6. preferir determinismo quando suficiente;
7. preservar conflito e incerteza;
8. testar antes de ampliar;
9. atualizar o diário após decisões estruturais.

### Próximo checkpoint

**Fase 1 — Vertical Slice.**

O primeiro teste deve fazer um produto real passar por:
captura → Observation → ORC → resolução → estado → ação do operador.

O critério de avanço é funcionamento de ponta a ponta com dados reais, não quantidade de features.

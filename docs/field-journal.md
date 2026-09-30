# 3L0 Vision — Diário de Bordo

**Estado:** Fase 1 em execução · captura e resolução vertical iniciadas
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
1. captura real e recuperação de permissão;
2. barcode/EAN;
3. entrada manual como fallback;
4. observation pipeline com evidência/contexto;
5. ORC boundary real ou adapter explicitamente versionado;
6. matching determinístico contra catálogo persistente;
7. OCR como caminho secundário de observação;
8. resolution/exception UI;
9. confirmação humana somente quando necessária;
10. persistência de entidade, evidência e histórico;
11. testes ponta a ponta com entradas representativas.

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
| Fase 1 | PRONTA PARA INICIAR |
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

Guardrails já fixados: não fazer `imagem → produto`, não converter confiança de modelo em certeza operacional, não mapear erro técnico para incerteza semântica, não pedir confirmação quando ela não é necessária e não mostrar métricas sem eventos reais.

O primeiro teste deve fazer um produto real passar por:
captura → Observation → ORC → resolução → estado → ação do operador.

O critério de avanço é funcionamento de ponta a ponta com dados reais, não quantidade de features.

## 25. Início da Fase 1 — Captura real

A Fase 1 foi iniciada no repositório.

Primeiro incremento executável:
- câmera do navegador via getUserMedia;
- tentativa de leitura nativa de EAN/QR/Code 128 via BarcodeDetector;
- fallback explícito para entrada manual;
- BrowserCaptureAdapter separado da semântica do ORC;
- catálogo local persistido em localStorage;
- ResolutionPipeline conectando captura → Observation → normalização → candidatos → ORC → estado → persistência;
- interface de erro técnico separada de UNCERTAIN.

A primeira implementação não trata a imagem como identidade. O código capturado vira uma Observation e somente o ORC produz a resolução operacional.

### Estado do incremento

| Item | Estado |
|---|---|
| Pipeline de orquestração | CONCLUÍDO |
| Câmera real | IMPLEMENTADA |
| Barcode/EAN nativo | IMPLEMENTADO QUANDO SUPORTADO PELO NAVEGADOR |
| Fallback manual | CONCLUÍDO |
| Catálogo persistente local | CONCLUÍDO |
| ORC service real | PENDENTE |
| OCR secundário | PENDENTE |
| Confirmação humana | PENDENTE |
| Evidence/history persistente | PENDENTE |
| Teste físico em navegador/dispositivo | PENDENTE |

Próximo checkpoint: executar a aplicação em dispositivo com câmera, capturar um EAN real e verificar o ciclo completo até RESOLVED ou UNCERTAIN.

## 26. Camada de percepção — providers substituíveis

A pesquisa sobre tecnologias de visão foi convertida em uma fronteira arquitetural do produto.

Decisão:
- 3L0 possui uma camada de percepção independente do ORC.
- Providers produzem observações; não resolvem identidade operacional.
- Barcode/EAN/QR, OCR, detecção e pré-processamento entram como capacidades substituíveis.
- A implementação atual continua usando Browser BarcodeDetector na fatia vertical.
- ZXing-C++ foi registrado como candidato futuro para backend de barcode/WebAssembly.
- PaddleOCR foi registrado como candidato futuro para OCR.
- Foi criada a interface VisionProvider, a fábrica createVisionObservation, o adapter de barcode e o registry de providers.
- Testes semânticos foram adicionados para preservar proveniência, normalização e ausência de identidade automática.

Próximo checkpoint:
executar a suíte local e validar o fluxo físico da câmera em dispositivo real antes de adicionar dependências nativas ou OCR.

## 27. Consolidação — Fiscal Resolution Layer

A camada fiscal foi posicionada definitivamente **depois do ORC**.

Decisão arquitetural:

```
PHYSICAL / DOCUMENT / ERP
→ OBSERVATION
→ NORMALIZATION / CONTEXT
→ ORC RESOLUTION
→ RESOLVED ENTITY + OPERATIONAL CONTEXT
→ FISCAL RESOLUTION LAYER
→ FISCAL RESULT + LEGAL BASIS + SOURCE + VERSION
→ TAX CALCULATION / COMPLIANCE
→ NF-e / ERP / APURAÇÃO
```

### Responsabilidades

- ORC resolve entidade, relações, evidências, contexto e estado operacional.
- Fiscal Resolution determina tratamento fiscal sobre uma entidade/operação já resolvida.
- Tax Calculation calcula valores a partir do tratamento fiscal.
- Compliance/documentos cuidam da consequência fiscal operacional.

### Decisões fixadas

1. Fiscal não entra dentro do ORC.
2. Fiscal não entra no vertical slice de câmera da Fase 1.
3. NCM/NBS e CST/cClassTrib não podem criar identidade física silenciosamente.
4. Regras fiscais possuem versão, validade temporal, fonte e fundamento legal.
5. Resultado fiscal preserva proveniência e pode permanecer inconclusivo.
6. A infraestrutura oficial deve ser integrada quando adequada; o 3L0 não deve recriar toda a pilha normativa.
7. O boundary já existe no repositório em `core/fiscal/`, mas a execução começa no Receiving MVP.

### Estrutura reservada

```
core/fiscal/
├── context/
├── classification/
├── resolution/
├── rules/
├── sources/
└── contracts/
```

Foi criado `core/fiscal/README.md` como contrato arquitetural inicial. Nenhuma regra de cálculo foi adicionada à Fase 1.

A infraestrutura oficial brasileira já disponibiliza recursos para classificação, fundamentos legais, NCM/NBS, alíquotas e cálculo no ecossistema da Reforma Tributária do Consumo. Isso reforça a decisão de tratar o fiscal como uma camada de integração, versionamento e rastreabilidade, e não como um segundo núcleo normativo. 

### Próximo uso

No Receiving MVP, a sequência será:

`produto resolvido → contexto fiscal → classificação → resolução fiscal → cálculo/compliance → documento/ERP`.

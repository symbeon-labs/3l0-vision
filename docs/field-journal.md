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
| Fase 1 | EM ANDAMENTO |
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

A percepção e a orquestração inicial já existem; o vertical slice ainda não está fechado. Guardrails já fixados: não fazer `imagem → produto`, não converter confiança de modelo em certeza operacional, não mapear erro técnico para incerteza semântica, não pedir confirmação quando ela não é necessária e não mostrar métricas sem eventos reais.

O primeiro teste deve fazer um produto real passar por:
captura → Observation → ORC → resolução → estado → ação do operador.

O critério de avanço é funcionamento de ponta a ponta com dados reais, não quantidade de features.

## 25. Fase 1 — Captura real e percepção

A Fase 1 está em andamento no repositório.

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

Próximo checkpoint: validar fisicamente a câmera e depois substituir o resolver local pelo boundary ORC versionado. O ciclo físico completo ainda não está comprovado.

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

Próximo checkpoint: executar a suíte local e validar o fluxo físico da câmera em dispositivo real antes de adicionar dependências nativas ou OCR.

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


## 28. Pesquisa de mercado — Brasil 2026

Foi realizada uma primeira pesquisa competitiva ampla cobrindo WMS, ERP, smart warehousing, automação intralogística, visão computacional, barcode/GTIN, RFID/IoT, torres de controle e IA operacional.

A pesquisa identificou forte maturidade do mercado em sistemas de registro e execução. Também identificou players próximos do problema físico, especialmente Z3US.AI/Apolo e BoxCubo, além de players WMS que incorporam IA, como Senior e Opérun.

A conclusão não é que o 3L0 não possui concorrentes. A conclusão é que sua hipótese de diferenciação precisa permanecer arquitetural:

> 3L0 como camada independente de resolução operacional entre observações heterogêneas do mundo físico e sistemas empresariais.

O risco estratégico identificado é o movimento de WMS/ERP em direção a visão, agentes e automação. Portanto o 3L0 precisa provar que sua camada de resolução é independente de sensor, ERP, WMS e workflow e que pode ser reutilizada em múltiplas operações.

Documento-base:
docs/market-research-brazil-2026.md

Próximo trabalho de inteligência competitiva: aprofundar preços, APIs, cases, arquitetura técnica, hardware obrigatório, markerless, evidência/auditoria, LGPD, patentes, parceiros e barreiras de entrada.


## 29. Consolidação executiva — auditoria e correções pré-Antigravity

Em 01/10/2026, antes da transição do desenvolvimento para o Antigravity, foi realizada uma auditoria do repositório `symbeon-labs/3l0-vision`.

### Resultado executivo

A auditoria confirmou que a arquitetura atual é coerente com a fase do projeto e que a principal lacuna não é conceitual, mas de **validação de execução e fechamento de alguns contratos concretos**.

O produto não deve ser ampliado antes da validação física do vertical slice.

### Correções aplicadas no `main`

Foram corrigidas inconsistências concretas encontradas na auditoria:

1. O identificador de demonstração `789000001`, incompatível com o fluxo manual atual, foi substituído pelo EAN-13 válido `789000000004`.
2. `REJECTED_FOR_AUTOMATION` passou a possuir mapeamento explícito para o estado operacional `ATTENTION`.
3. Os testes de core, pipeline e providers de visão foram alinhados ao identificador corrigido.
4. Foi adicionado teste explícito para garantir que uma resolução não automatizável produza atenção operacional, sem ser tratada como erro técnico.
5. Nenhuma dessas correções alterou a tese, a arquitetura, o escopo da Fase 1 ou a separação 3L0 ↔ ORC.

Commits principais:

- `94e48a8b505232216746154c9a3158accb972da6`
- `a239bef383b6814a7775257e477a58a0c0b82fdd`
- `17cfd73ab24c8b467ef2fa62ff2baed5bdf858fd`
- `d75e5ffa6248523e234dd5dc0c3292825d968aa9`
- `d2b46bba6b37a670a818d39c95021b4fefef3006`

### O que a auditoria confirmou

- A fronteira 3L0 ↔ ORC está preservada.
- Observação não é identidade.
- Vision/OCR permanece como camada de percepção.
- Erro técnico permanece separado de incerteza semântica.
- O resolver determinístico é adequado como mecanismo local de referência da Fase 1.
- A estratégia de modelos permanece subordinada à resolução operacional.
- A camada fiscal permanece downstream do ORC.
- A documentação estratégica está à frente de algumas capacidades executáveis; isso é conhecido e deve ser tratado por validação, não por nova documentação especulativa.

### Pendências reais

Ainda não devem ser marcadas como concluídas:

- execução local de `npm test` no estado atual do `main`;
- teste físico da câmera em navegador/dispositivo real;
- serviço ORC real;
- Evidence Store;
- Resolution History/Replay;
- fluxo completo de confirmação humana na UI;
- integração OCR;
- persistência operacional além do caminho local atual;
- Receiving MVP;
- validação de campo.

### Regra executiva para a próxima etapa

O próximo trabalho não é adicionar mais arquitetura nem mais features.

É provar o seguinte ciclo com um produto físico real:

`CAPTURA → OBSERVAÇÃO → NORMALIZAÇÃO → ORC → RESOLUÇÃO → ESTADO → AÇÃO → PERSISTÊNCIA/EVIDÊNCIA`

O critério de avanço é evidência operacional.

### Handoff para Antigravity

O Antigravity deve partir do `main` atual e tratar este diário como registro de decisões já tomadas.

Não reabrir decisões arquiteturais sem nova evidência.

Ordem recomendada:

1. executar `npm test`;
2. corrigir falhas reais sem enfraquecer os invariantes semânticos;
3. testar câmera/barcode em dispositivo real;
4. registrar resultados e falhas observadas;
5. somente depois avançar para ORC real, evidência/histórico e OCR conforme necessidade comprovada.

A regra permanece:

> **Otimizar por evidência, não por quantidade de código.**


## 30. Consolidação — resolução + interoperabilidade

Em 01/10/2026, a visão do produto foi consolidada após a auditoria do repositório e a definição do aplicativo mínimo de validação.

### Decisão

A primeira prova permanece deliberadamente pequena:

`PRODUTO FÍSICO → OBSERVAÇÃO → NORMALIZAÇÃO → ORC → RESOLUÇÃO → ENTIDADE PERSISTENTE`

A interoperabilidade com o sistema já utilizado pela empresa não será antecipada para dentro da Fase 1. Ela passa a ser explicitamente a segunda prova do produto, dentro do Receiving MVP / Fase 2.

### Nova prova de produto

A Fase 2 deve provar:

`PRODUTO FÍSICO + DOCUMENTO + REPRESENTAÇÃO DO SISTEMA DA EMPRESA → ORC → ENTIDADE CANÔNICA 3L0 → MAPEAMENTO → REPRESENTAÇÃO DO SISTEMA-ALVO`

### Princípio fixado

`IDENTIFIER ≠ ENTITY ≠ SYSTEM RECORD`

EAN, SKU, registro ERP, NF-e, imagem, planilha ou captura de tela são representações/fontes distintas. O 3L0 não deve aprender o sistema da empresa como seu modelo interno.

O modelo canônico 3L0 permanece independente. A tradução para o sistema-alvo ocorre por contratos de mapping e adapters.

### Ordem de validação

1. capturar representações reais usadas pela empresa;
2. entender campos, tipos, obrigatoriedades, identificadores e dependências;
3. definir a representação canônica necessária ao caso;
4. resolver produto físico + documento + sistema;
5. gerar uma saída reviewável para o sistema-alvo;
6. validar o mapping com operador;
7. somente depois considerar escrita/importação/API ao sistema real.

### Guardrail

Não haverá integração live com ERP/WMS apenas para demonstrar integração. Primeiro deve existir evidência de que o mapping produz uma representação correta, rastreável e revisável.

### Artefato criado

`docs/interoperability.md` passa a registrar a fronteira de interoperabilidade, o conceito de representação canônica, target-system mapping e a ordem de validação.

### Estado

A arquitetura foi atualizada sem alterar o escopo da Fase 1.

O próximo checkpoint continua sendo a validação física do vertical slice. A Fase 2 agora possui um exit gate explícito de interoperabilidade.


# Continuidade de desenvolvimento — Gate A / 3L0 Glyph

**Data de consolidação:** 2026-10-21  
**Branch de trabalho:** `feat/glyph-gate-a-qr-observation`  
**Status:** protótipo de parsing/normalização presente na branch; integração completa de leitura e resolução ainda precisa de verificação local. A interface voltou a aparecer segundo confirmação do responsável; não confundir essa confirmação com validação de todos os cenários.

## 1. Objetivo do Gate A

Aceitar uma referência Glyph lida por QR como uma observação normalizada no 3L0 Vision, sem:
- tratar qualquer QR como Glyph;
- criar ou confirmar uma entidade apenas pela leitura;
- transformar falha técnica em `CONFLICT`;
- remover o fluxo markerless ou os identificadores existentes.

O Gate A é parsing, validação sintática e normalização de observação. **Não inclui** registry/lookup remoto, emissão de etiqueta, persistência durável, revogação, autenticação de etiqueta ou prova de autenticidade física.

## 2. Estado observado na branch

### Arquivos existentes
- `core/vision/glyph-reference.js`: implementa `parseGlyphReference` e `normalizeQrIdentifier`.
- `tests/glyph-reference.test.js`: cobre referência v1 válida, QR genérico, payload malformado, versão desconhecida e entrada não textual.
- `app/main.js`: importa `parseGlyphReference`; é necessário verificar o caminho de captura e o fluxo de resolução no código completo para confirmar que a função está realmente ligada ao evento da câmera.
- `app/capture/browser-capture.js`: detector do navegador inclui `qr_code`, mas a captura reportada continua emitindo `barcode_detected` genericamente. Confirmar a ligação no consumidor de eventos.
- `core/observations/observation.js`: permite identificadores com esquema e valor, sem atribuir identidade automaticamente.
- `core/pipeline/resolution-pipeline.js`: encaminha observações normalizadas ao repositório de candidatos e ao ORC.

### Contrato de referência implementado
Formato aceito no protótipo:
`3l0-glyph:v1:<ID>`

O identificador deve conter de 8 a 128 caracteres de `A-Z`, `a-z`, `0-9`, underscore ou hífen. O parser retorna `{ scheme: "3l0-glyph", value: ID, version: 1 }`.

Comportamento:
- payload fora do namespace Glyph: retorna `null` e pode continuar como QR genérico;
- namespace `3l0-glyph:` com formato malformado ou versão não suportada: lança erro explícito;
- tipo de entrada diferente de string: lança erro;
- a validação é sintática apenas; não consulta registry e não prova identidade/autenticidade.

Não colocar dados pessoais, preços, conteúdo fiscal ou segredos dentro do QR.

## 3. Incidente de deploy observado

Os logs Vercel compartilhados mostraram:
- clone do branch `feat/glyph-gate-a-qr-observation`, commit `ca4936c`;
- execução de `vercel build`;
- build concluído em aproximadamente 51 ms;
- deploy concluído;
- mensagem `Skipping cache upload because no files were prepared`.

A mensagem isolada sobre cache não comprova falha. Porém, um build tão curto, sem instalação/execução explícita de `vite build`, é compatível com Vercel não estar aplicando o comando de build esperado ou tratando a saída como estática sem gerar `dist`.

Configuração esperada para este repositório:
- Framework Preset: Vite (ou configuração equivalente);
- Build Command: `npm run build`;
- Output Directory: `dist`;
- Install Command: `npm install` (ou padrão compatível com lockfile presente);
- Root Directory: raiz do repositório, onde está o `package.json`.

O `package.json` define `build: vite build`, `dev: vite`, `preview: vite preview` e `test: node --test`. O `index.html` carrega `/app/main.js` como módulo. A confirmação mais recente do responsável é que a interface voltou a aparecer; a causa exata da falha inicial não deve ser afirmada sem comparar as configurações/deployments.

## 4. Checklist de validação local

Na raiz do repositório:

1. `npm install`
2. `npm test`
3. `npm run build`
4. `npm run preview`

Verificar:
- a página inicial renderiza;
- a navegação para captura funciona;
- se câmera/BarcodeDetector não estiver disponível, entrada manual continua acessível;
- QR comum continua sendo `qr`, não Glyph;
- `3l0-glyph:v1:<ID>` é reconhecido como identificador `3l0-glyph`;
- payload Glyph malformado/versão desconhecida gera erro controlado e não cai silenciosamente no matching genérico;
- EAN-13, EAN-8 e Code 128 continuam no fluxo existente;
- falhas de câmera, scanner ou consulta são erros técnicos, não `CONFLICT`;
- nenhum identificador cria uma entidade ou prova autenticidade por si só.

A execução desses comandos ainda precisa ser registrada com os resultados reais; este documento não afirma que testes ou build foram executados nesta sessão.

## 5. Próximas tarefas, em ordem

### A1 — fechar a integração de captura
- Revisar o `app/main.js` completo e garantir que evento QR passe por `normalizeQrIdentifier`/ `parseGlyphReference`.
- Manter códigos EAN/Code 128 com os esquemas atuais.
- Preservar contexto de captura e proveniência.
- Evitar disparar múltiplas resoluções pelo loop de câmera para o mesmo quadro/código.

### A2 — testes de integração
Adicionar testes para o caminho evento QR → observação → pipeline, incluindo:
- QR Glyph válido;
- QR comum;
- versão não suportada;
- referência inválida;
- nenhum resultado de lookup (quando lookup vier a existir);
- indisponibilidade técnica (quando lookup vier a existir).

### A3 — deploy e smoke test
- Confirmar Vercel Build Command `npm run build` e Output Directory `dist`.
- Confirmar URL do deployment/branch correto.
- Fazer smoke test da home e da captura em desktop e mobile.
- Registrar commit, URL, resultado e eventuais erros do navegador.

### A4 — parar no limite correto
Não implementar registry remoto ou emissão persistente como parte do Gate A. Isso pertence ao Gate B e requer decisões próprias de persistência, autorização, idempotência e ciclo de vida.

## 6. Arquitetura e invariantes

- QR/etiqueta é uma observação e uma referência, não a identidade canônica.
- Vision normaliza captura; ORC resolve semanticamente.
- `RESOLVED`, `UNCERTAIN` e `CONFLICT` permanecem resultados semânticos distintos.
- Erro de câmera, parsing, rede ou serviço permanece erro técnico.
- QR comum e identificação markerless continuam funcionando.
- Não alegar anti-clonagem, autenticidade física ou conformidade SCIC.
- O Caso 01 é hipótese de campo; economia e redução de tempo só podem ser alegadas após medição.

## 7. Contexto e artefatos

- ADR público: `docs/decisions/0005-physical-labels-are-optional-identification-accelerators.md`
- Parser: `core/vision/glyph-reference.js`
- Testes do parser: `tests/glyph-reference.test.js`
- Especificação privada Glyph: vault, `3l0-vision/research/3l0-glyph/3L0_Glyph_Especificacao_Identificacao_Fisica_v0.1.md`
- Contrato privado de integração: vault, `3l0-vision/research/3l0-glyph/3L0_Vision_Glyph_Integration_Contract_and_Code_Map_v0.1.md`
- Decisão do piloto Caso 01: vault, `3l0-vision/research/3l0-glyph/CASE-01_Glyph_Pilot_Decision_v0.2.md`

## Estado ao retomar

Começar conferindo a branch e o commit atual, revisar a integração real de `parseGlyphReference` na captura, executar testes e build, e registrar os resultados. Não começar Gate B até Gate A passar os critérios acima.

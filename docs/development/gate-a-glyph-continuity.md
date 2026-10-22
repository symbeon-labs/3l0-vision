# Continuidade de desenvolvimento — Gate A / 3L0 Glyph

**Data:** 2026-10-21  
**Branch:** `feat/glyph-gate-a-qr-observation`  
**Status:** implementação do protótipo e testes unitários presentes na branch; validação automatizada deve ser confirmada no CI antes do merge. O deploy visual relatado pelo responsável não equivale à validação técnica completa.

## 1. Escopo fechado do Gate A

O Gate A cobre somente leitura de QR, reconhecimento sintático de referência Glyph v1 e encaminhamento como identificador para o pipeline existente.

Formato de protótipo aceito:

`3l0-glyph:v1:<ID>`

O ID deve ter de 8 a 128 caracteres alfanuméricos, underscore ou hífen. O parser retorna `{ scheme: "3l0-glyph", value: ID, version: 1 }`.

- QR comum continua como identificador genérico `qr`.
- Payload com namespace `3l0-glyph:` mas formato inválido/versão não suportada gera erro controlado.
- A leitura Glyph é anotada no contexto como `validation: "syntax-only"`.
- O valor lido não cria identidade nem prova autenticidade física.
- A resolução continua sob responsabilidade do ORC e do repositório de candidatos.
- Falha de câmera/leitura é erro técnico; não deve ser representada como `CONFLICT`.
- Códigos EAN e Code 128 permanecem no fluxo existente.
- O QR é tratado como dado; a aplicação não abre URLs detectadas.

Fora do escopo: registry remoto, emissão/reimpressão/revogação, persistência durável, autenticação de etiquetas, anti-clonagem, blockchain e alegações de conformidade SCIC.

## 2. Implementação presente na branch

- `core/vision/glyph-reference.js`: parser estrito e normalização de referência.
- `tests/glyph-reference.test.js`: Glyph v1 válido, QR comum, payload malformado, versão não suportada e entrada não textual.
- `app/main.js`: liga leitura QR ao parser, encaminha o esquema `3l0-glyph` ou `qr` e inclui metadado de validação sintática.
- `app/capture/browser-capture.js`: detector do navegador para EAN-13, EAN-8, QR e Code 128.
- `.github/workflows/test.yml`: instala dependências, executa `npm test` e `npm run build` para pull requests contra `main`.
- `package.json`: scripts `dev`, `build`, `preview` e `test`, com Vite como dependência de desenvolvimento.

Também foi corrigida a detecção de identificadores numéricos na entrada manual para que o padrão de dígitos seja avaliado como dígitos, e não como a sequência literal `\\d`.

## 3. Validação técnica — critérios de aceite

O CI precisa confirmar, em execução real:

1. `npm install` conclui.
2. `npm test` passa com todos os testes.
3. `npm run build` gera a aplicação em `dist`.
4. Pull request apresenta status de CI aprovado.
5. Smoke test confirma home e navegação para captura no deployment correto.

Testes de comportamento necessários no smoke test:
- câmera indisponível deixa entrada manual utilizável;
- QR Glyph v1 válido entra no pipeline com esquema `3l0-glyph`;
- QR comum permanece `qr`;
- Glyph malformado ou versão não suportada mostra erro controlado;
- EAN-13, EAN-8 e Code 128 continuam reconhecidos;
- nenhuma leitura, sozinha, prova identidade ou autenticidade;
- resolução incerta não é persistida como resolução confirmada.

**Não registrar a validação como aprovada até que o CI e o smoke test forneçam resultados observáveis.** A compilação/deploy reportada anteriormente não substitui esses critérios.

## 4. Configuração Vercel

Configuração esperada na raiz do repositório:
- Framework Preset: Vite;
- Install Command: `npm install` (ou instalação compatível com lockfile);
- Build Command: `npm run build`;
- Output Directory: `dist`.

Os logs compartilhados anteriormente mostraram build/deploy concluídos em cerca de 51 ms e a mensagem `Skipping cache upload because no files were prepared`. Essa mensagem isolada não comprova falha, mas o tempo de build justificava verificar se o Vercel estava executando `vite build`. Não afirmar a causa exata sem inspecionar configuração e deployment.

## 5. Invariantes arquiteturais

- Captura/visão produz observações; ORC resolve semanticamente.
- QR/etiqueta é uma referência, não identidade canônica.
- Estados `RESOLVED`, `UNCERTAIN` e `CONFLICT` permanecem distintos.
- Erros técnicos não são resultados semânticos.
- O fluxo sem etiqueta continua permitido.
- O Caso 01 permanece hipótese de campo até ser medido; não alegar economia ou ganho de produtividade sem baseline e dados.

## 6. Próxima sequência

1. Abrir/usar o PR desta branch e aguardar CI.
2. Corrigir falhas encontradas pelo CI, sem ampliar escopo.
3. Fazer smoke test do deployment com QR de teste e códigos EAN/Code 128.
4. Registrar commit, resultado do CI e evidência do smoke test.
5. Somente então marcar Gate A como tecnicamente validado.
6. Não iniciar Gate B antes do aceite acima.

## 7. Referências internas

- ADR público: `docs/decisions/0005-physical-labels-are-optional-identification-accelerators.md`
- Parser: `core/vision/glyph-reference.js`
- Testes: `tests/glyph-reference.test.js`
- Especificação privada: vault, `3l0-vision/research/3l0-glyph/3L0_Glyph_Especificacao_Identificacao_Fisica_v0.1.md`
- Contrato privado: vault, `3l0-vision/research/3l0-glyph/3L0_Vision_Glyph_Integration_Contract_and_Code_Map_v0.1.md`
- Decisão de piloto: vault, `3l0-vision/research/3l0-glyph/CASE-01_Glyph_Pilot_Decision_v0.2.md`

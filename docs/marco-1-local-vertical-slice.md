# Marco 1 — Execução local do vertical slice físico

Status: preparado para execução local; não declarar validado até testar em dispositivo real.
Branch-base: `feat/gate-1-api-backend`
Baseline: `8622e196270f41a084de1936fd80fa626b0ce8f9`

## Objetivo

Demonstrar um fluxo real: câmera/leitor de código → identificador normalizado → API v1 → resultado semântico rastreável.

## O que já existe

- `app/capture/browser-capture.js`: solicita câmera traseira e usa `BarcodeDetector` se disponível.
- `app/main.js`: estados de câmera, entrada manual, inferência de esquema, chamada API-first e fallback controlado.
- `server/api.js`: `POST /api/v1/resolve` com catálogo sintético em memória.
- `vite.config.js`: proxy local `/api` → `127.0.0.1:8787`.
- Testes unitários/API, Playwright E2E e build aprovados na baseline.

## Passo A — preparar ambiente local

1. Criar branch de trabalho a partir da baseline; não trabalhar direto na branch de integração.
2. Confirmar versão Node compatível com o lockfile e o projeto.
3. Executar `npm ci` se houver lockfile versionado; caso não exista, não gerar um lockfile por suposição — revisar a política de dependências do repo e usar `npm install`.
4. Executar `npm test`, `npm run build` e `npm run test:e2e` antes de editar.
5. Terminal 1: `npm run api`.
6. Terminal 2: `npm run dev -- --host 0.0.0.0`.
7. Acessar pelo dispositivo na mesma rede local usando o endereço LAN da máquina. Para câmera, testar em contexto seguro: HTTPS ou localhost; não assumir que HTTP via IP LAN autoriza getUserMedia.

## Passo B — testar suporte nativo

O código atual depende de `BarcodeDetector` para leitura automática. Suporte varia por navegador e versão; não assumir que existe no Safari/iOS.

Testar e registrar:
- dispositivo, sistema operacional e versão do navegador;
- permissões concedidas/negadas;
- câmera traseira disponível/indisponível;
- `BarcodeDetector` disponível/indisponível;
- formatos reais testados: EAN-13, EAN-8, QR e Code 128;
- leitura sob baixa luz, reflexo, movimento e foco;
- comportamento ao navegar para fora da tela e parar a câmera;
- ausência de múltiplas resoluções disparadas para o mesmo código.

## Passo C — fallback de leitura

Se o navegador-alvo não oferecer `BarcodeDetector`, avaliar uma biblioteca client-side mantida (ex.: ZXing Browser) antes de implementar um leitor próprio.

Antes de adicionar:
- revisar licença, manutenção, tamanho do bundle e suporte a Safari/iOS;
- instalar em branch isolada e versionar lockfile gerado pela ferramenta local;
- encapsular leitura atrás de uma interface pequena, sem acoplar UI à biblioteca;
- evitar carregar duas bibliotecas de leitura ao mesmo tempo sem necessidade;
- manter entrada manual como fallback acessível.

Não implementar OCR neste marco.

## Passo D — normalização

Para cada leitura, manter:
- `value`: string literal lida, sem converter para número (zeros à esquerda importam);
- `scheme`: formato mapeado explicitamente (EAN, QR ou identificador genérico);
- `source`: câmera ou entrada manual;
- `capturedAt`: timestamp ISO local da observação;
- `format`: formato bruto retornado pelo leitor, quando disponível.

Não inferir identidade do produto a partir do formato do código. Não anexar imagens por padrão. Não registrar dados pessoais.

## Passo E — critérios de aceitação

- [ ] Câmera solicita permissão e tem controles claros de iniciar/parar.
- [ ] Permissão negada e dispositivo sem câmera deixam entrada manual utilizável.
- [ ] Leitura válida é exibida antes da submissão ou tem confirmação explícita, sem disparos duplicados.
- [ ] EAN de demonstração chega a `/api/v1/resolve` e retorna `RESOLVED`.
- [ ] Identificador desconhecido retorna `UNCERTAIN`.
- [ ] Conflito real de catálogo retorna `CONFLICT`, sem escolha arbitrária.
- [ ] Erro técnico não é apresentado como conflito semântico.
- [ ] Se API indisponível, fallback fica claramente rotulado.
- [ ] Testes unitários, E2E e build passam.
- [ ] Logs não contêm imagens nem dados sensíveis desnecessários.
- [ ] Evidência registra dispositivo/navegador, comandos, resultados e limitações.

## Saída exigida para revisão

1. Diff da branch local.
2. Versão da dependência adicionada e justificativa/licença.
3. Logs dos comandos de teste e build.
4. Matriz de resultados por dispositivo/navegador.
5. Captura de tela opcional sem dados sensíveis.
6. Lista de problemas conhecidos.

## Não fazer neste marco

- Não publicar serviço/API abertos.
- Não conectar ERP/WMS.
- Não implementar OCR, ORC remoto ou reconhecimento visual geral.
- Não afirmar produção ou validação de campo antes da evidência.
- Não mesclar nem fazer deploy automaticamente.

## Próximos marcos deixados engatilhados

- Marco 2: persistência e trilha de evidências.
- Marco 3: dataset e métricas de qualidade da resolução.
- Marco 4: contrato e integração ORC/provedores reais.
- Marco 5: segurança, staging e piloto controlado.

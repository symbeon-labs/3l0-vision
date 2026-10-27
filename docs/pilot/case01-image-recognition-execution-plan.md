# Caso 01 — Plano de execução para captura, OCR e resolução

**Data:** 2026-10-27  
**Estado:** plano de implementação; a primeira fatia de captura de imagem está em uma branch própria e ainda precisa de validação.

## Objetivo operacional

Transformar uma captura real em uma observação rastreável, extrair sinais com proveniência, resolver candidatos com ORC e preservar a revisão humana quando a evidência for insuficiente. A imagem, OCR ou modelo visual nunca devem confirmar identidade por conta própria.

## Estado técnico verificado no código

- A captura via `getUserMedia()` e a leitura de códigos com `BarcodeDetector` já existem em `app/capture/browser-capture.js`.
- A entrada manual e o pipeline `CAPTURE → OBSERVATION → NORMALIZATION → ORC → RESOLUTION → STATE` existem.
- O resolvedor atual é determinístico e consulta um catálogo local no browser.
- O parser Glyph valida sintaxe da referência QR, não autenticidade ou identidade física.
- OCR operacional, reconhecimento visual, catálogo multiusuário server-side e ligação do fluxo de captura à API autenticada ainda não estão demonstrados como disponíveis.

## Fatia 1 — Captura de imagem e prévia (em implementação)

- Capturar um quadro da câmera em JPEG.
- Mostrar prévia, dimensões, tamanho aproximado e hora da captura.
- Permitir repetir a captura.
- Não enviar a imagem a nenhum serviço nem armazená-la fora da sessão do navegador.
- Deixar explícito na interface que OCR/upload ainda não foi executado.

**Aceitação:** captura funciona em browser compatível com permissão de câmera; falhas têm mensagem compreensível; prévia é responsiva; câmera e URLs temporárias são limpas ao sair da tela; a leitura de código existente continua funcionando.

## Fatia 2 — Contrato de evidência de imagem

- Definir contrato versionado com `evidenceId`, origem, hora, MIME type, dimensões, hash de conteúdo, referência do blob e estado de processamento.
- Separar metadados de evidência do binário.
- Definir limite de tamanho, formatos aceitos, retenção e autorização antes de qualquer upload.
- Evitar guardar imagem/base64 em `localStorage` ou embutir binários em observações.

## Fatia 3 — OCR como adaptador substituível

- Definir interface `extractText(imageEvidence)` com campos, texto bruto, confiança disponibilizada, coordenadas quando suportadas, versão do mecanismo e erros.
- Usar imagem real do Caso 01 para benchmark antes de escolher fornecedor/modelo.
- Extrair apenas campos úteis ao cenário (ex.: EAN/SKU, descrição, unidade, lote/validade quando aplicável).
- Preservar origem de cada campo; OCR é sinal, não verdade confirmada.
- Cobrir imagem borrada, baixa iluminação, texto parcial, duplicidade e ausência de texto.

## Fatia 4 — ORC e revisão humana

- Converter identificadores e campos extraídos em observação canônica.
- Consultar candidatos no catálogo autorizado.
- Emitir `RESOLVED`, `UNCERTAIN` ou `CONFLICT` segundo regras explícitas e testáveis.
- Exibir evidências que justificam o resultado e permitir correção/confirmação humana.
- Não converter score de OCR ou similaridade visual diretamente em estado confirmado.

## Fatia 5 — Persistência e integração operacional

- Integrar com API autenticada e workspace após validação da fundação de workspace.
- Autorizar no servidor cada leitura/escrita; não confiar em `tenantId` do cliente.
- Persistir metadados de evidência, hashes, resultado, ator e decisões; binário em storage protegido.
- Só depois conectar uma resolução revisada a movimento de inventário, inicialmente como `NEEDS_REVIEW`.
- Testar isolamento entre workspaces, revogação e acesso negado.

## Fatia 6 — Avaliação do Caso 01

Montar conjunto de imagens representativo com rótulos de referência aprovados pelo responsável do caso. Medir separadamente:
- taxa de captura utilizável;
- exatidão dos campos OCR por campo;
- top-1/top-k de candidatos e frequência de `UNCERTAIN`/`CONFLICT`;
- taxa de correção humana;
- tempo por etapa e falhas técnicas;
- número de falsos positivos perigosos (identidade incorreta indevidamente resolvida).

Não definir limiares universais antes de medir o Caso 01. Nunca otimizar apenas para a taxa de resolução automática.

## Ordem de execução recomendada

1. Validar a captura de imagem e prévia em dispositivos reais.
2. Formalizar o contrato de evidência e uma política de privacidade/retention mínima.
3. Comparar mecanismos OCR com amostra real do Caso 01.
4. Integrar o OCR por adaptador e testes com fixtures anonimizadas.
5. Integrar os campos ao ORC com revisão humana e resultados explicáveis.
6. Integrar API/workspace e persistência protegida.
7. Ligar a saída revisada ao inventário com estado inicial de revisão.
8. Medir resultados e documentar limitações antes de ampliar para reconhecimento visual.

## Limites de segurança e privacidade

- Não usar dados reais de clientes em catálogo local de demonstração.
- Não enviar imagens a serviços externos sem decisão explícita, base legal/consentimento aplicável, aviso e controles.
- Não armazenar imagens em localStorage.
- Remover objetos temporários e encerrar a câmera quando a tela for abandonada.
- Tratar imagens de documentos como potencialmente sensíveis e coletar somente o necessário.

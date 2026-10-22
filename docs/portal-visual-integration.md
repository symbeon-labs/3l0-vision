# Integração visual — 3L0 Portal → 3L0 Vision

**Data:** 21/10/2026  
**Status:** aplicada em branch de integração; pendente de revisão visual, testes e merge.

## Objetivo

Alinhar a interface operacional do 3L0 Vision à linguagem institucional do 3L0 Portal sem transformar a aplicação em uma cópia da landing page e sem alterar os contratos funcionais do fluxo.

## Fonte visual

A referência é a página pública do repositório `symbeon-labs/3l0-portal`, especialmente `index.html`. A integração preserva a identidade operacional documentada em `docs/brand.md`, `docs/brand-board.md` e `docs/design-tokens.md`.

## Elementos alinhados

- Fundo azul-marinho quase preto com gradientes discretos.
- Superfícies em camadas, bordas estruturais finas e cartões arredondados.
- Inter para interface e JetBrains Mono para códigos, estados e metadados.
- Ciano para captura/observação; verde para resolução; âmbar para atenção; vermelho para conflito.
- Botões, campos, estados de foco e cartões com contraste e hierarquia consistentes.
- Layout responsivo para desktop e mobile, incluindo formulário de entrada, resultado e tela de câmera.
- Respeito a `prefers-reduced-motion` e foco visível por teclado.

## Limites da mudança

Esta é uma integração visual em CSS. Não altera o pipeline de resolução, os contratos de observação, o catálogo, a validação sintática Glyph nem a fronteira de integração ORC. A aparência não implica que funções experimentais tenham sido validadas em campo.

## Validação necessária antes do merge

1. Executar os testes existentes do repositório.
2. Verificar a página inicial, câmera, entrada manual, processamento, resultados `RESOLVED`, `UNCERTAIN` e `CONFLICT`.
3. Conferir desktop e mobile, teclado/foco e preferência por movimento reduzido.
4. Confirmar que a configuração de build/deploy da interface produz os artefatos esperados.
5. Só então mesclar e confirmar o deploy real pela URL publicada.

## Fonte e implementação

- Referência institucional: `symbeon-labs/3l0-portal/index.html`.
- Regras de marca: `docs/brand.md`.
- Board de marca: `docs/brand-board.md`.
- Semântica dos tokens: `docs/design-tokens.md`.
- Implementação desta integração: `app/styles.css`.

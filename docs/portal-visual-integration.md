# Integração visual — 3L0 Portal → 3L0 Vision

**Estado do documento:** diretriz de alinhamento evolutiva.  
**Escopo:** identidade e experiência pública; não altera contratos funcionais nem comprova publicação.

## Objetivo

Manter uma identidade reconhecível entre o Portal institucional e a aplicação Vision, preservando a função de cada superfície:

- **Portal:** apresenta a tese, o contexto operacional, os cenários de aplicação e o estado de maturidade.
- **Vision:** conduz a tarefa operacional e mostra evidências, estados, incertezas e próximas ações.
- **Repositórios:** preservam especificações, decisões, implementação e evidências de validação.

O Portal não deve virar uma cópia da aplicação; a aplicação não deve parecer uma landing page de marketing.

## Fontes de verdade

- Identidade e voz: [`docs/brand.md`](./brand.md).
- Direção visual: [`docs/brand-board.md`](./brand-board.md).
- Semântica de tokens: [`docs/design-tokens.md`](./design-tokens.md).
- Evolução conjunta da marca e do Portal: [`docs/brand-evolution-v1.md`](./brand-evolution-v1.md).
- Implementação institucional: repositório `symbeon-labs/3l0-portal`, arquivo `index.html`.
- Implementação visual operacional: `app/styles.css`.

## Elementos compartilhados

- Fundo quase preto/azul-marinho, superfícies em camadas e divisores discretos.
- Inter para texto de interface e JetBrains Mono para identificadores, códigos e metadados.
- Ciano para observação/captura; verde para resolução confirmada; âmbar para atenção; vermelho para conflito não resolvido.
- Contraste legível, hierarquia tipográfica clara, foco visível e controles com affordance explícita.
- Layout responsivo, sem depender de hover para ações essenciais.
- Movimento com função; respeitar `prefers-reduced-motion`.
- Marca segmentada 3L0 usada com consistência, sem transformar o zero em ornamento sem significado.

## Diferenças intencionais

| Portal institucional | Aplicação Vision |
|---|---|
| Explica a tese e o valor operacional | Prioriza a tarefa em andamento |
| Mostra cenários possíveis com limites explícitos | Mostra apenas estados e ações existentes no fluxo |
| Pode usar composições editoriais e demonstrações conceituais identificadas | Deve diferenciar dados reais, sintéticos, exemplos e resultados experimentais |
| CTA leva ao ambiente experimental, sem prometer acesso | A interface deve comunicar autenticação, disponibilidade e erros reais |
| Linguagem orientada a contexto e compreensão | Linguagem curta, operacional e acionável |

## Regras editoriais e de produto

1. Não anunciar como disponível uma função que está apenas desenhada, planejada ou em integração.
2. Não confundir extração de texto com validação fiscal, correspondência com identidade física ou build com segurança operacional.
3. Não afirmar integração ERP/WMS, persistência compartilhada, precisão, economia ou uso em campo sem evidência específica.
4. Quando uma demonstração for conceitual ou usar dados sintéticos, identificá-la de modo visível.
5. Explicitar incerteza e conflito; nunca colorir um resultado como resolvido sem base no estado real.
6. Não publicar detalhes proprietários, segredos, dados sensíveis ou conteúdo privado de pesquisa no Portal.

## Checklist de validação

- [ ] Logotipo, símbolo, tipografia e cores seguem as fontes de verdade.
- [ ] A hierarquia funciona em desktop e dispositivos móveis.
- [ ] Links, navegação por teclado e foco visível funcionam.
- [ ] Contraste e legibilidade foram conferidos.
- [ ] Movimento reduzido é respeitado.
- [ ] A demonstração está rotulada como conceitual quando não executa processamento real.
- [ ] Alegações públicas correspondem ao estado comprovado do produto.
- [ ] Testes visuais foram executados e registrados; se não foram, permanecem explicitamente pendentes.
- [ ] Deploy publicado foi confirmado separadamente da revisão de código.

## Limites

Este documento orienta a coerência visual e editorial. Não altera pipeline de resolução, contratos de observação, catálogo, validação Glyph, fronteira de integração ORC, autenticação ou autorização. Aparência consistente não comprova que capacidades experimentais foram validadas em campo.

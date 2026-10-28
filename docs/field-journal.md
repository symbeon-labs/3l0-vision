# 3L0 Vision — Diário público de estado

**Atualizado:** 2026-10-21  
**Estado:** Fase 1 em andamento; validação física e de campo pendentes.

Este arquivo é um resumo público de progresso. O diário de pesquisa completo e os registros operacionais internos foram preservados no vault privado.

## Objetivo do produto

3L0 Vision investiga como relacionar observações físicas, identificadores, documentos e representações de sistemas operacionais sem transformar inferências em fatos automaticamente.

Fluxo de referência:

`CAPTURA → OBSERVAÇÃO → NORMALIZAÇÃO → RESOLUÇÃO → ESTADO OPERACIONAL`

O produto preserva origem, contexto, evidência, conflito e incerteza. A hipótese de valor é reduzir trabalho manual de reconciliação, mas essa hipótese ainda precisa ser medida em campo.

## Estado técnico verificado

- A fundação em JavaScript contém contratos de observação, entidades, estados, providers, um pipeline injetável e um resolver determinístico local.
- O catálogo atual usa armazenamento local do navegador e contém dado de demonstração; não é persistência multiusuário.
- A fronteira ORC remota/versionada ainda não está implementada como serviço comprovado.
- OCR integrado, UI de exceções, histórico persistente de evidências e validação física continuam pendentes.
- A câmera e o leitor de códigos dependem de suporte do navegador/dispositivo; implementação não equivale a validação física.

## Testes

Foi adicionado um workflow do GitHub Actions para executar `npm test`.

- Primeiro run: falhou por erro de sintaxe em `core/pipeline/resolution-pipeline.js`.
- Correção aplicada no commit `8a3ae5d1d470a83e2b7daf05a9252bb10213f828`.
- Run seguinte: **12 testes passaram, 0 falharam**.

Resultado do CI: [Tests — GitHub Actions](https://github.com/symbeon-labs/3l0-vision/actions/runs/39581929637).

A suíte confirma apenas os cenários automatizados atuais. Ela não comprova reconhecimento em ambiente físico, confiabilidade em escala, integração com ERP ou retorno comercial.

## Próximos marcos

1. Acrescentar testes de contrato para erros técnicos, estados semânticos e idempotência.
2. Validar captura/barcode em dispositivos e condições reais.
3. Definir a fronteira versionada do ORC antes de afirmar integração de serviço.
4. Persistir evidências e histórico com proveniência.
5. Executar o fluxo ponta a ponta com itens e dados autorizados.
6. Medir tempo, entradas manuais, conflitos, correções e intervenção humana.

## Caso de referência

O Caso 01 público foi minimizado para remover detalhes comerciais específicos. Ele documenta uma hipótese de origem, não um cliente validado nem evidência de sucesso.

## Princípios permanentes

- Observação não é identidade.
- Confiança de modelo não é certeza operacional.
- Conflito e incerteza não devem ser escondidos.
- Erro técnico não deve ser convertido em incerteza semântica.
- Não declarar métricas sem denominador e eventos reais.
- Avançar por evidência e testes, não pela quantidade de funcionalidades.

## Fonte restrita

O diário completo permanece preservado no vault privado, junto aos registros de pesquisa que não são necessários à documentação pública do produto.

## 2026-10-21 — Reconciliação da visão do produto

- Criado `docs/product-vision.md` como síntese canônica da tese, experiência do operador, fronteira ORC, fluxo inicial de recebimento, evolução fiscal, hipótese de diferenciação, estado de implementação e critérios de validação.
- O `README.md` agora aponta para essa visão canônica.
- Os documentos especializados continuam sendo as fontes detalhadas para arquitetura, roadmap, interoperabilidade, pesquisa de mercado e regras fiscais; a síntese não os substitui.
- A apresentação HTML interativa permanece um artefato de trabalho local para reconciliação visual. Ainda não foi publicada no repositório nem no portal.
- Próxima etapa: revisar a apresentação contra a visão canônica e produzir uma versão institucional pública reduzida, após verificar conteúdo e claims públicos.
- Esta alteração está em uma branch de documentação e ainda não foi mesclada em `main`.


## 2026-10-21 — Superfície pública preparada para revisão

- Criado rascunho institucional `docs/public-brief-draft.md`, derivado da visão canônica e sem métricas de desempenho ou alegações de prontidão não comprovadas.
- Criada a primeira página `index.html` no repositório público `symbeon-labs/3l0-portal`, na branch `feat/public-vision-landing`, para revisão via PR #1.
- A página distingue a fundação técnica experimental das capacidades ainda em validação ou planejadas.
- Removido o link direto para o repositório privado de visão na página pública, evitando oferecer ao público um destino inacessível e não intencional.
- PR #1 do portal e PR #2 deste repositório continuam sujeitos a revisão final; não afirmar publicação ou implantação até merge e confirmação do destino de deploy.

## 2026-10-28 — Correções de resolução autoritativa e guarda de recebimento

- A interface principal agora chama `POST /api/v1/resolve`; o cálculo e a gravação da execução passam pelo backend autenticado, em vez de enviar ao backend um resultado calculado no navegador.
- O endpoint de persistência genérica `POST /api/resolution-runs` foi desativado para impedir que resultados arbitrários fornecidos pelo cliente sejam registrados como decisões do motor. A leitura do histórico permanece disponível.
- O resolvedor agora falha de forma fechada para operações `receive_goods` sem contexto de recebimento e exige revisão explícita.
- A API versionada aceita a operação `receive_goods` e constrói a lista de candidatos a partir do catálogo de demonstração do servidor, ignorando listas de candidatos fornecidas pelo cliente.
- Foram adicionados testes de regressão para ausência de contexto, divergência de identificador, quantidade, unidade, embalagem, falha técnica, ausência de candidatos e caminho de identificação comum.
- Limitação mantida: o catálogo do endpoint continua sendo sintético e em memória. Isso melhora a integridade do fluxo, mas não prova integração com catálogo empresarial nem validação física/OCR ponta a ponta.
- Esta alteração precisa passar pela suíte automatizada e pelo build do CI antes de ser considerada validada. Testes de isolamento no Supabase real e testes físicos continuam pendentes.

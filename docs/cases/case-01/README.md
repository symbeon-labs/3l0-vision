# Caso 01 — Origem operacional do 3L0

## Status

**Mapeamento operacional concluído.**  
**Validação de campo: pendente.**

## Por que este caso existe

O Caso 01 registra a operação real que motivou a investigação que levou à criação do 3L0.

O estabelecimento é um pequeno comércio de bebidas e alimentação, com operação de compra, recebimento, armazenamento, venda e controle fiscal/financeiro. O caso foi escolhido como primeiro campo de investigação porque combina uma operação real, problemas observáveis de reconciliação e abertura do responsável para experimentar uma solução de inovação.

O objetivo deste artefato não é apresentar o estabelecimento como cliente validado nem transformar suas características em requisito universal do produto.

O objetivo é preservar a trilha:

`operação real → problema observado → mapeamento → hipótese → experimento → evidência`

## O que foi descoberto

As informações necessárias à operação estão distribuídas entre diferentes fontes: sistema de vendas/caixa, documentos fiscais, pagamentos, fornecedores, contabilidade e controles auxiliares.

A mesma realidade operacional precisa ser conferida em múltiplas representações:

- mercadoria física;
- descrição, marca, embalagem e unidade;
- código cadastrado;
- nota fiscal;
- estoque;
- venda;
- caixa e pagamentos;
- controles fiscais/contábeis;
- planilhas ou controles paralelos.

O mapeamento registra digitação/transcrição manual, dupla conferência e retrabalho. Quando existe divergência, a operação precisa retornar aos registros anteriores para localizar sua origem.

## Relação com a tese do 3L0

O caso fornece uma manifestação concreta do problema que o 3L0 investiga:

> **A realidade operacional existe em múltiplas representações, mas o trabalho de reconciliá-las ainda recai sobre pessoas e controles paralelos.**

Isso conecta diretamente com a tese de:

`OBSERVAÇÃO → NORMALIZAÇÃO → RESOLUÇÃO → REPRESENTAÇÃO OPERACIONAL`

e, posteriormente:

`ENTIDADE CANÔNICA 3L0 → MAPEAMENTO → REPRESENTAÇÃO DO SISTEMA-ALVO`

## O que este caso ainda não prova

Este caso **não** prova:

- precisão de reconhecimento;
- economia mensurada;
- confiabilidade em escala;
- vantagem competitiva;
- valor comercial definitivo;
- capacidade de integração com qualquer ERP;
- automação completa da operação.

Essas afirmações dependem de experimentos e validações posteriores.

## Próximo experimento

O próximo passo é transformar o mapeamento em um experimento controlado:

1. selecionar produtos representativos;
2. capturar suas representações reais;
3. testar a resolução física;
4. capturar as representações utilizadas pelo sistema da empresa;
5. definir o mapping para a representação canônica 3L0;
6. gerar saída reviewável;
7. medir trabalho manual, divergências, intervenções e tempo;
8. somente depois considerar integração live.

## Artefatos

- [Mapeamento operacional preenchido](operational-mapping.md)
- [Interoperabilidade e Mapping](../../interoperability.md)
- [Product Thesis](../../product-thesis.md)
- [Field Journal](../../field-journal.md)
- [Roadmap](../../roadmap.md)

## Princípio

O Caso 01 é **evidência de origem**, não evidência de sucesso.

O valor do caso está em permitir que a hipótese do 3L0 seja confrontada com uma operação real.

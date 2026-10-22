# Fase 2 — Receiving MVP: diário de execução

**Branch:** `feat/glyph-gate-a-qr-observation`  
**Status:** fundação de contratos iniciada; fluxo end-to-end não concluído.  
**Regra:** somente marcar como implementado o que existe no código e foi testado.

## Objetivo

Reconciliar observação física, declaração documental e representação do sistema empresarial; produzir uma representação canônica e uma saída revisável para um destino específico.

## Implementado nesta tranche

- `core/receiving/document-declaration.js`: converte um item já extraído por adaptador documental em observação 3L0, preservando referência de origem e tratando valores como declarações do documento.
- `core/interoperability/target-mapping.js`: contrato de mapping versionado; permite caminhos de origem/destino, transformações explícitas limitadas, proveniência por campo e saída revisável.
- O mapping bloqueia estados diferentes de `RESOLVED`, não inventa campos obrigatórios e nunca executa escrita live.

## Ainda não implementado

- Parser de XML bruto da NF-e e validação de estrutura/assinatura;
- upload/ingestão de arquivo na interface;
- captura/consulta real de dados ERP/WMS;
- repositório persistente de entidade canônica;
- matching conjunto documento + produto + ERP através do ORC real;
- reconciliação de quantidade recebida;
- UI de recebimento e fila de exceções;
- exportação JSON/CSV/XLSX real;
- adaptador de integração live;
- validação de campo com estabelecimento.

## Próxima sequência

1. Executar a suíte Node.js e corrigir falhas.
2. Selecionar um formato de exportação autorizado do ERP-alvo, sem dados sensíveis desnecessários.
3. Implementar parser de NF-e XML com biblioteca mantida e testes com fixtures sintéticas.
4. Definir a entidade canônica mínima e o schema do mapping com versionamento.
5. Construir o fluxo revisável e registrar decisões, proveniência e exceções.
6. Medir o fluxo contra o baseline manual antes de considerar escrita automática.

## Guardrails

- NF-e representa declaração, não prova da mercadoria recebida.
- Identificador ≠ entidade canônica ≠ registro ERP.
- Quantidade declarada ≠ quantidade física conferida.
- NCM e demais classificações fiscais não estabelecem identidade.
- Estado incerto/conflitante não pode gerar exportação como resultado resolvido.
- Erro técnico permanece distinto de conflito semântico.
- Não usar dados reais do estabelecimento sem autorização apropriada.

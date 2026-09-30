# 3L0 Vision — Tax Research Register

**Research date:** 30/09/2026  
**Status:** active, source-controlled research  
**Jurisdiction:** Brazil  
**Primary domain:** Reforma Tributária do Consumo

## Normative baseline

The Receita Federal legislation index identifies these principal milestones:

- Emenda Constitucional nº 132/2023
- Lei Complementar nº 214/2025 — IBS, CBS and Imposto Seletivo
- Lei Complementar nº 227/2026 — CGIBS and IBS administrative process
- Decreto nº 12.955/2026 — CBS regulation
- Resolução CGIBS nº 6/2026 — IBS regulation referenced by official implementation material

Official source: Receita Federal, Legislação da Reforma Tributária do Consumo.

## 2026 implementation layer

The implementation layer includes:

- Ato Conjunto RFB/CGIBS nº 1/2025
- Ato Conjunto RFB/CGIBS nº 4/2026
- Atos Técnicos Conjuntos RFB/CGIBS
- official technical tables and documents from the Portal da NF-e
- official implementation guidance from RFB and CGIBS
- official Siscomex/RFB guidance for imports

The 2026 calendar and technical artifacts are being updated during implementation. Source revision is therefore a first-class dependency.

## Fiscal classification

Official material identifies the importance of:

- NCM for goods
- NBS for services/intangibles
- CST-IBS/CBS
- cClassTrib
- calculation base
- rate type
- reductions
- regime
- legal basis

The 3L0 tax layer must not infer treatment from product name alone.

## Official tables

The Portal da NF-e publishes official versioned tables including:

- Tabela de Classificação Tributária do IBS e CBS (cClassTrib)
- Tabela de Código de Crédito Presumido do IBS e CBS (cCredPres)
- Tabela de Alíquotas da CBS
- NCM and other fiscal/document tables

These are versioned data dependencies, not permanent application constants.

## Operational distinction

The ruleset needs explicit fields for:

- effective date
- obligation date
- publication date
- source retrieval date
- ruleset version
- calculation regime/status

## Importation

Official Siscomex/RFB material demonstrates that fiscal classification behavior can vary by document workflow and implementation release. The ruleset must therefore not assume that every fiscal document accepts the same input fields.

## Research policy

For every future rule:

1. identify the legal authority;
2. capture the exact legal provision;
3. identify the technical table/version;
4. define effective temporal scope;
5. define required classification and context;
6. encode deterministic conditions;
7. preserve source/version provenance;
8. test representative cases;
9. flag unresolved interpretation for human review.

## Research constraint

This register deliberately does not publish a universal tax rate, NCM classification or tax treatment for an arbitrary product. Those are contextual outputs requiring authoritative evidence.

# 3L0 Vision — Tax Ruleset Architecture

**Status:** foundation defined; implementation intentionally deferred  
**Scope:** Brazilian consumption-tax rules as a versioned ruleset domain

## Purpose

The tax layer makes fiscal interpretation traceable, versioned and reproducible.

It must not turn a model into an authority or embed unstable tax logic directly in camera, catalog or UI.

**Principle:** the system resolves facts and context; the ruleset determines applicable fiscal treatment; evidence records why.

## Boundary

3L0 captures and resolves operational inputs. ORC resolves entities, assertions, evidence and context. The tax ruleset evaluates an already-resolved fiscal question against versioned normative material.

PHYSICAL / DOCUMENT / ERP → OBSERVATION → ORC RESOLUTION → RESOLVED ENTITY + CONTEXT → TAX CLASSIFICATION / CONTEXT → VERSIONED TAX RULESET → FISCAL RESULT → LEGAL BASIS + SOURCE + VERSION

Tax rules are downstream of identity resolution. A tax rule must never silently establish product identity.

## First domain

The first supported domain is the Brazilian Reforma Tributária do Consumo:

- IBS
- CBS
- Imposto Seletivo (IS)
- CST-IBS/CBS
- cClassTrib
- cCredPres where applicable
- NCM for goods
- NBS for services/intangibles
- applicable rates
- reductions
- differentiated/specific regimes
- operation and jurisdiction context
- temporal validity
- legal basis
- fiscal-document requirements
- calculation metadata

This does not imply that IBS/CBS replace every other tax immediately.

## Rule identity

A rule is not just a percentage. A rule record should contain:

- rule_id
- tax_domain
- jurisdiction
- valid_from / valid_until
- priority
- conditions
- classification
- rate_policy
- calculation_policy
- legal_basis
- source_reference
- source_version
- status

Example contract shape:

    {
      "rule_id": "br-rtc-example",
      "tax_domain": "IBS_CBS",
      "jurisdiction": {"country": "BR"},
      "valid_from": "2027-01-01",
      "conditions": {
        "classification": {"cClassTrib": "..."},
        "operation_type": "...",
        "regime": "..."
      },
      "rate_policy": {"type": "reference_or_configured"},
      "legal_basis": [{"norm": "LC 214/2025", "article": "..."}],
      "source_reference": {
        "authority": "RFB/CGIBS",
        "artifact": "...",
        "version": "..."
      }
    }

The example is a contract shape, not a valid tax rule.

## Classification is first-class input

Fiscal evaluation may require combinations of NCM/NBS, CST/cClassTrib, calculation base, operation, jurisdiction, regime, specific recipient/provider context and date.

A classification code is not the complete fiscal answer.

## Source hierarchy

For normative decisions use:

1. Constitution / constitutional amendments
2. Complementary and ordinary laws
3. Regulations/decrees
4. Resolutions and normative acts of competent authorities
5. Joint acts
6. Technical acts, technical notes and official tables
7. Official manuals and implementation guidance
8. Secondary sources only for discovery/context

Every executable rule retains its normative basis and source artifact.

## Temporal semantics

Never evaluate a fiscal question without an effective-date context when the rule can change.

At minimum retain:

- fact_date
- rule_valid_from
- rule_valid_until
- published_at
- retrieved_at

Observation time is not automatically fiscal validity time.

## Tax resolution statuses

Reuse ORC semantic discipline:

- RESOLVED
- CONFLICT
- UNCERTAIN
- INCOMPLETE
- REQUIRES_VERIFICATION
- REJECTED_FOR_AUTOMATION

Technical retrieval/execution failures remain technical errors.

## Evidence

A fiscal result must be reproducible from input facts, classification, context, rule version, normative source and calculation parameters.

Retain source authority, artifact identifier, publication/update date, retrieval date, source/table version, legal provision, input classification, context, ruleset version, engine version and calculation trace.

Store references to authoritative material rather than copying large legal texts.

## 2026 transition

The system must distinguish fiscal treatment for a fact date, document-field obligations, informative/test calculation, actual payment/recollection and future effective treatment.

Do not hard-code a timeless “2026 tax rate”.

## Non-goals

This is not a generic tax chatbot, autonomous legal-opinion engine, accountant/tax-lawyer replacement, hard-coded percentage table, OCR classifier or substitute for official authorities.

## Implementation order

1. Source registry and provenance contract.
2. Versioned fiscal classification snapshots.
3. Fiscal context model.
4. Rule evaluation contract.
5. Deterministic rule engine.
6. Calculation trace.
7. Human verification workflow.
8. Official-source update/reconciliation process.
9. Broader tax-domain automation.

## Current decision

Do not implement tax calculations inside the Phase 1 camera vertical slice. Establish the boundary now so the receiving workflow can consume it later without redefining ORC semantics.

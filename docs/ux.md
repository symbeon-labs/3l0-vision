# UX

## Core interaction

The operator should experience resolution, not data entry.

### Current foundation shell

```
3L0

O que vamos resolver?

[ IDENTIFICAR ]
```

The Phase 0 shell intentionally exposes only the executable foundation loop. Unavailable workflows are not shown as disabled controls.

### Phase 1 target flow

```
INÍCIO
  ↓
CAPTURA
  ↓
OBSERVAÇÃO
  ↓
PROCESSAMENTO
  ↓
RESOLUÇÃO
  ├─ RESOLVIDO
  ├─ ATENÇÃO
  └─ CONFLITO
        ↓
CONFIRMAÇÃO (somente quando necessária)
        ↓
ESTADO OPERACIONAL
        ↓
AÇÃO
        ↓
EVIDÊNCIA / HISTÓRICO
        ↓
PRÓXIMO ITEM
```

History and operational progress are parallel product layers; they are not extra steps the operator must complete for every item.

### Capture

```
IDENTIFICAR

[ camera ]

Aponte para o produto

[ inserir código ]
```

Phase 1 must make both paths real: camera/barcode first, with manual code entry as fallback.

### Processing

```
CAPTURANDO ✓
ENTENDENDO ✓
CONFERINDO …
RESOLVENDO …
```

Each stage must correspond to a real pipeline event or state. Do not simulate progress with arbitrary delays in the Phase 1 flow.

### Resolved

When the resolution is sufficiently supported by deterministic or authoritative evidence:

```
✓ PRODUTO IDENTIFICADO

Produto X
500 ml

Identidade ✓
Descrição ✓
Unidade ✓
EAN ✓

[ CONTINUAR ]
```

Do not ask for confirmation merely because a result exists.

### Confirmation required

Use confirmation only when the resolution contract says human verification is required:

```
CONFIRMAÇÃO NECESSÁRIA

Produto X
500 ml

[ CONFIRMAR ]
[ CORRIGIR ]
```

### Exception

```
AINDA FALTA UMA INFORMAÇÃO

Produto X
500 ml

✓ Identidade
✓ Descrição
✓ Unidade
? Preço de venda

[ INFORMAR ]
[ DEIXAR PARA DEPOIS ]
```

### Ambiguity

```
IDENTIFICAÇÃO INCERTA

Encontramos 2 possibilidades.

○ Produto X — 500 ml
○ Produto X — 1 L

[ CONFIRMAR ]
```

## UX rules

1. Ask only for information that cannot be safely resolved.
2. Show why a value was resolved when that matters.
3. Distinguish observation, inference and confirmed state.
4. Never hide conflicts.
5. Preserve the path from evidence to operational state.
6. Optimize for exception handling, not form completion.
7. Never reward unsafe speed.
8. Never present a technical failure as semantic uncertainty.
9. Never present model confidence as operational certainty.
10. Do not expose a workflow control before that workflow is executable.

## Operational feedback

Progress should communicate useful work without pretending that a percentage exists:

```
17 produtos processados
12 resolvidos automaticamente
4 confirmados
1 em revisão
```

A percentage may be shown only when its denominator and definition are real and stable.

The interface should avoid childish gamification, leaderboards and arbitrary points.

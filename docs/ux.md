# UX

## Core interaction

The operator should experience resolution, not data entry.

### Home

```
3L0

O que vamos resolver?

[ IDENTIFICAR ]

[ ENTRADA ] [ ESTOQUE ]

[ HISTÓRICO ]
```

### Capture

```
IDENTIFICAR

[ camera ]

Aponte para o produto

[ inserir código ]
```

### Processing

```
CAPTURANDO ✓
ENTENDENDO ✓
CONFERINDO …
RESOLVENDO …
```

### Resolved

```
✓ PRODUTO IDENTIFICADO

Produto X
500 ml

Identidade ✓
Descrição ✓
Unidade ✓
EAN ✓

[ CONFIRMAR ]
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

## Operational feedback

Progress should communicate useful work:

17 produtos processados
12 resolvidos automaticamente
4 confirmados
1 pendente

The interface should avoid childish gamification, leaderboards and arbitrary points.

# Operational Progress

Gamification exists to visualize operational progress, not to manufacture engagement.

The product does not need game mechanics. It needs a trustworthy representation of work completed, work avoided and work requiring intervention.

## Reinforce

- successful resolution;
- correct human confirmation;
- completed batches;
- reduced unresolved items;
- successful synchronization;
- useful exception handling;
- reduced rework.

## Avoid

- leaderboards;
- arbitrary points;
- streak pressure;
- punitive scores;
- rewards for unsafe speed;
- metrics that incentivize false confirmations;
- percentages without a stable denominator.

## Operational dashboard

The canonical progress vocabulary is:

```
47 processados
41 resolvidos automaticamente
4 confirmados
2 em revisão
```

When available, add quality and rework indicators:

```
3 conflitos
1 correção
0 duplicidades
1 falha de sincronização
```

Automation rate is a diagnostic metric, not the goal by itself. It must be interpreted together with false resolution, correction, conflict, duplicate and downstream failure signals.

## Primary product metric

> **Trabalho operacional eliminado por operação resolvida com sucesso.**

Activity volume is secondary to resolution quality and useful work avoided.

## Phase 1 rule

Do not build a gamification system in Phase 1.

Build the event/state vocabulary that will later support trustworthy operational progress:

- processed;
- resolved automatically;
- confirmed;
- attention;
- conflict;
- corrected;
- rejected;
- rework;
- duplicate;
- synchronization failure.

The interface should expose only metrics backed by real events.

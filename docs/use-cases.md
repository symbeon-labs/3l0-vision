# 3L0 Vision — Casos de Uso

Este documento registra os principais domínios operacionais em que o núcleo de resolução do 3L0 pode ser aplicado.

Os casos de uso não representam produtos independentes. São diferentes instâncias do mesmo mecanismo:

`OBSERVAÇÃO → NORMALIZAÇÃO → RESOLUÇÃO → CONTEXTO → ESTADO → AÇÃO/EXCEÇÃO → EVIDÊNCIA`

## 1. Recebimento de mercadorias

`mercadoria + código/documento → identificação → conferência → divergência → decisão`

Aplicação inicial do vertical slice. O sistema resolve o produto físico em relação ao recebimento e aos dados disponíveis.

## 2. Inventário

`observação física → identificação → localização → quantidade → estado do estoque`

Confronta o que foi observado com o estado registrado.

## 3. Transferência interna

`origem → item → quantidade → destino → confirmação`

Resolve a identidade do item e registra a movimentação entre locais.

## 4. Expedição / Separação

`pedido → itens esperados → observação física → resolução → confirmação`

Conecta pedido, item e pacote antes da saída.

## 5. Last-mile / Entrega

`pedido → encomenda → observação → resolução → rota/destinatário → evento → evidência`

Possível aplicação em operações de coleta, recebimento, expedição e entrega. Pode reduzir etapas manuais de identificação, conferência e associação entre encomenda e pedido.

Exemplos de resolução:

- encomenda ↔ pedido;
- pacote ↔ rota;
- pacote ↔ destinatário;
- observação ↔ evento operacional;
- evidência de entrega ↔ operação registrada;
- divergência entre o físico e o esperado.

O 3L0 não precisa substituir o aplicativo operacional existente. Pode atuar como camada de resolução consumida por esse tipo de sistema.

## 6. Devoluções

`item devolvido → identificação → pedido/origem → motivo → estado`

Resolve a relação entre o item físico, sua origem e o estado operacional da devolução.

## 7. Auditoria operacional

`observação → entidade → contexto → evento → evidência → histórico`

Cria uma representação rastreável do que foi observado e de como uma decisão operacional foi produzida.

## 8. Controle de estoque

`estado registrado ↔ estado observado`

Mantém a diferença entre o estado esperado e o estado efetivamente observado como informação operacional.

## 9. Conferência documental

`documento ↔ ERP ↔ entidade física ↔ operador`

Relaciona dados documentais, sistemas corporativos e observações físicas.

## 10. Fiscal / tributário

`produto + contexto operacional → classificação + regra + vigência + fundamento legal → resultado fiscal`

Camada downstream da resolução operacional. A classificação fiscal não estabelece, por si só, a identidade física do produto.

## 11. Controle de ativos

`objeto observado → identidade → localização → responsável → estado → histórico`

Aplicável a equipamentos, ferramentas, dispositivos e outros ativos operacionais.

## 12. Manutenção / Inspeção

`ativo → observação → condição → contexto → decisão`

Relaciona uma observação do ativo com seu estado e com a decisão operacional correspondente.

## 13. Compliance / Rastreabilidade

`o que foi observado + entidade resolvida + decisão + evidência`

Preserva a cadeia necessária para explicar uma operação sem transformar inferência em fato.

## Princípio de expansão

Novos casos de uso devem ser avaliados pelo mesmo núcleo de resolução, e não pela criação de uma nova arquitetura para cada domínio.

A expansão deve seguir:

`observação → resolução → contexto → estado → ação → evidência`

O **Last-mile / Entrega** é um caso de uso potencial adicional identificado a partir de uma operação logística real. Ele deve ser investigado como possível Caso 02 somente após a validação do vertical slice do Caso 01.

## Limites

Os casos de uso acima não significam que todos serão implementados simultaneamente.

A prioridade permanece:

1. provar um fluxo físico real;
2. medir a resolução;
3. validar exceções e evidências;
4. extrair o padrão reutilizável;
5. expandir para novos domínios quando houver evidência operacional.

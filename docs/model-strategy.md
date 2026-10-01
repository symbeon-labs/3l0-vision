# 3L0 Vision — Estratégia de Modelos

## Objetivo

Definir como diferentes classes de modelos de IA podem participar do 3L0 sem transformar o produto em um sistema dependente de um único modelo ou fornecedor.

O 3L0 deve tratar modelos como componentes especializados dentro de uma cadeia de observação, interpretação e decisão.

A arquitetura preserva a seguinte fronteira:

`modelo → observação / inferência / decisão → contexto → ORC → resolução operacional`

Um modelo não estabelece automaticamente verdade operacional.

---

## Princípio central

**O 3L0 não é uma IA específica. É uma infraestrutura de resolução que pode utilizar diferentes formas de inteligência.**

Modelos podem interpretar sinais, extrair informações, produzir hipóteses ou apoiar decisões delimitadas.

A resolução operacional continua sendo contextual, rastreável e baseada em evidências.

---

## Taxonomia de inteligência

O 3L0 separa **função** de **implementação**. “Modelo local” descreve onde/como um modelo é executado; não é uma classe funcional equivalente a visão, LLM ou decision model. Um mesmo modelo pode ser local ou remoto e cumprir funções diferentes.

A taxonomia funcional adotada é:

1. **Perception Models** — observam o mundo e produzem sinais visuais, espaciais ou sensoriais.
2. **Extraction Models** — extraem estrutura de imagens, documentos, áudio ou outros sinais.
3. **Reasoning / Generative Models** — interpretam linguagem e contexto, sintetizam informação e produzem hipóteses.
4. **Decision Models / System One** — avaliam estados contra perguntas ou espaços de decisão delimitados e produzem decisões estruturadas/probabilidades.
5. **Operational Resolution Layer (ORC)** — não é um modelo de IA; resolve entidades, relações, evidências, contexto e estado operacional.

### 1. Perception Models — visão computacional

Responsabilidade:

- detectar objetos;
- reconhecer produtos;
- identificar características visuais;
- localizar códigos e regiões relevantes;
- produzir observações visuais;
- apoiar identificação sem marcador.

Exemplos de entradas:

`imagem → detecções + atributos + confiança + evidência`

A saída deve permanecer uma **observação**, não uma identidade definitiva.

Ver também:

- `docs/vision.md`
- `docs/architecture.md`

---

### 2. Extraction Models — OCR e modelos documentais

Responsabilidade:

- extrair texto;
- interpretar documentos;
- localizar campos;
- relacionar texto a regiões da imagem;
- transformar documentos não estruturados em observações normalizáveis.

Exemplos:

`NF-e/documento → texto + campos + localização + confiança`

Quando existir uma fonte estruturada e autoritativa, a extração visual deve ser tratada como evidência complementar.

---

### 3. Reasoning / Generative Models — multimodais

Responsabilidade:

- combinar imagem e linguagem;
- interpretar contexto visual;
- gerar atributos ou hipóteses quando sinais determinísticos não forem suficientes;
- apoiar casos de identificação sem marcador.

Fluxo possível:

`imagem + texto/contexto → observações semânticas → resolução`

Modelos multimodais devem ser usados de forma delimitada. Uma resposta textual plausível não deve ser convertida automaticamente em identidade operacional.

---

### 4. LLMs generativos

LLMs são uma implementação importante da classe de modelos de raciocínio/generação, mas não representam toda essa classe.

Responsabilidade potencial:

- interpretação de linguagem;
- extração semântica;
- transformação de documentos;
- classificação textual;
- síntese de contexto;
- explicação de resultados;
- assistência ao operador;
- raciocínio sobre informações já disponíveis.

LLMs são especialmente úteis quando o problema contém linguagem aberta ou informação não estruturada.

Não devem ser utilizados como fonte implícita de verdade para:

- identidade física;
- dados cadastrais autoritativos;
- regras fiscais;
- estado operacional definitivo;
- decisões irreversíveis sem política explícita.

Quando um LLM produzir uma hipótese, ela deve carregar sua origem e permanecer distinguível de um fato resolvido.

---

### 5. Execução local / edge

“Local / edge” é uma propriedade de implantação que pode ser aplicada a diferentes classes de modelo.

Responsabilidade potencial:

- inferência offline;
- baixa latência;
- processamento próximo ao dispositivo;
- redução de dependência de APIs externas;
- proteção de dados sensíveis;
- operação em ambientes com conectividade limitada.

Critérios para priorizar modelos locais:

- necessidade de offline;
- latência operacional;
- volume elevado de inferências;
- custo de chamadas externas;
- requisitos de privacidade;
- estabilidade de fornecedor.

Modelos locais não são automaticamente melhores. Devem ser escolhidos quando seus custos e capacidades forem adequados ao workflow.

---

### 6. Decision Models / System One

Decision models representam uma categoria diferente de inteligência.

Em vez de gerar texto aberto, o modelo recebe um estado e responde a perguntas ou decisões delimitadas.

Exemplo conceitual:

`estado operacional → pergunta tipada → decisão/probabilidade`

Possíveis aplicações:

- triagem de exceções;
- classificação operacional;
- seleção entre ações previamente definidas;
- estimativa de necessidade de confirmação;
- priorização de casos.

### Jev

Jev deve ser tratado nesta arquitetura como um **decision model**, e não como um LLM conversacional.

A investigação sobre Jev deve avaliar:

- qualidade das decisões;
- calibração;
- custo;
- latência;
- estabilidade;
- comportamento fora da distribuição;
- correlação de erros;
- adequação a decisões operacionais delimitadas;
- necessidade de fallback;
- capacidade de execução local ou remota.

A presença de Jev na estratégia não significa que ele seja obrigatório ou que seu desempenho já esteja validado para o 3L0.

---

## Função → saída → ORC

A arquitetura deve preservar a diferença entre tipos de saída:

| Saída do modelo | Semântica no 3L0 |
|---|---|
| Texto extraído | observação |
| Bounding box | evidência/observação |
| EAN detectado | observação/identificador candidato |
| Produto visual sugerido | hipótese |
| Atributo inferido | inferência |
| Classificação textual | inferência |
| Decisão delimitada | decisão de modelo |
| Confirmação do operador | ação humana |
| Entidade resolvida pelo ORC | representação operacional resolvida |

A mesma informação pode ter pesos diferentes dependendo da fonte, contexto e política.

---

## Confiança não é certeza

O 3L0 deve preservar pelo menos três conceitos distintos:

### Confiança do modelo

`P(modelo | entrada)`

Indica quão confiante o modelo está em sua própria saída.

### Evidência

Material que sustenta ou contradiz uma hipótese:

- imagem;
- código;
- OCR;
- XML;
- ERP;
- histórico;
- operador;
- sensor.

### Certeza operacional

Resultado da resolução considerando múltiplas evidências, contexto, regras e políticas.

Portanto:

**model confidence ≠ operational certainty**

---

## Seleção de modelos

A escolha do modelo deve ser orientada pelo workflow, não pela popularidade do modelo.

Critérios:

| Critério | Pergunta |
|---|---|
| Qualidade | Resolve o sinal necessário? |
| Latência | Cabe no tempo operacional? |
| Custo | É sustentável no volume esperado? |
| Privacidade | O dado pode sair do ambiente? |
| Offline | O fluxo precisa funcionar sem rede? |
| Determinismo | O resultado precisa ser altamente estável? |
| Observabilidade | Conseguimos registrar a saída e a origem? |
| Reversibilidade | Um erro pode ser corrigido sem dano? |
| Integração | A saída possui contrato estruturado? |
| Fallback | Existe caminho seguro quando o modelo falha? |

---

## Composição e cascata de inteligência

Sempre que possível, o 3L0 deve preferir uma cascata de menor custo e maior determinismo antes de modelos mais complexos.

Exemplo:

`identificador determinístico`

↓

`OCR / extraction`

↓

`matching conhecido`

↓

`perception / vision`

↓

`matching conhecido`

↓

`reasoning / generative model, quando necessário`

↓

`decision model, quando a decisão for delimitada`

↓

`ORC resolution`

↓

`confirmação humana`

> A cascata não implica que o decision model venha depois do ORC. O modelo pode apoiar a resolução; o ORC continua responsável por combinar esse resultado com evidências, contexto e política.

↓

`confirmação humana`

Essa ordem não é rígida. O workflow pode alterar a sequência quando houver evidência de que outra composição é superior.

O princípio é:

**usar a inteligência necessária, e não a inteligência máxima disponível.**

---

## Provider independence

O 3L0 não deve depender de:

- um único fornecedor de visão;
- um único LLM;
- um único modelo local;
- um único decision model.

Cada provider deve ficar atrás de uma interface estável.

Conceitualmente:

`Provider → Adapter → Model Output Contract → Observation/Decision → ORC`

Isso permite trocar:

- modelo;
- fornecedor;
- infraestrutura;
- localização da inferência;
- versão;

sem alterar o núcleo semântico do sistema.

---

## Versionamento e proveniência

Toda saída relevante de modelo deve poder registrar:

- provider;
- modelo;
- versão;
- timestamp;
- tipo de entrada;
- contexto relevante;
- parâmetros relevantes quando necessários;
- resultado;
- confiança/probabilidade quando disponível;
- referência à evidência;
- versão do contrato.

Isso permite:

- auditoria;
- comparação entre modelos;
- reprodução;
- análise de regressão;
- investigação de falhas;
- troca de provider.

---

## Fallback e degradação

O sistema deve assumir que modelos podem:

- falhar;
- ficar indisponíveis;
- retornar baixa confiança;
- produzir resultados conflitantes;
- sofrer mudança de comportamento após atualização.

O fallback deve privilegiar:

1. fonte determinística;
2. outra fonte independente;
3. modelo alternativo;
4. confirmação humana;
5. estado explicitamente não resolvido.

O sistema não deve preencher uma lacuna de evidência com uma invenção silenciosa.

---

## Relação com o ORC

O ORC permanece responsável pela resolução semântica e operacional.

Modelos fornecem observações, extrações, inferências ou decisões delimitadas para essa resolução. O ORC não deve ser confundido com uma quinta classe de modelo: ele é a camada que resolve o conjunto de evidências e contexto.

```
Mundo físico / documentos / sistemas
                ↓
        observações
                ↓
       modelos especializados
                ↓
     inferências / decisões
                ↓
          contexto
                ↓
              ORC
                ↓
     resolução operacional
                ↓
       estado / ação / evidência
```

O ORC não deve ser transformado em um wrapper de LLM.

Da mesma forma, o 3L0 não deve transformar um modelo em autoridade operacional.

---

## Aplicação aos casos de uso

A estratégia deve permanecer reutilizável entre domínios.

### Recebimento

Visão/OCR → identificação → ORC → produto/NF-e/ERP → conferência.

### Inventário

Visão/barcode → item/localização/quantidade → ORC → estado do estoque.

### Expedição

Barcode/visão → pedido/item/pacote → ORC → confirmação.

### Last-mile / Entrega

Visão/OCR/barcode → encomenda/pedido/rota/destinatário → ORC → evento operacional.

### Devolução

Visão/documento → item/origem/pedido/estado → ORC → decisão.

O modelo utilizado pode mudar. O núcleo de resolução não.

---

## Guardrails

Não utilizar modelo para:

- criar identidade definitiva sem evidência suficiente;
- substituir fonte autoritativa;
- ocultar conflito;
- transformar probabilidade em certeza;
- inventar campos ausentes;
- executar ações irreversíveis sem política;
- estabelecer regra fiscal por inferência;
- mascarar falha técnica como resultado semântico.

---

## Roadmap de pesquisa

### Agora

- manter interfaces independentes de provider;
- validar observações reais;
- medir qualidade e latência;
- registrar proveniência;
- testar cascatas simples.

### Próxima etapa

- comparar modelos de visão;
- avaliar modelos locais;
- avaliar multimodalidade;
- testar LLMs em tarefas delimitadas;
- investigar decision models, incluindo Jev;
- definir métricas por workflow.

### Posteriormente

- roteamento dinâmico entre modelos;
- seleção por custo/latência/qualidade;
- aprendizado com histórico operacional;
- avaliação contínua de regressão;
- execução híbrida cloud/edge;
- políticas de fallback por operação.

---

## Síntese

A estratégia de modelos do 3L0 não busca encontrar **o melhor modelo**.

Busca construir **a melhor composição de inteligências para cada operação**, preservando:

- independência de provider;
- evidência;
- contexto;
- incerteza explícita;
- proveniência;
- reversibilidade;
- resolução pelo ORC.

**Percepção observa.  
Extração estrutura.  
Modelos generativos interpretam.  
Decision models decidem dentro de limites.  
Evidências sustentam.  
O ORC resolve.  
O sistema registra.**

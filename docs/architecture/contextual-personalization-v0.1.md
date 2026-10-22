# 3L0 Vision — Arquitetura de Contexto e Personalização v0.1

- **Estado:** proposta arquitetural para revisão; não representa funcionalidade implementada.
- **Produto canônico:** 3L0 Vision.
- **Escopo:** triagem adaptativa, perfil de usuário/organização, contexto operacional e configuração personalizada da experiência.
- **Princípio:** Contexto → Perfil → Configuração → Execução → Evidência → Adaptação.

## 1. Resumo

O 3L0 Vision deverá usar informações fornecidas voluntariamente, contexto operacional autorizado e evidências de uso para configurar uma experiência adequada ao objetivo de cada usuário ou organização.

A triagem não será apenas um formulário de cadastro. Será a entrada de um processo controlado que transforma necessidades e restrições em uma configuração verificável da experiência. A personalização poderá influenciar a orientação da interface, a seleção de fluxos disponíveis, os campos apresentados, os critérios de avaliação e as recomendações.

A personalização não cria capacidades inexistentes, não concede permissões e não transforma inferências em fatos verificados.

## 2. Objetivos

1. Compreender o tipo de usuário, o contexto organizacional e o objetivo operacional prioritário.
2. Adaptar perguntas e onboarding conforme as respostas anteriores.
3. Produzir um perfil e um contexto estruturados, versionados e auditáveis.
4. Selecionar somente fluxos e capacidades realmente disponíveis e autorizados.
5. Definir critérios observáveis para avaliar experimentos e pilotos.
6. Aprender com resultados e feedback sem aplicar generalizações injustificadas.
7. Apoiar validação de produto e mercado, distinguindo interesse declarado, uso observado e disposição real para pagar.

## 3. Não objetivos da v0.1

- Não criar um microsserviço independente de personalização.
- Não implementar cobrança, planos comerciais ou marketplace.
- Não inferir atributos sensíveis ou elaborar perfis psicológicos.
- Não usar um LLM como única autoridade para permissões ou seleção de capacidades.
- Não prometer integração empresarial que ainda não esteja implementada e validada.
- Não tratar respostas declaradas como evidência independente.
- Não modificar automaticamente políticas, permissões ou fluxos críticos com base em um único resultado.
- Não duplicar no Vision responsabilidades semânticas próprias do ORC ou responsabilidades de orquestração do Agent.

## 4. Modelo conceitual

O sistema mantém três objetos distintos:

### 4.1 Perfil relativamente estável

Representa informações de atualização pouco frequente, por exemplo:
- tipo de participante;
- organização e setor, quando aplicável;
- papel do usuário na organização;
- estrutura de equipe/unidades, quando necessária;
- ferramentas e sistemas declarados;
- preferências de experiência.

O perfil deve registrar origem, data de atualização e estado de validação das informações.

### 4.2 Contexto operacional

Representa a situação delimitada para uma sessão, tarefa ou experimento:
- objetivo atual;
- processo a ser avaliado;
- entradas e fontes autorizadas;
- restrições aplicáveis;
- capacidades candidatas;
- critérios de sucesso;
- estado atual do fluxo.

Um contexto é delimitado e não deve ser automaticamente generalizado para todos os processos da organização.

### 4.3 Histórico de execução e evidências

Registra eventos relevantes:
- experimento iniciado e concluído;
- configuração utilizada e sua versão;
- resultados, exceções e falhas;
- correções e confirmações humanas;
- feedback explícito;
- origem e nível de verificação das informações.

O histórico deve separar telemetria técnica, dados operacionais do cliente e feedback comercial, com controles de acesso e retenção apropriados.

## 5. Fluxo lógico

```text
PORTAL PÚBLICO
  → escolha de jornada / solicitação de acesso
  → autenticação no 3L0 Vision
  → autorização e contexto da organização
  → triagem adaptativa
  → normalização do perfil e contexto
  → verificação de completude e restrições
  → seleção de configuração por regras explícitas
  → validação contra catálogo de capacidades disponíveis
  → apresentação/confirmacão da configuração quando necessário
  → execução de experimento
  → resultado + evidência + feedback
  → revisão do contexto e melhoria controlada
```

O portal é uma porta de entrada pública e não a fonte de verdade técnica. O Vision é responsável pela experiência operacional e pela configuração aplicada à sessão.

## 6. Dimensões de triagem

A triagem deve ser progressiva: perguntar somente o necessário para escolher o próximo passo.

1. **Participante e organização:** individual, profissional, empresa ou organização; setor e estrutura somente quando relevantes.
2. **Objetivo:** resultado prioritário que o participante quer alcançar.
3. **Processo atual:** como a tarefa é realizada e quais dificuldades foram observadas.
4. **Ambiente tecnológico:** ferramentas, formatos de dados e sistemas envolvidos.
5. **Restrições:** prazo, orçamento aproximado quando pertinente, requisitos de segurança, revisão humana e limites técnicos.
6. **Critérios de sucesso:** como o participante avaliará o resultado; métricas podem ser estimadas ou medidas.
7. **Preferências de experiência:** guiada ou avançada, explicações, idioma e nível de detalhe.

As respostas são dados fornecidos pelo usuário, salvo validação independente documentada. Campos opcionais devem ser claramente identificados. A triagem não deve bloquear a exploração básica quando dados não essenciais estiverem ausentes.

## 7. Contrato de dados conceitual

O exemplo abaixo é ilustrativo e ainda não é um schema de produção:

```json
{
  "schema_version": "0.1",
  "profile": {
    "participant_type": "company",
    "sector": "retail",
    "role": "operations",
    "preferences": {
      "experience_mode": "guided",
      "show_explanations": true
    }
  },
  "operational_context": {
    "objective": "product_identification",
    "current_process": "manual",
    "systems": ["spreadsheet"],
    "constraints": [],
    "success_criteria": []
  },
  "provenance": {
    "source": "user_declared",
    "captured_at": "ISO-8601 timestamp",
    "validated": false
  },
  "configuration": {
    "workflow_id": "product-identification",
    "workflow_version": "versioned-id",
    "requires_human_confirmation": true
  }
}
```

Requisitos para o contrato definitivo:
- validação de esquema e versão;
- identificadores estáveis para usuário, organização, contexto e experimento;
- proveniência por campo ou grupo de campos;
- timestamps e histórico de alterações;
- separação entre declaração, estimativa, observação e verificação;
- nenhuma credencial ou segredo dentro do perfil;
- minimização de dados pessoais.

## 8. Motor de personalização (CPE)

**Contextual Personalization Engine (CPE)** é o nome provisório do módulo lógico responsável por transformar perfil e contexto em configuração de experiência.

### Entradas
- perfil e preferências autorizadas;
- contexto operacional da sessão;
- catálogo versionado de fluxos/capacidades;
- políticas e permissões efetivas;
- evidências e feedback que possam ser reutilizados legitimamente.

### Processo
1. Validar esquema, origem e atualidade dos dados.
2. Identificar campos ausentes que realmente impedem a próxima etapa.
3. Aplicar regras explícitas e versionadas.
4. Filtrar capacidades indisponíveis, não autorizadas ou incompatíveis com restrições.
5. Produzir configuração explicável, com razões e versão das regras.
6. Solicitar confirmação humana quando a política ou o risco exigir.
7. Registrar a configuração efetivamente utilizada no experimento.

### Saída
Uma configuração versionada que pode determinar:
- fluxo inicial;
- modo de orientação;
- campos e instruções relevantes;
- critérios de avaliação;
- capacidades candidatas autorizadas;
- necessidade de confirmação;
- explicações sobre a recomendação.

A IA poderá auxiliar na interpretação de respostas não estruturadas e na elaboração de explicações. Não poderá sobrepor regras de autorização, habilitar capacidades inexistentes ou decidir sozinha sobre ações externas de alto impacto.

## 9. Limites entre componentes

- **3L0 Portal:** comunicação pública, descoberta e encaminhamento para acesso. Não é a fonte da verdade técnica.
- **3L0 Vision:** triagem, UX, perfil operacional necessário ao produto, contexto de sessão, catálogo de fluxos, configuração de experiência, execução e apresentação de resultados.
- **3L0 Agent:** coordenação de tarefas e composição de capacidades quando a integração real estiver disponível. Não é autoridade de identidade nem substitui controles de acesso.
- **ORC:** resolução semântica de entidades, evidências, contexto, incerteza e conflito nos fluxos aplicáveis. O CPE não deve duplicar a semântica do ORC.
- **3L0 Core Vault:** contexto estratégico e decisões internas protegidas; não é dependência de runtime para perfis de clientes.
- **Adaptadores externos:** integração com sistemas de clientes somente após contratos, autorização, validação e tratamento de falhas apropriados.

A autorização efetiva deve ser aplicada em uma camada confiável de acesso/servidor. A configuração de personalização pode restringir a experiência, mas nunca ampliar permissões.

## 10. Identidade, segurança e governança

Requisitos de arquitetura:
- autenticação e autorização separadas;
- isolamento entre organizações (tenant isolation);
- acesso mínimo necessário e verificação no servidor;
- consentimento ou outra base legal apropriada para os tratamentos aplicáveis;
- transparência de finalidade e coleta;
- capacidade de revisar/corrigir dados de perfil;
- políticas de retenção e exclusão definidas;
- proteção de dados operacionais e pessoais;
- registro de alterações relevantes e decisões de configuração;
- prevenção de vazamento de dados entre organizações;
- separação entre dados de teste sintéticos e dados reais de clientes;
- avaliação de obrigações da LGPD antes de coletar ou processar dados pessoais.

Dados de uma organização não podem ser utilizados para personalizar a experiência de outra organização sem base, finalidade e controles explicitamente aprovados.

## 11. Aprendizado e adaptação

A v0.1 deve começar com regras explícitas, determinísticas e testáveis. A adaptação a partir de resultados deve seguir estes princípios:
- registrar qual configuração produziu cada resultado;
- distinguir correlação de causalidade;
- não generalizar a partir de uma execução isolada;
- permitir revisão e reversão de mudanças;
- não modificar permissões ou políticas automaticamente;
- utilizar feedback para formular hipóteses, que devem ser avaliadas;
- medir qualidade, taxa de conclusão, necessidade de intervenção, tempo e custo quando esses dados estiverem disponíveis.

A personalização comercial deve distinguir interesse declarado, ativação, uso recorrente, resultado comprovado e compromisso de pagamento. Nenhum deles deve ser apresentado como outro.

## 12. Plano incremental

### Fase 0 — Contrato e desenho
- aprovar dimensões mínimas da triagem;
- definir schema versionado;
- inventariar fluxos/capacidades existentes;
- definir modelo de identidade, organização e autorização com base na implementação atual;
- definir eventos mínimos de experimento.

### Fase 1 — Triagem adaptativa
- implementar perguntas condicionais;
- permitir salvar e corrigir respostas;
- marcar origem e estado de validação;
- não exigir informações não essenciais.

### Fase 2 — Personalização por regras
- configurar fluxo inicial e nível de orientação;
- validar cada configuração contra capacidades disponíveis;
- registrar regra e versão aplicadas;
- testar perfis e contextos representativos.

### Fase 3 — Experimentos e evidências
- registrar execução, resultado, exceções e feedback;
- medir critérios acordados;
- separar resultados sintéticos de resultados de campo;
- permitir revisão humana.

### Fase 4 — Aprimoramento
- avaliar padrões de demanda e recomendações;
- comparar o ganho da IA com regras explícitas;
- somente então considerar adaptação estatística ou mais autonomia.

## 13. Critérios de aceitação arquitetural

A proposta pode avançar para implementação quando:
1. O perfil e o contexto são objetos distintos e versionados.
2. Cada dado relevante tem origem e estado de validação definidos.
3. A triagem é condicional e minimiza coleta.
4. A configuração é reproduzível a partir do perfil, contexto, catálogo e versão das regras.
5. Capacidades indisponíveis ou não autorizadas nunca são selecionadas para execução.
6. A personalização não altera permissões.
7. Contextos e dados são isolados por organização.
8. É possível explicar por que uma configuração foi escolhida.
9. Execuções e resultados podem ser associados à configuração utilizada.
10. O usuário pode corrigir informações incorretas e revisar preferências.
11. Falhas, incerteza e necessidade de revisão humana permanecem explícitas.
12. Os testes cobrem contexto incompleto, dados conflitantes, capacidade indisponível, falta de permissão e isolamento entre organizações.

## 14. Questões em aberto

Estas decisões exigem confirmação antes da implementação:
- provedor e modelo de autenticação;
- modelo de organização/tenant e convites;
- armazenamento persistente e política de retenção;
- catálogo formal de fluxos/capacidades;
- eventos e métricas mínimos de experimentação;
- critérios para solicitar confirmação humana;
- dados mínimos necessários para o primeiro caso de uso;
- quais resultados poderão ser usados para análise agregada e sob quais controles.

## 15. Decisão proposta

Adotar o CPE como módulo lógico interno do 3L0 Vision, começar com triagem progressiva e regras explícitas, e adiar infraestrutura autônoma, aprendizado adaptativo avançado e monetização até que o fluxo operacional e o valor para os usuários tenham evidências suficientes.

**Referência de produto:** `docs/application-foundation.md`, `docs/architecture.md`, `docs/roadmap.md` e `docs/strategy/business-plan-v0.1.md`.


## 16. Identidade visual do projeto no aplicativo

A identidade do projeto deve ser incorporada ao próprio 3L0 Vision, não ficar restrita ao portal institucional. A aplicação atual ainda precisa passar por uma etapa explícita de personalização visual conforme a identidade aprovada do projeto.

### Regras
- O portal e o aplicativo devem ser reconhecidos como partes do mesmo ecossistema 3L0, preservando a função distinta de cada superfície.
- O Vision deve aplicar o sistema de identidade visual aprovado: marca, símbolo/logotipo, paleta, tipografia, tokens, espaçamento, componentes, iconografia e estados interativos, conforme os artefatos oficiais existentes.
- Antes de introduzir novos valores visuais, consultar e reutilizar os tokens e o sistema de design já definidos no repositório. Não inventar uma identidade paralela nem redesenhar a marca sem aprovação.
- Centralizar cores, tipografia, raios, espaçamento, bordas, superfícies e estados nos design tokens e componentes reutilizáveis, evitando estilos inconsistentes espalhados pela aplicação.
- Personalizar o shell do aplicativo, navegação, telas de entrada/autenticação quando implementadas, estados vazios, mensagens de erro, carregamento, formulários e resultados — não apenas a página inicial.
- Preservar legibilidade, contraste acessível, responsividade e feedback de interação. A identidade visual não deve reduzir a clareza operacional.
- Distinguir claramente estados reais do produto, demonstrações e capacidades indisponíveis. A estética não deve sugerir recursos que ainda não existem.
- A experiência autenticada deverá manter a identidade 3L0 enquanto pode adaptar conteúdo, orientação e fluxos ao perfil. A personalização contextual não deve substituir nem fragmentar a identidade central da marca.

### Sequência de trabalho visual
1. Auditar a aplicação publicada e o código atual, identificando lacunas entre a identidade aprovada e a interface existente.
2. Localizar e confirmar os artefatos oficiais de marca, tokens e componentes no repositório.
3. Documentar uma matriz de telas/componentes a atualizar.
4. Aplicar a identidade usando tokens e componentes compartilhados.
5. Validar responsividade, contraste, estados e consistência visual em desktop e dispositivos móveis.
6. Comparar a implementação publicada com o código e os artefatos de referência antes de considerar a etapa concluída.

### Critério de aceitação visual
A aplicação será considerada alinhada quando suas principais telas e estados utilizarem de forma consistente os ativos e tokens aprovados, forem responsivos e acessíveis, e a experiência do aplicativo for visualmente coerente com o portal sem se confundir com ele.

Esta seção define um requisito de implementação futuro; não declara que a personalização visual já foi executada.

## 17. UX/UI, experiência de plataforma, Agent, Skills e narrativa

A personalização deve ser concebida como uma experiência de produto integrada, e não como um formulário isolado nem apenas como uma camada visual. UX, UI, identidade, capacidades do 3L0 Agent, Skills disponíveis e narrativa do produto devem partir do mesmo modelo de contexto e permanecer coerentes entre si.

### 17.1 Princípio de experiência

A experiência deve ajudar o usuário a compreender:
- onde está na plataforma e qual é o próximo passo;
- o que o 3L0 pode fazer no contexto atual;
- por que determinada pergunta, recomendação, fluxo ou capacidade está sendo apresentada;
- o que será executado, com quais entradas e limites;
- o que foi concluído, o que continua incerto e onde é necessária sua intervenção;
- quais evidências e resultados foram produzidos.

A personalização deve reduzir esforço e ambiguidade, não esconder complexidade importante. O sistema pode graduar a explicação e a profundidade da interface, mas deve preservar estados, limites, riscos e ações relevantes.

### 17.2 UX — desenho da jornada

A jornada deve ser modelada de ponta a ponta, incluindo:
1. descoberta e entrada a partir do Portal;
2. orientação inicial e explicação do valor do produto;
3. identificação/autenticação e seleção do contexto autorizado, conforme a implementação real;
4. triagem progressiva, com indicação do motivo das perguntas e possibilidade de corrigir respostas;
5. apresentação da configuração sugerida e das capacidades que realmente estão disponíveis;
6. confirmação antes de ações relevantes, externas ou potencialmente irreversíveis;
7. execução com feedback de progresso, falhas e necessidade de intervenção;
8. apresentação do resultado, evidências, incerteza e próximos passos;
9. feedback explícito e adaptação controlada da experiência.

A jornada deve contemplar primeira utilização, retorno, contexto incompleto, erro de integração, ausência de permissões, capacidade indisponível, resultado inconclusivo e recuperação após falha. Não assumir que o usuário conhece os conceitos internos do 3L0, ORC, Agent ou Skills.

### 17.3 UI — sistema visual e estados

A interface deve combinar a identidade oficial do 3L0 com uma hierarquia visual funcional. O sistema de design deve definir tokens e componentes reutilizáveis para:
- estrutura da plataforma, navegação e orientação contextual;
- formulários e perguntas adaptativas;
- cartões de capacidades/Skills, com descrição, requisitos e disponibilidade;
- estados de execução, progresso, sucesso, falha, conflito e incerteza;
- solicitações de confirmação e intervenção humana;
- resultados, evidências, histórico e explicações;
- feedback, preferências e correção de informações.

Os estados devem ser comunicados por texto e estrutura visual, e não apenas por cor ou animação. Devem ser testados em tamanhos de tela relevantes, com teclado, leitor de tela e contraste adequado. Animações e elementos conversacionais não podem mascarar latência, falhas ou ações que não ocorreram.

A interface não deve representar como conectada, ativa ou executável uma Skill, integração ou capacidade que ainda não esteja disponível no ambiente atual.

### 17.4 Modelo de integração do 3L0 Agent

O 3L0 Agent deve aparecer na experiência como mecanismo de coordenação de tarefas e composição de capacidades quando essa integração estiver efetivamente implementada. Não deve ser apresentado como autoridade de identidade, permissão, verdade ou resolução semântica que pertença a outros componentes.

A experiência deve separar claramente:
- **intenção do usuário:** o resultado solicitado;
- **plano ou fluxo proposto:** como a plataforma pretende abordar a tarefa;
- **capacidades/Skills selecionadas:** ferramentas ou procedimentos elegíveis para aquela tarefa;
- **execução observada:** etapas que realmente ocorreram;
- **resultado e evidências:** o que foi produzido e o que sustenta a conclusão;
- **limitações e intervenção:** o que falhou, ficou pendente ou exige decisão humana.

O Vision permanece responsável pela experiência de usuário, pelo contexto aplicado e pela apresentação dos estados. O Agent coordena tarefas dentro das capacidades e políticas recebidas. A autorização deve continuar sendo imposta por controles confiáveis, não por instruções de prompt ou pela decisão do Agent. O ORC mantém sua responsabilidade de resolução semântica nos fluxos em que for usado.

Enquanto o adaptador do Agent e o fluxo real não estiverem integrados e validados, a UI e a narrativa devem tratar essa integração como planejada ou experimental — nunca simular uma execução real como se tivesse ocorrido.

### 17.5 Skills como capacidades de produto

Skills devem ser modeladas como capacidades identificáveis, versionadas e governadas, não como funcionalidades mágicas nem como um catálogo indiscriminado de prompts.

Para cada Skill, o catálogo deverá registrar, conforme aplicável:
- identificador e versão;
- propósito e tarefas adequadas;
- entradas necessárias e formatos aceitos;
- saídas esperadas;
- dependências e integrações;
- permissões exigidas;
- limitações conhecidas e riscos;
- critérios de elegibilidade;
- política de confirmação/revisão humana;
- estado de disponibilidade no ambiente;
- evidências e testes de validação.

O CPE poderá usar o perfil e o contexto para filtrar e recomendar Skills elegíveis. A seleção final deve respeitar disponibilidade real, políticas, permissões e compatibilidade de entradas. Uma recomendação não equivale a execução; execução não equivale a sucesso; sucesso declarado não equivale a resultado verificado.

A interface deve explicar a função da Skill em linguagem adequada ao usuário, mostrar requisitos relevantes e comunicar claramente se ela está disponível, precisa de configuração, foi executada ou falhou. Não expor detalhes internos desnecessários nem ocultar consequências relevantes.

### 17.6 Narrativa de produto e linguagem

A narrativa deve acompanhar a experiência real e usar uma linguagem consistente entre Portal, Vision e Agent:
- explicar o problema e o resultado esperado antes de enfatizar a tecnologia;
- apresentar a personalização como adaptação contextual e controlada, não como conhecimento infalível do usuário;
- descrever o Agent como coordenador de tarefas e capacidades, quando aplicável;
- descrever Skills como capacidades delimitadas com requisitos e limites;
- distinguir explicitamente o que está disponível hoje, o que é experimental e o que está no roadmap;
- explicar incerteza, validação, evidências e necessidade de confirmação em linguagem compreensível;
- evitar promessas de autonomia, integração, precisão, segurança, impacto ou retorno que não tenham validação suficiente.

O Portal pode usar uma narrativa institucional concisa para descoberta e acesso; o Vision deve traduzir essa promessa em orientação operacional e resultados observáveis. A linguagem e a marca podem variar de profundidade por superfície, mas não podem contradizer-se. A interface não deve prometer algo que o fluxo executável não entrega.

### 17.7 Personalização sem fragmentação da plataforma

A personalização poderá ajustar:
- ordem e relevância das perguntas;
- onboarding e nível de orientação;
- conteúdo, exemplos e explicações;
- fluxos elegíveis e Skills recomendadas;
- visualização de resultados e próximos passos;
- preferências explícitas de interação.

Não deverá criar uma identidade visual diferente para cada perfil, alterar permissões, esconder estados relevantes, mudar silenciosamente critérios de avaliação ou inventar capacidades. A plataforma deve continuar reconhecível como um único produto 3L0, com experiências contextualizadas sobre uma base consistente.

### 17.8 Sequência de design e implementação

1. Mapear a jornada atual do Portal ao Vision e identificar o que existe, está incompleto ou é apenas planejado.
2. Auditar a UI atual e os ativos/tokens oficiais da identidade 3L0.
3. Definir personas operacionais apenas na medida necessária para tarefas e necessidades observáveis, sem inferir atributos sensíveis.
4. Construir mapa de jornada, arquitetura de informação e estados de UX, incluindo exceções e recuperação.
5. Definir o catálogo versionado de capacidades/Skills e o contrato de integração do Agent.
6. Mapear os estados do Agent e das Skills para estados de interface explícitos, sem confundir plano, execução e resultado.
7. Definir a narrativa por superfície e os termos consistentes usados na interface.
8. Implementar primeiro a estrutura de UI e os estados sobre capacidades reais já disponíveis; manter integrações futuras claramente sinalizadas.
9. Validar com testes funcionais, acessibilidade, responsividade, falhas e tarefas representativas de usuários.
10. Só então ampliar a personalização com base em evidências de uso, feedback e avaliação.

### 17.9 Critérios de aceitação de UX/UI e integração

- A jornada completa possui estados normais, alternativos e de recuperação documentados.
- O usuário consegue entender o objetivo, o próximo passo e o estado atual sem conhecer a arquitetura interna.
- A interface usa a identidade oficial e componentes consistentes em todas as telas e estados relevantes.
- Recomendações de fluxo/Skill são explicáveis e respeitam o catálogo, disponibilidade, entradas, políticas e permissões.
- A interface diferencia claramente intenção, plano, execução, resultado e evidência.
- Falhas, incerteza, conflitos e necessidade de confirmação são visíveis e acionáveis.
- Nenhuma integração simulada é apresentada como execução real.
- A narrativa do Portal, Vision e Agent é coerente com o estado implementado do produto.
- Testes cobrem contexto incompleto, Skill indisponível, dependência falha, permissão negada, erro do Agent, resultado inconclusivo e isolamento entre organizações.
- A avaliação de usabilidade, acessibilidade e conclusão de tarefas é registrada antes de afirmar que a experiência está validada.

Esta seção amplia os requisitos arquiteturais para orientar UX, UI, narrativa e integração futura do Agent/Skills. Não declara que essas integrações ou melhorias já foram implementadas.

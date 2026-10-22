# 3L0 — Pesquisa de mercado: agentes, automação e serviços de IA

- Data: 2026-10-22
- Versão: 0.1
- Estado: pesquisa exploratória; preços e hipóteses comerciais não aprovados.
- Escopo: práticas públicas de plataformas de agentes, automação e marketplaces. Revalidar fontes antes de decisões de lançamento.

## Pergunta

Como monetizar uma plataforma que coordena skills especializadas, processamento por uso e integrações empresariais, mantendo preço compreensível e margem sustentável?

## Resumo executivo

A amostra de mercado mostra quatro padrões recorrentes: (1) assinatura por nível de produto; (2) consumo medido por ação, crédito, conversa, atividade ou execução; (3) assinatura com franquia e excedente; (4) contratos Enterprise para integração, governança e suporte.

Isso demonstra que diferentes modelos são praticados, mas não prova qual funciona melhor para o 3L0. Não há base para fixar preços sem entrevistas, custos reais e validação de disposição a pagar.

Recomendação provisória a testar: assinatura base + franquia de uso + skills premium + implantação de integrações. Começar com serviços próprios/gerenciados, deixando marketplace aberto de terceiros para uma fase posterior.

## Evidência comparativa

### Salesforce Agentforce — ações, conversas e licenciamento
A página pública apresenta opções de consumo por Flex Credits, por conversa e por usuário/licença. A empresa descreve ações como atualizar registros e executar fluxos como unidades de consumo.

**Aprendizado:** a unidade comercial deve corresponder a algo que o cliente entende. Evitar expor tokens internos como unidade principal.
Fontes: https://www.salesforce.com/br/agentforce/pricing/ ; https://www.salesforce.com/agentforce/pricing/ ; https://help.salesforce.com/s/articleView?id=004811240&language=pt_BR&type=1

### Google Cloud Marketplace — assinatura, uso e combinado
A documentação oficial oferece modelos gratuito, assinatura, uso medido e combinado. No modelo por uso, o produto precisa medir e reportar métricas; é possível oferecer trial.

**Aprendizado:** a arquitetura comercial precisa de medição de uso auditável. Uma skill pode ser comercializada por assinatura ou consumo se a métrica for definida.
Fontes: https://docs.cloud.google.com/marketplace/docs/partners/ai-agents ; https://docs.cloud.google.com/marketplace/docs/partners/ai-agents/pricing-models

### Zapier Agents — atividades mensais e Enterprise
A página pública apresenta planos com limites mensais de atividades crescentes e opção Enterprise customizada.

**Aprendizado:** limites por plano ajudam a tornar o uso previsível; controles organizacionais podem fazer parte da oferta empresarial. “Atividade” não é automaticamente equivalente à execução de skill 3L0.
Fonte: https://zapier.com/pricing

### Make — créditos por ação de módulo
A Make define cada ação de módulo de um cenário como crédito e diferencia planos por volume e recursos.

**Aprendizado:** cobrança por operação é familiar em automação, mas cobrar cada etapa interna pode ser confuso quando uma tarefa contém várias etapas. Medir internamente em detalhe e apresentar unidade comercial mais clara pode ser melhor.
Fontes: https://www.make.com/en/pricing ; https://www.make.com/ai-agents

### n8n — execução completa de workflow
A página pública enfatiza cobrança por execuções mensais de workflow, independentemente do número de etapas, com planos progressivos e Enterprise.

**Aprendizado:** cobrar por fluxo completo pode ser mais compreensível do que cobrar cada etapa. Porém, workflows com custos muito diferentes precisam de limites ou classes.
Fonte: https://n8n.io/pricing/

### HubSpot AI Credits — créditos e pay-as-you-go
A HubSpot publica créditos, pacotes antecipados e cobrança por uso acima do limite mensal; créditos incluídos são renovados mensalmente e não acumulam.

**Aprendizado:** uma carteira de créditos pode unificar capacidades distintas, mas o saldo, o custo e a regra de consumo precisam ser transparentes antes da execução.
Fontes: https://www.hubspot.com/products/artificial-intelligence/credits ; https://br.hubspot.com/products/artificial-intelligence/credits

### AWS Marketplace — SaaS, contratos e pay-as-you-go
O marketplace oferece agentes e ferramentas com opções como pay-as-you-go, assinatura contratual e termos customizados. A documentação exige definição do modelo e integração de billing apropriada.

**Aprendizado:** distribuição por marketplace é uma opção futura, mas não precisa preceder validação de produto, qualidade e suporte.
Fontes: https://aws.amazon.com/marketplace/solutions/ai-agents-and-tools/ ; https://docs.aws.amazon.com/marketplace/latest/userguide/listing-saas-ai-agents.html

### OpenAI API / Agents API — custo de infraestrutura
A documentação publica tarifas de modelos e ferramentas; a Agents API informa que uso de modelos, ferramentas e sandbox segue as tarifas aplicáveis.

**Aprendizado:** custo do provedor é insumo para margem, não necessariamente unidade comercial ao cliente. Medir OCR, modelos, ferramentas, armazenamento, chamadas externas e retries por execução.
Fontes: https://developers.openai.com/api/docs/pricing ; https://developers.openai.com/api/docs/guides/agents-api/overview

## Comparação dos modelos

| Modelo | Vantagem | Risco | Uso potencial no 3L0 |
|---|---|---|---|
| Assinatura fixa | Previsibilidade e receita recorrente | Alto uso pode corroer margem | Acesso, histórico, governança |
| Assinatura + franquia | Equilibra previsibilidade e escala | Franquia mal calculada gera prejuízo | Hipótese inicial prioritária |
| Créditos | Carteira compartilhada entre skills | Unidade abstrata | Consumo multicapacidade, com conversão transparente |
| Cobrança por ação | Liga preço a operação | Ações variam de custo e valor | Operações bem definidas |
| Por documento/lote | Fácil de entender em OCR | Documentos variam em páginas e complexidade | Serviço documental, com limites |
| Por workflow concluído | Compra de resultado operacional | Workflows variam muito de custo | Fluxos padronizados |
| Por usuário | Simples para equipes | Não acompanha consumo computacional | Colaboração e administração |
| Implantação + recorrência | Recupera custo de integração | Ciclo de venda maior | Adaptadores e Enterprise |
| Marketplace de terceiros | Expande oferta | Governança, suporte, comissão e responsabilidade | Futuro, após validação |

## Hipóteses para testar

1. Assinatura base com franquia mensal e excedente transparente.
2. Skills premium por add-on, pacote ou uso, conforme perfil.
3. Serviços documentais por documento/lote, após definir limites de complexidade.
4. Integrações cobradas por implantação e, se aplicável, manutenção/uso.
5. Enterprise por contrato.
6. Marketplace de terceiros somente depois de contratos de skills, avaliação, segurança, suporte e pagamentos estarem maduros.

## Pesquisa primária necessária

Entrevistar: (a) PMEs com volume documental/operacional; (b) empresas que precisam levar dados a ERP/CRM; (c) equipes que limpam e analisam documentos/planilhas.

Perguntar: frequência e custo do processo atual; custo de erros; sistema de destino; passos que exigem revisão humana; preferência entre assinatura, usuário, documento, tarefa ou fluxo; limite mensal aceitável; exigências de evidência e auditoria; condições para autorizar gravação automática.

Priorizar pilotos pagos ou compromissos verificáveis. Respostas hipotéticas isoladas não provam disposição a pagar.

## O que não fazer

- Não copiar preços de concorrentes sem conhecer custos e segmento.
- Não usar tokens como unidade de faturamento principal para usuários de negócio.
- Não cobrar separadamente cada pequena função sem valor claramente percebido.
- Não anunciar integração como ativa antes de implementar e validar.
- Não apresentar serviços jurídicos/contábeis como substituição de profissionais habilitados.
- Não publicar tabela definitiva antes de entrevistas e cálculo de margem.

## Conclusão

A evidência pública sustenta que assinatura, consumo, add-ons e contratos empresariais são padrões praticados. Ela não determina o modelo ideal do 3L0. Próximo passo: escolher um fluxo com valor mensurável, entrevistar clientes e medir custo real antes de definir preços.

**Estado:** modelo híbrido é hipótese, não decisão aceita. Segmento inicial, primeira oferta, unidade de cobrança, preços e margem permanecem pendentes.

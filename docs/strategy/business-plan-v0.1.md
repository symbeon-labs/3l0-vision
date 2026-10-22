# 3L0 — Plano de negócio inicial v0.1

- Data: 2026-10-22
- Estado: hipótese estratégica para validação; não é plano financeiro aprovado.
- Pesquisa de mercado: docs/strategy/market-research-ai-services-v0.1.md
- Princípio: não confundir hipóteses com tração, capacidades lançadas ou preços aprovados.

## 1. Resumo executivo

3L0 é concebido como uma plataforma de inteligência operacional que transforma imagens, documentos, identificadores e dados heterogêneos em informação estruturada e contextualizada, relaciona evidências, ajuda a tratar inconsistências e prepara resultados para processos e sistemas autorizados.

Responsabilidades:
- **3L0 Vision:** produto, percepção, extração e observações.
- **ORC:** infraestrutura semântica e de resolução.
- **3L0 Agent:** coordenação de tarefas e composição de capacidades.
- **Skills:** capacidades especializadas com contratos e versões.
- **Adaptadores:** mapeamento do modelo 3L0 para ERP, CRM, marketplace ou API.
- **Portal:** publicação pública seletiva; não é fonte da verdade técnica.
- **App:** experiência de uso que deve refletir a implementação real.
- **Core Vault:** contexto estratégico e operacional protegido.

Oportunidade comercial a validar: assinatura de plataforma, skills premium, consumo medido, implantação de integrações e contratos empresariais.

## 2. Problema e hipótese de valor

Organizações recebem informação em imagens, PDFs, formulários, planilhas, etiquetas, documentos fiscais e sistemas. Pessoas copiam, normalizam, conciliam e inserem dados manualmente. Erros e divergências geram retrabalho.

**Hipótese:** 3L0 reduz retrabalho e melhora a rastreabilidade dos dados e das exceções. Não alegar ROI, precisão ou produtividade sem medição em fluxo real.

## 3. Segmentos candidatos (não validados)

### A. PMEs com fluxo documental recorrente
Problema: extração e registro manual. Entrada potencial: documentos para dados estruturados. Riscos: orçamento e diversidade documental.

### B. Empresas com ERP/CRM
Problema: mapear dados de documentos e fontes externas para sistemas. Entrada potencial: extração, normalização, validação e adaptador. Riscos: integração, autenticação e variação por cliente.

### C. Equipes de análise de dados
Problema: limpar e transformar planilhas/documentos. Entrada potencial: tratamento assistido e relatórios. Risco: mercado amplo e diferenciação a provar.

### D. Serviços profissionais jurídicos/contábeis
Problema: organizar documentos, extrair campos e apoiar conferência. Entrada potencial: assistência documental com evidências e revisão profissional. Riscos: confidencialidade, regulação e responsabilidade.

## 4. Proposta de valor a testar

Transformar entradas heterogêneas em dados estruturados, rastreáveis e preparados para uso operacional, com resolução assistida e integração controlada.

Diferenciadores candidatos:
1. Proveniência entre campos e fonte.
2. Separação entre observação, inferência, regra e estado resolvido.
3. Tratamento explícito de conflito e incerteza.
4. Agente que combina skills para concluir fluxos.
5. Adaptadores para esquemas de destino.
6. Confirmação humana e registro de execução para ações consequenciais.

São hipóteses de diferenciação; declarar implementação apenas com evidência.

## 5. Portfólio e monetização

### Plataforma base
Assinatura por plano para recursos efetivamente disponíveis: acesso, histórico, usuários, governança e limites.

### Skills premium
Capacidades especializadas habilitadas conforme demanda: extração/normalização, conferência, análise de dados, assistência documental jurídica/contábil e operações. Modelo candidato: add-on, pacote ou consumo. Não vender assistência como substituição de profissional habilitado.

### Consumo operacional
Unidades candidatas: documento/lote, execução de skill, workflow concluído, operação externa ou créditos. A escolha depende de custo, compreensibilidade e variabilidade.

### Integrações
Implantação e mapeamento inicial; homologação; manutenção/compatibilidade; uso ou contrato específico. “Preparado para integração” não significa integração ativa.

### Enterprise
Contrato customizado para volume, segurança, auditoria, suporte, SLA e integrações.

### Marketplace de terceiros — futuro
Considerar somente após governança de skills, avaliação, versionamento, autorização, suporte e regras comerciais.

## 6. Modelo comercial prioritário para teste

**Hipótese:** assinatura base + franquia mensal + add-ons premium + implantação de integrações.

A fórmula de margem por execução deve considerar modelos, OCR, ferramentas, armazenamento, chamadas externas, retries, revisão humana e infraestrutura diretamente atribuível. Medir média e p95, não só média.

Margem por execução = receita alocada - custo variável total.
Contribuição mensal = receita do cliente - custos variáveis atribuíveis - custos diretos de suporte.

Não existe preço aprovado nesta versão. Considerar impostos, taxas, aquisição, suporte e inadimplência quando houver dados.

## 7. Go-to-market

1. Entrevistar clientes potenciais.
2. Comparar 2–3 casos por frequência, custo, risco, integração e valor mensurável.
3. Selecionar um fluxo inicial.
4. Rodar piloto controlado com critérios de entrada, saída, exceção e revisão humana.
5. Medir tempo, correções, intervenção humana, falhas e custo.
6. Buscar piloto pago ou compromisso comercial verificável.
7. Empacotar somente o fluxo validado.

## 8. Métricas

- Demanda: entrevistas, pilotos, conversão, receita recorrente, expansão e cancelamento.
- Produto: tarefas concluídas, sucesso por skill, exceções, correções, tempo e falhas de integração.
- Economia unitária: custo médio/p95 por execução, custo por documento/fluxo, retries, revisão humana e margem por serviço.
- Segurança: bloqueios por falta de permissão, operações com aprovação, incidentes e reclamações de cobrança.

## 9. Roadmap orientado por gates

### Fase 0 — Descoberta
- [x] Pesquisa secundária inicial.
- [ ] Entrevistas e evidência primária.
- [ ] Comparar casos candidatos.
- [ ] Selecionar ICP e primeiro fluxo.
**Gate:** problema/segmento aprovados com evidência.

### Fase 1 — Oferta e contrato de skill
- [ ] Definir entradas, saídas, permissões, versão, erros, testes e limites.
- [ ] Escolher uma skill end-to-end.
- [ ] Definir evidência e revisão humana.
- [ ] Medir custos técnicos.
**Gate:** fluxo reproduzível e mensurável.

### Fase 2 — Piloto e economia unitária
- [ ] Piloto controlado.
- [ ] Medir qualidade, tempo, custo e volume.
- [ ] Testar propostas comerciais.
- [ ] Buscar compromisso pago.
**Gate:** valor demonstrado e margem plausível.

### Fase 3 — Entitlements e medição
- [ ] Direitos de uso por tenant/plano.
- [ ] Eventos de consumo idempotentes.
- [ ] Cotas, orçamento e prévia de custo.
- [ ] Consentimento para excedente.
- [ ] Auditoria e reconciliação.
**Gate:** autorização e consumo testados de ponta a ponta.

### Fase 4 — App e portal
- [ ] App mostra skills habilitadas, limites, estimativa, autorização e histórico.
- [ ] Agente não ultrapassa entitlement nem orçamento.
- [ ] Portal distingue disponível, piloto, em desenvolvimento e planejado.
- [ ] Preços e integrações publicados somente após validação.
**Gate:** experiência testada, não apenas mock visual.

### Fase 5 — Expansão
- [ ] Adicionar skills conforme demanda e margem comprovadas.
- [ ] Priorizar integrações pedidas por clientes.
- [ ] Considerar marketplace após governança madura.

Fases sem datas prometidas; a passagem depende de critérios de saída.

## 10. Decisões pendentes

ICP; primeiro caso de uso; primeira skill/oferta; unidade de cobrança; preço; margem-alvo; franquia e excedente; política de retries/estornos; retenção de dados; prioridades de integração; momento de abrir marketplace.

## 11. Distribuição de informação

- 3l0-vision: fonte canônica de visão, pesquisa, plano e roadmap.
- 3l0-core-vault: contexto compacto, evidências e estado de decisão para o Operational Brain.
- 3l0-agent: contratos de skill, seleção, entitlement, orçamento, aprovação e medição.
- 3l0-portal: publicação seletiva aprovada.
- 3L0 App: descoberta, autorização, execução e histórico.

## 12. Governança

O agente deve recuperar fontes canônicas, separar fato/hipótese/proposta/decisão aceita, identificar o gate atual e propor a menor ação verificável. Pesquisa e plano não autorizam automaticamente implementação nem publicação. Atualizar a fonte canônica após decisão humana explícita.

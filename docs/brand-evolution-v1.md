# Evolução do sistema de marca 3L0 — v1

**Estado:** proposta documental para revisão.  
**Escopo:** alinhar o sistema de marca do Vision ao trabalho institucional desenvolvido no Portal. Não representa aprovação visual final nem validação de funcionalidades.

## 1. Tese central

**Tornar o mundo físico computável.**

O 3L0 conecta observações do mundo físico a evidências digitais e sistemas operacionais. A marca deve transmitir resolução operacional: observar, relacionar, resolver e tornar o próximo passo compreensível.

A identidade não deve parecer um assistente genérico de IA, um ERP convencional, uma loja virtual ou um gadget futurista. Tecnologia aparece como estrutura, rastreabilidade e clareza — não como espetáculo.

## 2. Papel de cada superfície

### 3L0 Portal — compreensão institucional

O Portal apresenta:
- a tese e o problema operacional;
- os cenários de uso e seus limites;
- a arquitetura em linguagem acessível;
- o estado de maturidade do produto;
- o acesso ao ambiente experimental.

O Portal pode explicar ambição e direção, mas deve identificar protótipos e demonstrações conceituais. Não deve sugerir que uma ilustração executa OCR, validação fiscal ou integração real.

### 3L0 Vision — ação operacional

O Vision apresenta:
- a tarefa atual;
- a fonte e a proveniência da evidência;
- os campos observados e as referências comparadas;
- a correspondência, incerteza ou divergência;
- a próxima ação permitida e a necessidade de revisão humana.

A interface operacional deve priorizar legibilidade e estado real. Não deve reproduzir a narrativa longa da landing page.

### Repositórios — rastreabilidade

Os repositórios documentam decisões, implementação, limites e validações. Um README, screenshot, build ou deploy não é evidência suficiente de que todo o fluxo funcional está validado.

## 3. Gramática visual compartilhada

- **Base:** near-black/azul-marinho, superfícies em camadas e divisores finos.
- **Tipografia:** Inter para leitura e ações; JetBrains Mono para códigos, identificadores e metadados.
- **Marca:** wordmark 3L0 Vision e zero segmentado usados de forma consistente.
- **Ciano:** observação e captura; não equivale a confirmação.
- **Verde:** resolução sustentada pelo estado real.
- **Âmbar:** atenção, dados ausentes ou revisão necessária.
- **Vermelho:** conflito não resolvido.
- **Movimento:** comunica transição funcional, sem animação decorativa excessiva.
- **Acessibilidade:** contraste, foco visível, navegação por teclado, alvos de toque adequados e respeito a movimento reduzido.

Os valores concretos de CSS podem variar entre Portal e Vision; o significado semântico dos tokens não pode variar.

## 4. Gramática verbal

Preferir frases diretas, calmas e verificáveis.

**Preferir**
- “Informações incompletas.”
- “Possível divergência identificada.”
- “Correspondência aguardando confirmação.”
- “Dados preparados para revisão.”
- “Integração em validação.”

**Evitar sem evidência específica**
- “Precisão garantida.”
- “Conformidade fiscal garantida.”
- “Integração pronta com qualquer ERP.”
- “Identidade física confirmada apenas pela imagem.”
- “Redução comprovada de custos ou tempo.”
- “Pronto para produção” baseado apenas em build ou deploy.

## 5. Vocabulário de maturidade

Toda alegação pública deve se enquadrar em uma categoria explícita:

1. **Disponível e verificado:** acessível e testado no ambiente indicado.
2. **Experimental:** testável com escopo e limitações conhecidos.
3. **Em desenvolvimento/validação:** em implementação ou sob teste; sem garantia de produção.
4. **Planejado:** intenção futura, sem promessa de disponibilidade.

Não usar “disponível” como sinônimo de “há código”. Não usar “integrado” como sinônimo de “há um contrato ou adaptador planejado”.

## 6. Regras para a demonstração do Portal

- Rotular como conceitual qualquer sequência que não execute processamento real.
- Identificar dados sintéticos quando usados.
- Não desenhar uma confirmação visual verde se o cenário demonstra incerteza ou conflito.
- Fazer com que cada etapa represente uma transição compreensível: capturar → extrair → estruturar → comparar → revisar.
- Não apresentar gravação, persistência, envio para ERP ou resultado fiscal se isso não estiver realmente ligado a um serviço funcional.
- Manter os CTAs explícitos: explorar o produto, ver o estado atual ou abrir o ambiente experimental.

## 7. Hierarquia de informação recomendada

### Portal
1. Tese clara e proposta de valor.
2. Contexto operacional que o produto ajuda a organizar.
3. Como funciona, sem exagerar a automação.
4. Cenários de uso.
5. Estado atual e limitações.
6. CTA para o ambiente experimental.

### Vision
1. Tarefa e ação primária.
2. Evidência de origem.
3. Resultado e grau de certeza.
4. Divergências e informação ausente.
5. Revisão humana e próxima ação.
6. Metadados técnicos em segundo plano.

## 8. Critérios de aceitação visual

- [ ] A identidade é reconhecível nas duas superfícies sem torná-las iguais.
- [ ] Os termos “captura”, “evidência”, “correspondência”, “divergência” e “revisão” são consistentes.
- [ ] Cores de estado refletem o estado real e também possuem rótulos textuais.
- [ ] A experiência permanece legível em telas estreitas e largas.
- [ ] Foco por teclado e estados interativos são visíveis.
- [ ] O movimento reduzido é respeitado.
- [ ] Demonstrações conceituais e dados sintéticos são identificados.
- [ ] Alegações de capacidade têm evidência específica ou são marcadas como experimentais/planejadas.
- [ ] A revisão de código, a revisão visual e a confirmação de deploy são registradas separadamente.

## 9. Ordem recomendada de implementação

1. Aprovar a linguagem e os limites desta diretriz.
2. Ajustar o Portal para refletir a tese, os cenários e o estado de maturidade, preservando o layout existente.
3. Conferir logo, ícone e recursos estáticos em GitHub Pages e Vercel.
4. Revisar responsividade, contraste, navegação e semântica dos estados.
5. Comparar o Vision com as mesmas regras sem copiar a landing page para a aplicação.
6. Registrar evidências de validação e só então declarar a integração visual concluída.

## 10. Fontes canônicas

- [Brand System](./brand.md)
- [Brand Board](./brand-board.md)
- [Design Tokens](./design-tokens.md)
- [Integração visual Portal → Vision](./portal-visual-integration.md)

Este documento complementa essas fontes. Se houver conflito, as regras de identidade ficam em `brand.md`, os significados de tokens em `design-tokens.md`, os comportamentos em `docs/ux.md` e os limites funcionais em `docs/architecture.md`.

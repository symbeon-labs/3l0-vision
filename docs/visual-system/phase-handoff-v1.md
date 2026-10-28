# 3L0 Vision — Handoff da Fase Visual

**Documento de continuidade:** PR #40  
**Branch de referência:** `ui/3l0-visual-system-v1`  
**Estado:** implementação visual incremental em andamento; não representa aprovação de merge nem validação de runtime.  
**Produto:** 3L0 Vision — identidade visual aplicada à experiência operacional existente.

## 1. Objetivo da nova fase

Evoluir a primeira camada visual da PR #40 para um sistema visual consistente, responsivo e acessível aplicado aos fluxos reais do 3L0 Vision — sem transformar o conceito visual em alegação de funcionalidades inexistentes.

A referência estética combina:
- superfícies escuras industriais, com profundidade discreta;
- verde-sinal reservado para ações primárias, foco e estados positivos;
- tipografia legível com caráter técnico;
- hierarquia operacional clara para evidência, estado, exceção e próxima ação;
- interface adaptável a celular, tablet e desktop.

A meta não é copiar literalmente um mockup. É traduzir a direção visual para a arquitetura, os componentes e os estados que o repositório realmente possui.

## 2. O que a PR #40 já entrega

A PR #40 começou pela consolidação da base visual em `app/styles.css`:
- importação de fontes mantida no topo da folha;
- um único bloco canônico `:root`, com tokens Dark Signal para fundo, superfícies, texto, borda, sinal e estados;
- remoção do bloco `:root` concorrente que sobrescrevia a paleta inicial;
- preservação das regras existentes de foco visível e `prefers-reduced-motion`.

Essa é uma primeira fatia de implementação. A aplicação visual tela a tela, a inspeção em navegador real e a validação de acessibilidade/responsividade continuam pendentes.

Essa alteração não modifica autenticação, workspaces, resolução, persistência, captura, parser XML ou contratos de domínio.

## 3. Estado técnico que deve ser preservado

O aplicativo atual usa Vite e JavaScript modular, com a interface principal em `app/main.js` e estilos em `app/styles.css`. Não presumir React, Tailwind ou shadcn/ui sem uma decisão arquitetural separada.

A interface já contém fluxos e seletores relacionados a:
- autenticação e sessão;
- entrada e seleção de workspace;
- captura por câmera e fallback manual;
- leitura de códigos;
- captura de imagem e pré-visualização;
- ingestão e revisão de XML fiscal;
- orientação sobre fontes de contexto;
- resultados de resolução, incerteza e conflito.

A existência de um controle visual não prova que uma integração externa esteja ativa. O estado de implementação de cada capacidade deve continuar explícito.

## 4. Princípios de design e comportamento

1. **Produto antes do mockup.** Componentes e painéis devem refletir os dados e os estados reais do fluxo.
2. **Semântica de estado consistente.** Verde não deve significar genericamente “tudo validado”; âmbar representa atenção/insuficiência e vermelho conflito ou bloqueio, conforme os contratos existentes.
3. **Evidência separada de inferência.** Texto extraído, observação, dado de catálogo, verificação independente e confirmação humana devem continuar distinguíveis.
4. **Legibilidade primeiro.** Não reduzir fontes ou contraste para obter aparência “futurista”.
5. **Mobile-first operacional.** Captura, prévia, formulários, tabelas e revisão devem funcionar em telas estreitas sem rolagem horizontal acidental.
6. **Acessibilidade.** Foco de teclado, rótulos, estados de erro, áreas de toque e movimento reduzido precisam ser preservados.
7. **Identidade única.** Aplicar os mesmos tokens e padrões em autenticação, onboarding, captura, ingestão, resolução, histórico e estados vazios.
8. **Sem dependências decorativas desnecessárias.** Preferir CSS e componentes existentes; adicionar biblioteca somente com justificativa e avaliação de impacto.

## 5. Escopo de execução

### Fase A — Auditoria visual da implementação atual
- Inspecionar as telas e estados renderizados em `app/main.js`.
- Inventariar seletores existentes e regras CSS duplicadas ou conflitantes.
- Verificar os estilos adicionados pela PR #40 contra a branch alvo real e as mudanças concorrentes.
- Registrar capturas de tela para autenticação, workspace, captura, XML, processamento, resolução, erro e estado vazio.

### Fase B — Tokens e componentes reutilizáveis
- Consolidar tokens semânticos para cor, superfície, borda, tipografia, espaçamento, raio, foco e movimento.
- Padronizar botões primários/secundários, cartões, campos, badges/estados, avisos, divisores e indicadores de processamento.
- Evitar seletores globais que alterem elementos sem relação semântica.
- Documentar exemplos e usos proibidos de cada token de estado.

### Fase C — Aplicação aos fluxos reais
- Aplicar a identidade ao shell e à navegação existentes, sem remover capacidades já implementadas.
- Refinar captura e pré-visualização, ingestão de XML, orientação de fontes e revisão de itens.
- Melhorar hierarquia dos resultados: estado, evidências, incertezas/conflitos, persistência e próxima ação.
- Manter mensagens honestas sobre catálogos sintéticos, fontes indisponíveis e integrações planejadas.
- Evitar criar dashboards com métricas fictícias ou controles sem ação implementada.

### Fase D — Responsividade e acessibilidade
- Testar larguras de 320, 375, 768, 1024 e 1440 px.
- Verificar câmera e upload em mobile; formulários, XML longo, códigos extensos e mensagens de erro.
- Testar navegação por teclado, foco visível, contraste, zoom e movimento reduzido.
- Garantir que tabelas e prévias tenham estratégia explícita para telas pequenas.

### Fase E — Validação e entrega
- Executar `npm test` e `npm run build` na revisão exata candidata.
- Resolver regressões introduzidas pela camada visual.
- Revisar capturas de tela em desktop e mobile e registrar limitações conhecidas.
- Manter a PR como Draft enquanto os gates não forem comprovados; não fazer merge apenas porque o deploy de preview está disponível.

## 6. Critérios de aceitação

A fase visual só pode ser considerada concluída quando:
- [ ] tokens e estados semânticos estão documentados e aplicados de forma consistente;
- [ ] telas existentes compartilham a mesma identidade sem remover fluxos funcionais;
- [ ] os estados de resolução, incerteza, conflito, falha e carregamento são distinguíveis e compreensíveis;
- [ ] captura, prévia, XML e formulários são utilizáveis em viewport móvel;
- [ ] foco por teclado, contraste e movimento reduzido foram revisados;
- [ ] não há controles meramente decorativos que aparentem executar ações reais;
- [ ] `npm test` passa;
- [ ] `npm run build` passa;
- [ ] evidências visuais e limitações foram registradas no PR;
- [ ] nenhuma capacidade de OCR, validação fiscal, ERP/WMS ou consulta externa é declarada como disponível sem comprovação.

## 7. Fora de escopo desta fase

- Implementar OCR ou reconhecimento visual novo.
- Alterar o contrato ORC ou a lógica de resolução.
- Declarar autenticidade fiscal com base apenas em OCR, QR ou sintaxe XML.
- Implementar integração real com ERP/WMS, fontes fiscais externas ou catálogo empresarial.
- Reestruturar autenticação, workspaces, RLS ou persistência.
- Introduzir um novo framework de UI sem ADR/decisão explícita.
- Promover automaticamente a branch para produção.

Esses temas seguem seus próprios contratos, branches e critérios de aceitação.

## 8. Relação com os handoffs existentes

Este documento é um handoff de execução visual e deve coexistir com os contratos arquiteturais e de produto já mantidos no repositório. Não substitui `docs/architecture.md`, `docs/application-foundation.md`, `docs/roadmap.md` nem o handoff arquitetural da PR #10.

Quando houver conflito, prevalecem as fronteiras de domínio, segurança e evidência definidas pela arquitetura. A identidade visual não pode conceder permissões, inventar capacidades ou alterar o significado dos estados de resolução.

## 9. Registro de decisão

**Decisão:** usar a PR #40 como ponto de partida e referência rastreável da nova fase visual.

**Próxima unidade de trabalho:** uma PR de implementação visual incremental, baseada na auditoria da interface real e vinculada a este handoff. Manter a PR #40 como origem da direção visual; não incorporar refatorações de domínio ou integrações no mesmo escopo.

**Status deste handoff:** primeira fatia de tokens consolidada na branch da PR #40. A auditoria visual completa, os testes do novo SHA e a revisão em dispositivos permanecem pendentes.

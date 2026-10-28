# 3L0 Vision — Auditoria integral da interface v1

**Escopo:** revisão estática do código da interface em `main`, usando `app/main.js`, `app/styles.css`, `app/capture/browser-capture.js`, `app/workspaces/workspace-onboarding.js`, `index.html` e o contrato de build/testes.  
**Relacionamento:** PR #40 e `docs/visual-system/phase-handoff-v1.md`.  
**Data da revisão:** 2026-10-28.  
**Natureza:** auditoria de código; não é certificação visual em navegador/dispositivo real.

## Resumo executivo

A interface já contém uma experiência de produto substancial: autenticação, seleção de workspace, histórico, captura por câmera, leitura de códigos compatíveis, captura de imagem local, ingestão de XML fiscal, comparação com catálogo de demonstração, estados de resolução e onboarding de workspace.

O principal problema para a nova fase não é falta de telas. É a falta de uma camada visual consolidada e de uma hierarquia comum entre fluxos que foram adicionados em etapas diferentes. A folha de estilos acumulou sistemas sobrepostos e a PR #40, embora tenha CI verde, ainda precisa de revisão visual real.

**Decisão recomendada:** não começar redesenhando telas individualmente. Primeiro consolidar tokens e padrões visuais, depois aplicar mudanças em fatias aos fluxos existentes, com testes de regressão e evidência visual por viewport.

## Escopo inspecionado

- `index.html`: entrada mínima do Vite e metadados de viewport.
- `app/main.js`: autenticação, home, histórico, captura, prévia de imagem, XML, comparação, processamento, resultado e erro.
- `app/styles.css`: regras globais, landing operacional, captura, autenticação, workspaces, estilos de contexto/XML e camadas de identidade.
- `app/capture/browser-capture.js`: câmera, captura de quadro, BarcodeDetector e limpeza de recursos.
- `app/workspaces/workspace-onboarding.js`: formulário, sessão, listagem, rascunho e revisão.
- `package.json` e `.github/workflows/test.yml`: comandos e gate de CI.

A tentativa de inspecionar a página de preview por meio da conexão Vercel retornou 403 para esta sessão. Portanto, não afirmamos ter concluído uma inspeção visual ao vivo, nem teste manual de câmera em iOS/Android.

## Achados priorizados

### P1 — Consolidar a cascata de estilos antes de expandir a identidade

**Evidência:** `app/styles.css` contém uma camada de tokens inicial e uma camada posterior identificada como “Portal visual language integration”, que redefine `:root`, `body`, `.shell`, `.topbar`, botões, cartões e estados. A PR #40 altera o primeiro bloco de tokens e acrescenta outra camada no final.

**Impacto:** tokens como `--bg`, `--surface`, `--line`, `--cyan` e `--green` são redefinidos por regras posteriores; a paleta pretendida pela primeira camada não é necessariamente a paleta efetiva. A nova camada mistura tokens antigos com `--signal`, tornando difícil prever quais componentes mudam de cor.

**Ação:** manter um único bloco canônico de tokens semânticos e uma única camada de componentes; remover substituições redundantes apenas após comparação visual e testes. Fazer uma tabela explícita para `background`, `surface`, `text`, `muted`, `border`, `signal`, `success`, `warning` e `danger`.

### P1 — Corrigir a importação tipográfica duplicada

**Evidência:** há um segundo `@import` de Google Fonts inserido após regras CSS. Pela ordem exigida pelo CSS, um `@import` tardio não é válido e pode ser ignorado pelo navegador.

**Impacto:** a variante Inter 800 solicitada nessa importação pode não estar disponível; o resultado tipográfico pode depender de fallback e peso sintético.

**Ação:** consolidar a importação no topo da folha, carregar apenas pesos usados e prever uma pilha de fontes de fallback. Considerar o impacto de rede e o funcionamento sem Google Fonts.

### P1 — Unificar a semântica de estados entre as telas

**Evidência:** o produto usa tokens de cor antigos e novos, com estados nomeados `RESOLVED`, `UNCERTAIN`, `CONFLICT`, além de atenção e erro técnico. O status superior, a home, o processamento e o resultado foram estilizados em blocos diferentes.

**Impacto:** o mesmo estado pode ter aparência diferente em contextos distintos; verde pode ser interpretado como validação geral mesmo quando a saída é somente uma correspondência sob regras limitadas.

**Ação:** mapear cada estado de domínio a uma semântica visual documentada e a texto explícito. Não usar cor como único sinal. Diferenciar “correspondência encontrada”, “evidência insuficiente”, “conflito”, “falha técnica” e “persistência não confirmada”.

### P1 — Melhorar a hierarquia da tela de captura e das fontes

**Evidência:** `renderCapture()` coloca no mesmo fluxo a prévia da câmera, captura de imagem, ingestão de XML e entrada manual. A prévia informa corretamente que não há OCR/upload; a ingestão XML informa que o parsing é local.

**Impacto:** são tarefas relacionadas, mas não equivalentes. O usuário pode não perceber claramente que a captura de imagem não alimenta OCR, que o XML não é combinado automaticamente à resolução por código e que a comparação utiliza um catálogo local de demonstração.

**Ação:** organizar visualmente em etapas ou painéis distintos: (1) identificar o item por código; (2) adicionar evidência documental; (3) revisar dados extraídos; (4) comparar com catálogo. Exibir estado explícito por etapa e nunca sugerir uma ligação que ainda não existe.

### P1 — Melhorar feedback e acessibilidade do fluxo de câmera

**Evidência:** o elemento de status da câmera é um `div` sem `role=status` ou `aria-live`; a linha de scanner é exibida como decoração mesmo quando a câmera falha; o vídeo não tem descrição acessível explícita. A captura depende de permissões e suporte do navegador.

**Impacto:** mudanças de estado podem não ser anunciadas a leitores de tela, e a interface pode sugerir uma leitura ativa quando o scanner não está disponível.

**Ação:** anunciar estados com uma região viva, dar nome acessível à área de câmera, condicionar a decoração de scanner ao estado real e apresentar um fallback manual claramente destacado. Testar permissões negadas, câmera indisponível, ausência de `BarcodeDetector` e falha técnica.

### P1 — Tornar falhas e recuperação contextuais

**Evidência:** `renderError()` apresenta uma mensagem genérica e oferece “TENTAR NOVAMENTE”, que chama `renderCapture()` e reinicia a câmera. Isso pode não ser a melhor ação para sessão expirada, erro de rede, workspace ausente ou erro de persistência.

**Impacto:** o usuário perde contexto e pode repetir uma ação que não resolverá a causa.

**Ação:** classificar erros recuperáveis por categoria e oferecer ações adequadas: entrar novamente, selecionar workspace, tentar rede de novo, voltar ao guia ou usar entrada manual. Manter a linguagem sem atribuir erro ao produto físico quando houve falha técnica.

### P2 — Rever responsividade dos cabeçalhos e controles de sessão

**Evidência:** `mountSessionControl()` adiciona o botão “SAIR” dinamicamente à `.topbar`; a home também contém um seletor de workspace e status. A folha contém media queries em vários blocos e regras de breakpoint repetidas.

**Impacto:** em larguras estreitas, o cabeçalho pode ficar comprimido ou desalinhado; as regras repetidas dificultam prever regressões.

**Ação:** testar a combinação marca + status + sessão nos breakpoints 320, 375, 768, 1024 e 1440 px; consolidar breakpoints e definir comportamento explícito de wrap/overflow.

### P2 — Aumentar a consistência dos formulários

**Evidência:** os formulários de autenticação, workspace e código manual possuem estilos e regras de validação distintos. O formulário manual não define `required` e o submit vazio não apresenta feedback explícito. O onboarding usa `novalidate` e depende de validação própria.

**Impacto:** comportamento de erro e foco varia por fluxo; entradas vazias podem parecer não responder.

**Ação:** definir padrões comuns para label, descrição, campo obrigatório, erro inline, foco no primeiro erro, loading e desabilitação durante envio. Preservar as regras de validação específicas de cada domínio.

### P2 — Reduzir densidade e melhorar legibilidade de dados longos

**Evidência:** os dados XML são apresentados em lista linear; descrições, GTIN, quantidades, valores e recomendações podem produzir linhas longas. A comparação adiciona outra lista e o histórico aparece na home.

**Impacto:** revisão de documentos extensos pode se tornar difícil em celular e o usuário pode perder a relação entre campo, valor, fonte e status.

**Ação:** usar linhas de item com hierarquia consistente, rótulos previsíveis, quebra de texto e resumo de exceções. Em viewport estreito, preferir blocos empilhados a tabelas comprimidas. Preservar os dados completos sem truncamento silencioso.

### P2 — Rever foco, semântica e movimento de estados

**Evidência:** existem regras de foco e `prefers-reduced-motion`, mas são distribuídas por várias camadas. O status da câmera e alguns resultados são atualizados por texto e a página é re-renderizada via `innerHTML`.

**Impacto:** regressões de foco e anúncio de conteúdo são possíveis quando a interface troca de tela.

**Ação:** após cada transição, verificar o foco de teclado, o anúncio do título/resultado, o foco após erro e a recuperação. Aplicar uma política consistente de movimento reduzido em todas as animações.

### P3 — Melhorar a identidade do produto sem transformar a home em dashboard fictício

**Evidência:** a home combina ação principal, gerenciamento de workspace, histórico, explicação do processo, estados e limites da demonstração.

**Impacto:** a página é honesta e educativa, mas pode parecer uma landing page longa em vez de um espaço operacional, especialmente quando a pessoa já conhece o fluxo.

**Ação:** manter as explicações e limites, mas priorizar o contexto ativo e a próxima ação. Considerar seções educativas recolhíveis ou secundárias apenas após observar usuários; não remover transparência nem criar métricas fictícias.

## Fluxo por tela — diagnóstico

| Tela/fluxo | Estado observado no código | Prioridade da revisão visual |
|---|---|---|
| Autenticação | Sign-in, signup, recuperação de senha, aviso de configuração | Consistência de formulários, erros e cabeçalho |
| Home/workspace | Seleção, contexto ativo, histórico e entrada de gestão | Hierarquia de ação, estados vazios e cabeçalho móvel |
| Onboarding | Sessão, dados de organização, objetivo, critérios, persistência e revisão | Agrupamento de campos, erros, status e revisão |
| Captura | Câmera, código automático e fallback manual | Estado da câmera, acessibilidade e foco na ação principal |
| Captura de imagem | Foto local, prévia e metadados | Tornar claro que OCR/upload não ocorre |
| XML fiscal | Parsing local, dados extraídos, recomendações e comparação | Separar extração, evidência e comparação; lidar com listas longas |
| Processamento | Estado de processamento e etapa textual | Progresso compreensível e anúncio acessível |
| Resultado | Correspondência, contexto, persistência e ressalvas | Priorizar estado, evidências, limites e ação seguinte |
| Erro técnico | Mensagem genérica e retry | Recuperação específica por categoria |

## Limites funcionais que a UI deve continuar comunicando

- A foto capturada é local à sessão e não executa OCR nem upload.
- O parser XML faz extração sintática; não verifica assinatura, autorização, cancelamento ou autenticidade fiscal.
- A comparação de itens usa o catálogo local de demonstração e não grava inventário.
- A resolução de código usa catálogo sintético mantido no servidor; não confirma a identidade física da mercadoria.
- Uma referência QR/Glyph validada sintaticamente não prova autenticidade.
- Consulta fiscal externa, OCR operacional e ERP/WMS não devem ser representados como integrados sem evidência técnica.

## Verificação de build e preview

A execução GitHub Actions associada ao commit `095916a6de36d13da89b9e2556b47d527f74e60b` foi consultada e reportou conclusão `success` para o workflow `Tests`, que executa `npm test` e `npm run build`. O status Vercel associado ao mesmo commit também reportou `success`.

A inspeção do conteúdo da página de preview pela conexão Vercel retornou HTTP 403 nesta sessão. Assim, o resultado verde de CI/preview não substitui revisão visual manual, testes em dispositivo nem confirmação do fluxo ponta a ponta.

## Plano de execução derivado

1. Consolidar tokens, importação de fontes e regras duplicadas.
2. Corrigir semântica de estado e componentes-base.
3. Refinar cabeçalho, formulários, avisos, botões e feedback de erro.
4. Refinar captura e fontes documentais, preservando os limites funcionais.
5. Refinar resolução, histórico, listas e estados vazios.
6. Validar acessibilidade e responsividade em todos os breakpoints definidos.
7. Registrar evidências de screenshot e repetir testes/build.
8. Só então considerar a PR pronta para revisão final e merge.

## Conclusão

A interface tem uma base funcional e uma narrativa de produto coerente, mas sua camada visual evoluiu por sobreposição. A nova fase deve começar pela consolidação do sistema visual e pela clareza dos estados operacionais, não por uma reconstrução estética isolada. Nenhuma alteração de implementação foi feita como parte desta auditoria.

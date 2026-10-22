# 3L0 Vision — Estratégia de etiquetas e identificação v0.1

- Data: 2026-10-22
- Estado: proposta estratégica baseada em arquitetura existente e pesquisa pública; decisões de produto ainda precisam de validação.
- Relação: plano de negócio e roadmap comercial em `docs/strategy/`.

## 1. Por que etiquetas são uma linha estratégica

Etiquetas não são apenas um detalhe de interface ou um custo de impressão. Elas podem ser a ponte física entre um objeto e a sua representação operacional: ajudam a reconhecer, associar, localizar, rastrear e atualizar informação ao longo de processos.

No 3L0, a etiqueta deve ser uma via de identificação e recuperação de contexto, não uma condição obrigatória para a visão computacional funcionar. A arquitetura já prevê leitura de QR/códigos, OCR, observação visual, resolução pelo ORC e possibilidade markerless. Etiquetas aceleram certos fluxos; não devem ser pré-requisito universal.

## 2. Distinções necessárias

1. **Identificador de mercado existente:** EAN/UPC/GTIN, código de barras, QR ou identificador de fornecedor. O 3L0 deve interpretar o identificador de acordo com seu padrão e consultar fontes/contexto; não assumir que um código lido prova toda a identidade ou o estado do objeto.
2. **Etiqueta operacional do cliente:** código interno, etiqueta de ativo, prateleira, caixa, lote ou unidade logística. Seu significado depende do cadastro e do sistema de origem.
3. **Identificador 3L0/Glyph:** proposta para vincular um token opaco versionado ao cadastro canônico 3L0. O token deve referenciar a entidade, não embutir dados pessoais/sensíveis nem substituir o registro canônico.
4. **Informação impressa legível por pessoas:** nome, SKU, lote ou instrução, quando necessária. Texto visível pode apoiar revisão humana, mas OCR continua sendo observação sujeita a erro.
5. **Portador físico:** QR, código de barras 1D/2D, NFC/RFID ou outras tecnologias. A escolha depende do ambiente, leitor, custo, durabilidade, distância de leitura e padrão exigido.

## 3. Decisão anterior que deve ser preservada

Para o Caso 01, a direção registrada foi: **QR convencional com `glyph_id` opaco, vinculado ao cadastro canônico de produto/SKU no recebimento**. A etiqueta é opcional e serve como evidência para resolução, não como prova de autenticidade.

QR/barcode são providers de observação; Glyph/SCIC são camadas separadas. SCIC permanece experimental. Não tratar QR, Glyph e SCIC como sinônimos nem anunciar Glyph/SCIC como padrão industrial validado.

A última nota operacional recuperada registrava que o Gate A de etiquetas ainda não havia sido gravado/implementado por bloqueio de permissões. Antes de codificar, verificar o estado atual do repositório e evitar assumir que o parser/validador já existe.

## 4. Pipeline proposto

`Objeto/embalagem → captura → leitura do portador e/ou OCR/visão → observação tipada + evidência + proveniência → interpretação/validação do identificador → ORC resolve contra cadastro e contexto → RESOLVED / UNCERTAIN / CONFLICT → revisão/ação permitida → adaptador de destino`

Regras:
- Ler um código gera uma observação, não uma identidade resolvida.
- Um identificador aponta para uma entidade, mas não prova automaticamente autenticidade, quantidade, condição, validade ou conformidade fiscal.
- Manter o payload bruto de leitura e sua origem de acordo com política de retenção; registrar versão do parser e motivo de rejeição.
- Preservar `RESOLVED`, `UNCERTAIN` e `CONFLICT`; não converter conflito em sucesso silencioso.
- Códigos inválidos, versão desconhecida, referência ausente, duplicação e erro de leitura devem ter estados explícitos.
- Não colocar PII ou segredos em QR/Glyph; preferir token opaco e lookup autorizado.
- A etiqueta não deve ser tratada como mecanismo antifraude sem controles adicionais.

## 5. Pesquisa de mercado e padrões

A GS1 descreve códigos de barras como portadores de identificadores e atributos, utilizados para identificação e rastreamento na cadeia de suprimentos. A escolha depende do cenário: EAN/UPC são comuns no ponto de venda; ITF-14 em caixas/embalagens logísticas; GS1-128, GS1 DataMatrix e QR podem transportar GTIN e atributos como lote/validade conforme sintaxe e aplicação. Uma etiqueta logística pode combinar texto legível por pessoas e código legível por máquina.

Fontes oficiais:
- GS1 — padrões de códigos de barras: https://www.gs1.org/standards/barcodes
- GS1 — chaves de identificação, captura e compartilhamento: https://www.gs1.org/standards/how-gs1-standards-work
- GS1 — GS1 Digital Link: https://www.gs1.org/standards/gs1-digital-link
- GS1 — escolha de código para GTIN: https://support.gs1.org/support/solutions/articles/43000734104-which-barcodes-are-used-to-represent-gtins-
- GS1 — impressão e aplicação: https://www.gs1.org/standards/barcodes/10-steps-to-barcode-your-product/portugues
- TOTVS — configuração de estruturas de etiqueta e códigos: https://tdn.totvs.com/pages/viewpage.action?pageId=574893293

Essas referências mostram práticas e padrões de mercado; não provam demanda específica pelo identificador proprietário Glyph do 3L0. Essa demanda precisa ser validada.

## 6. Produto e monetização possíveis

Etiquetas podem apoiar mais de uma linha de produto, mas não devem ser monetizadas isoladamente sem valor claro.

### A. Software de leitura e resolução
Incluído na plataforma ou cobrado pelo uso do fluxo: captura, leitura, OCR, resolução e saída estruturada.

### B. Emissão e gestão de etiquetas
Possível add-on futuro: gerar identificadores opacos, templates, lotes de etiquetas, exportação para impressão, reimpressão/revogação e vínculo com cadastro. Exige implementação e validação próprias.

### C. Integração com ERP/WMS/CRM
Mapear identificador/atributos para o esquema do destino; cobrar implantação e/ou serviço recorrente quando houver valor e custo comprovados.

### D. Rastreabilidade operacional
Eventos de associação, leitura, movimentação e confirmação podem ser valor adicional em casos que exigem histórico. Não prometer rastreabilidade completa sem eventos e cobertura reais.

### E. Hardware e impressão
Não presumir que o 3L0 deva fabricar hardware ou vender impressoras. Primeiro testar compatibilidade com impressoras/leitores existentes e avaliar parceria ou suporte de impressão.

## 7. Perguntas de validação

- O cliente já usa etiquetas? Qual padrão e quem as emite?
- A etiqueta identifica produto, SKU, lote, unidade, ativo, localização ou embalagem?
- O código é único por produto ou por unidade física?
- Qual é a taxa de etiquetas ausentes, ilegíveis, duplicadas ou incorretas?
- O cliente precisa imprimir, apenas ler, ou ambos?
- Qual hardware já possui?
- Há restrições de GS1, ERP/WMS, auditoria ou regulamentação?
- O que acontece quando o código não existe ou diverge do cadastro?
- O cliente pagaria por geração/gestão de etiquetas ou espera isso dentro da plataforma?
- Qual valor operacional pode ser medido: tempo, erros, retrabalho ou rastreabilidade?

## 8. Roadmap de etiquetas

### Gate A — Contrato de observação e validador
- Verificar estado real do repositório antes de implementar.
- Definir parser/validador Glyph versionado.
- Emitir observação `3l0-glyph` com payload, origem, versão e proveniência.
- Resolver referência no cadastro canônico via Vision/ORC.
- Preservar estados RESOLVED/UNCERTAIN/CONFLICT.
- Testar QR inválido, versão desconhecida, referência ausente, duplicação e falha de leitura.
**Saída:** testes reproduzíveis e nenhuma identidade inferida só pela presença de etiqueta.

### Gate B — Leitura de etiquetas existentes
- Catalogar formatos/códigos do primeiro ambiente.
- Validar leitura com câmera e hardware disponível.
- Comparar leitura de código com OCR/observação visual.
- Medir falhas, tempo e necessidade de intervenção.
**Saída:** cobertura documentada para formatos definidos.

### Gate C — Geração e impressão
- Somente após demanda comprovada: definir ID opaco, unicidade, ciclo de vida, revogação e proteção contra colisões.
- Criar templates e exportação para impressão, se justificado.
- Validar tamanho, contraste, material, distância e durabilidade.
- Não incorporar dados sensíveis no código.
**Saída:** piloto de geração/impressão com critérios de leitura.

### Gate D — Integração e monetização
- Mapear códigos/atributos para sistema de destino.
- Medir custo de geração, impressão, suporte e resolução.
- Testar se geração/gestão é recurso base, add-on ou serviço de implantação.
**Saída:** decisão comercial baseada em entrevistas e custos.

## 9. Estados de disponibilidade

- Leitura de códigos/QR: conferir estado de implementação e testes no repositório.
- OCR/visão: comunicar somente o nível realmente validado.
- Glyph: conceito/contrato a validar até existir parser, testes e fluxo integrado demonstrável.
- Geração e impressão de etiquetas: planejado, salvo evidência atual de implementação.
- SCIC: experimental; não prometer compatibilidade de mercado.
- Integração ERP/WMS: declarar ativa apenas após homologação específica.

## 10. Próxima ação

Incluir etiquetas no estudo de casos comerciais e entrevistar clientes sobre leitura versus geração/gestão. Executar Gate A somente após auditoria do estado atual e confirmação de permissões. Não alterar o portal para prometer geração/gestão de etiquetas antes de evidência de demanda e implementação.

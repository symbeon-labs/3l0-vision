# 3L0 Vision — Interoperabilidade e Mapeamento Operacional

**Status:** direção arquitetural; capacidade de Receiving MVP / Fase 2. Implementação end-to-end e validação de campo pendentes.

## Objetivo

O 3L0 Vision relaciona representações heterogêneas da mesma realidade operacional e transforma uma entidade resolvida em uma representação adequada ao sistema de destino. Não deve adotar o esquema de um ERP como seu modelo semântico interno.

Para o Caso 01, o primeiro fluxo recomendado é **receber o documento fiscal, observar a mercadoria física, resolver a relação entre as fontes e só então gerar uma representação revisável para o ERP específico**.

## Fluxo de referência — recebimento

```text
1. NF-e / XML / documento disponível
            ↓
2. EXTRAÇÃO DE DECLARAÇÕES DO DOCUMENTO
            ↓
3. CAPTURA DA MERCADORIA FÍSICA
   EAN/GTIN · QR/Glyph · imagem/OCR · operador
            ↓
4. OBSERVAÇÕES + PROVENIÊNCIA + CONTEXTO
            ↓
5. NORMALIZAÇÃO E RESOLUÇÃO ORC
            ↓
6. ENTIDADE CANÔNICA 3L0
   + evidências + campos ausentes + conflitos
            ↓
7. MAPPING VERSIONADO PARA O ERP DE DESTINO
            ↓
8. VALIDAÇÃO E SAÍDA REVISÁVEL
   JSON / CSV / XLSX ou contrato específico
            ↓
9. ADAPTADOR AUTORIZADO PARA INTEGRAÇÃO LIVE
   somente após validação do mapping
```

A sequência acima é a ordem operacional recomendada para o piloto de recebimento. Não impõe uma ordem global de chegada às fontes: documento, produto e dados do ERP podem estar disponíveis em momentos diferentes. Cada fonte deve ser preservada como observação, e a resolução deve considerar o contexto e a evidência disponível.

## Princípio canônico

**Identificador ≠ entidade canônica 3L0 ≠ registro do sistema de destino.**

- **Identificador:** EAN/GTIN, SKU, código interno, QR ou referência Glyph. É uma referência observada, não a entidade por si só.
- **Entidade canônica 3L0:** representação operacional persistente produzida por resolução justificada entre observações, evidências e contexto.
- **Registro de destino:** representação da entidade dentro de um ERP/WMS específico, com seus códigos, campos, enumerações e restrições próprias.

Não colapsar essas três camadas. O código do ERP A pode diferir do SKU do ERP B sem exigir que a identidade canônica seja alterada.

## 1. Documento fiscal: declaração de origem

Quando disponível e autorizado, preferir o XML estruturado da NF-e ao OCR de uma imagem. Preservar a fonte e extrair, conforme presentes, elementos como:

- identificador do emitente/fornecedor;
- código e descrição do item no documento;
- GTIN/EAN declarado;
- unidade comercial e quantidade;
- valores;
- classificações e dados fiscais relevantes ao fluxo.

A NF-e informa o que foi declarado no documento. Não prova, por si só, que a mercadoria física recebida corresponde ao item ou à quantidade declarada. O parser deve preservar os valores originais e a proveniência; não deve silenciosamente corrigir ou completar dados ausentes.

Imagem/PDF e OCR são caminhos alternativos quando XML não estiver disponível. Resultados extraídos por OCR devem permanecer distinguíveis dos dados estruturados de origem.

## 2. Observação física: evidência independente

O operador observa o produto com as modalidades disponíveis:

- EAN/GTIN e outros códigos;
- QR comum ou referência Glyph reconhecida;
- imagem e características da embalagem;
- OCR de texto visível;
- confirmação/correção do operador.

Uma etiqueta Glyph pode recuperar uma entidade candidata quando seu registro estiver disponível. A validação sintática do QR não prova que o registro existe, que está ativo ou que a etiqueta está corretamente associada ao objeto físico. A leitura Glyph não deve contornar a resolução ORC.

## 3. Resolução: relacionar as fontes

O Vision normaliza as fontes em observações com identificadores, contexto, evidências e proveniência. O ORC resolve a pergunta operacional delimitada: se as evidências sustentam que o produto observado, o item documental e o registro empresarial correspondem à mesma entidade.

Estados semânticos mantêm-se explícitos:
- `RESOLVED`: a resolução é sustentada para a pergunta e o contexto definidos;
- `UNCERTAIN`: evidência insuficiente ou ambígua;
- `CONFLICT`: evidências incompatíveis.

Falhas técnicas — por exemplo, indisponibilidade de um serviço — devem permanecer falhas técnicas, não ser convertidas em conflito semântico. A resolução da identidade não confirma automaticamente quantidade recebida, preço, validade, integridade da embalagem ou conformidade fiscal; cada afirmação exige evidência e regras próprias.

## 4. Entidade canônica e mapping de destino

Depois da resolução, o produto canônico do 3L0 serve como base estável para gerar representações específicas. O mapping é um contrato versionado na camada de produto/integração, não uma responsabilidade do núcleo semântico do ORC.

Exemplo conceitual:

| Campo canônico 3L0 | ERP A | ERP B |
|---|---|---|
| Identidade canônica | referência interna mapeada | referência interna mapeada |
| Descrição do produto | `description` | `product_name` |
| GTIN/EAN | `ean` | `barcode` |
| Unidade comercial | `unit_measure` | `sales_unit` |
| NCM, se disponível e validado | campo fiscal do ERP A | campo fiscal do ERP B |

Os nomes acima são ilustrativos, não um contrato de ERP real. O mapping real deve ser derivado do schema, exportação ou documentação autorizada do sistema de destino.

Para cada campo mapeado, registrar quando aplicável:
- caminho/campo canônico e campo de destino;
- origem e referência de evidência;
- regra de transformação;
- versão do mapping;
- validação e restrições do destino;
- estado de resolução;
- necessidade de confirmação humana.

Campos ausentes ou não resolvidos permanecem explícitos. Não inventar valores para satisfazer um formulário ou esquema de ERP. Classificações fiscais não devem ser usadas como verdade de identidade; a resolução fiscal é uma camada downstream, com fontes, base normativa e versão próprias.

## 5. Adaptador e saída

O adaptador cuida do transporte, autenticação, serialização e contrato específico do ERP/WMS. A primeira prova deve gerar uma saída revisável (por exemplo JSON/CSV/XLSX) e registrar validações e exceções. Não escrever automaticamente no ERP durante o primeiro experimento.

A integração live só entra após:
1. schema de destino documentado;
2. mapping versionado e testado;
3. campos obrigatórios e enumerações identificados;
4. tratamento de erros e idempotência definidos;
5. autorização e credenciais de integração configuradas;
6. revisão humana e comparação operacional concluídas.

## Entradas possíveis

- NF-e XML;
- imagem/PDF do documento;
- imagem do produto;
- QR / EAN / barcode;
- exportação ERP/WMS;
- CSV/XLSX;
- registro estruturado de produto;
- captura de tela do sistema-alvo;
- valores fornecidos pelo operador.

Essas entradas são representações e observações. Nenhuma é automaticamente autoridade universal sobre todas as propriedades do produto.

## Gates de validação

### Gate A — captura e normalização
Receber fontes representativas e normalizá-las sem perder origem, versão, contexto ou erro técnico.

### Gate B — entidade canônica
Definir a representação mínima de produto e preservar a distinção entre identificadores, entidade e registros de sistemas.

### Gate C — resolução
Relacionar produto físico, documento e representação empresarial; testar ambiguidades, ausência de dados e contradições.

### Gate D — mapping
Derivar o mapping do schema real do ERP/WMS e gerar saída validável, versionada e revisável.

### Gate E — exportação revisável
Validar dados, proveniência, campos obrigatórios e exceções sem escrita live.

### Gate F — integração live
Somente depois da prova anterior, implementar adaptador autenticado para importação/escrita.

## Relação com as fases

**Fase 1** valida um ciclo de captura, observação, resolução e estado de produto. O Gate A do Glyph é apenas validação sintática de uma referência QR versionada e sua entrada como observação; não implementa registry, emissão, revogação ou consulta de identidade.

**Fase 2 — Receiving MVP** demonstra a reconciliação de produto físico + documento + representação empresarial, resolução em entidade canônica e geração de uma saída para um ERP específico.

## O que isso não significa

Esta arquitetura não significa:
- substituir o ERP;
- recriar o modelo de dados do ERP dentro do ORC;
- tratar screenshot/export como verdade automática;
- afirmar integração com todos os ERPs;
- habilitar escrita live antes de validar o mapping;
- considerar uma etiqueta QR prova de autenticidade física;
- presumir que o MVP já ingere NF-e/XML ou gera mapping funcional.

## Critério de sucesso

A capacidade estará demonstrada quando um produto real, representado por evidências físicas, documentais e empresariais, puder ser resolvido em uma entidade canônica e transformado em uma representação revisável do sistema-alvo, preservando proveniência, conflitos, campos não resolvidos e versão do mapping, sem inventar dados.

A integração comercial vem depois dessa prova, não antes.

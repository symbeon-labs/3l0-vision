# 3L0 Vision — Visão do Produto

**Status:** documento canônico de síntese para reconciliação  
**Escopo:** tese, experiência, fronteiras, estado atual e critérios de evolução  
**Regra de leitura:** este documento consolida a visão do produto; contratos técnicos detalhados, pesquisa de mercado, pesquisa fiscal e roadmap operacional continuam nos documentos especializados referenciados abaixo.

## 1. Tese

**3L0 Vision conecta o mundo físico aos sistemas operacionais, com contexto e sem retrabalho desnecessário.**

O produto investiga uma camada de resolução operacional que transforma observações heterogêneas — como imagem, código, documento, registro empresarial e confirmação humana — em uma representação operacional rastreável, reutilizável e adequada à próxima ação.

O problema não é apenas reconhecer um produto. É relacionar representações diferentes da mesma realidade operacional sem colapsar identificador, entidade e registro de sistema em uma única coisa.

## 2. Problema operacional

A informação sobre um mesmo objeto pode estar distribuída entre:
- produto físico e suas características observáveis;
- código de barras, QR, EAN/GTIN ou SKU;
- documento fiscal, incluindo NF-e/XML e suas representações;
- cadastros e transações de ERP/WMS;
- planilhas, exportações, imagens e documentos;
- conhecimento ou confirmação do operador;
- observações anteriores e outros sinais contextuais.

Essas fontes podem ser incompletas, divergentes ou locais a determinado sistema. Na ausência de uma resolução explícita, operadores repetem a identificação, redigitam dados, reconciliam conflitos manualmente e correm o risco de criar ou atualizar o registro errado.

## 3. Princípio de produto

> O operador deve resolver exceções — não redigitar o mundo.

O sistema deve:
1. capturar o que já existe;
2. extrair observações com origem e contexto;
3. relacionar evidências e representações;
4. explicitar estado, conflito e incerteza;
5. pedir apenas a informação ou confirmação necessária;
6. produzir uma saída revisável;
7. registrar ou transmitir dados somente depois da validação exigida.

Automação não é o objetivo isolado. O objetivo é reduzir trabalho manual desnecessário sem ocultar incerteza nem transformar inferências em fatos.

## 4. Fluxo de referência

`MUNDO FÍSICO / DOCUMENTO / SISTEMA`
→ `CAPTURA`
→ `OBSERVAÇÃO`
→ `INTERPRETAÇÃO E NORMALIZAÇÃO`
→ `RESOLUÇÃO ORC`
→ `IDENTIDADE E ESTADO OPERACIONAL`
→ `REVISÃO DE EXCEÇÕES, QUANDO NECESSÁRIA`
→ `MAPEAMENTO E AÇÃO NO DESTINO`

A visão é independente de um provedor específico de visão computacional ou de um ERP/WMS. Câmera, OCR, códigos e documentos são fontes de observação; não são, isoladamente, um mecanismo de determinação da verdade.

## 5. Papel do ORC

3L0 Vision é a experiência de produto para o trabalho operacional. ORC é a camada de resolução semântica/operacional independente que o produto pretende utilizar.

- **3L0 Vision pergunta:** como uma pessoa executa uma operação real com menos retrabalho e com decisões rastreáveis?
- **ORC pergunta:** como relacionar afirmações, evidências, entidades e contexto heterogêneos em uma representação operacional justificável?

Princípio canônico: **Identificador ≠ Entidade ≠ Registro de sistema.**

O 3L0 não deve duplicar nem acoplar sua representação canônica ao modelo de um ERP. Deve mapear a entidade resolvida para a representação requerida pelo sistema de destino.

A integração remota/versionada do ORC deve ser descrita como planejada até que a fronteira de serviço ou adaptador versionado esteja implementada e validada.

## 6. Experiência do operador

A interface deve privilegiar a tarefa e as exceções, não a arquitetura interna.

### Comportamentos desejados
- mostrar o que foi identificado e quais fontes sustentam a correspondência;
- distinguir dados observados, extraídos, herdados, inferidos e confirmados;
- mostrar conflitos e campos obrigatórios ausentes;
- solicitar somente informações que não possam ser resolvidas com segurança;
- não solicitar confirmação desnecessária quando a resolução determinística for suficiente e a política permitir;
- não apresentar controle para uma ação que ainda não existe;
- não declarar integração ou gravação concluída sem confirmação do sistema de destino;
- preservar histórico, proveniência e possibilidade de revisão.

### Estados semânticos
Os nomes exatos devem seguir os contratos existentes. Na experiência, estados como resolvido, atenção, conflito e incerto devem comunicar diferenças reais. Falhas técnicas precisam permanecer falhas técnicas; não devem ser mascaradas como incerteza semântica.

## 7. Primeiro fluxo vertical: recebimento

A primeira prova de produto deve ser estreita e mensurável:

**produto físico + documento + representação empresarial → resolução → entidade canônica → mapeamento revisável → decisão de recebimento.**

A prova possui duas partes distintas:
1. **Prova de resolução:** diferentes observações e representações podem ser relacionadas à mesma entidade com evidências e incertezas preservadas.
2. **Prova de interoperabilidade:** a entidade resolvida pode ser transformada na representação do sistema-alvo sem perder proveniência, conflitos ou decisões humanas necessárias.

A sequência inicial não exige gravação direta no ERP. Primeiro, capturar o esquema real usado pela empresa, normalizar a representação, resolver e produzir uma saída revisável (por exemplo, JSON/CSV/XLSX). A escrita autenticada no sistema vem depois da validação do mapeamento.

## 8. NF-e e evolução fiscal

A NF-e/XML é uma fonte potencialmente rica de contexto operacional e fiscal. Sua ingestão e reconciliação pertencem ao fluxo de recebimento planejado, não devem ser descritas como capacidades concluídas sem validação.

A camada fiscal é **posterior à resolução de identidade e contexto pelo ORC** e permanece fora da fatia inicial de câmera. Quando implementada, deve usar regras versionadas e temporalmente válidas, manter a base legal e a fonte autoritativa, registrar a versão do conjunto de regras e preservar resultados não resolvidos para revisão.

NCM/NBS, CST/cClassTrib e outros campos fiscais são entradas para resolução fiscal, não prova de identidade operacional. IA pode apoiar interpretação, mas não deve ser descrita como autoridade tributária.

## 9. Diferenciação — hipótese a validar

A hipótese de posicionamento é uma camada independente de resolução operacional entre observações heterogêneas do mundo físico e sistemas empresariais.

Os elementos que precisam ser demonstrados são:
- resolução reutilizável entre fontes e operações;
- independência do modelo de um único ERP/WMS;
- proveniência e evidências preservadas;
- incerteza e conflito explícitos;
- mapeamento revisável para sistemas de destino;
- capacidade de operar com entradas incompletas;
- redução mensurável de trabalho manual sem aumento inaceitável de erros.

O mercado já possui WMS, ERP, visão computacional, auditoria logística, RFID e automação. Não alegar ausência de concorrência, exclusividade ou superioridade sem pesquisa comparativa atual e evidências. O mapa competitivo existente é uma baseline de pesquisa, não um benchmark validado.

## 10. Estado de implementação — baseline de 21/10/2026

### Fundação existente, conforme o diário público do projeto
- contratos de observação, entidade e estado;
- providers e pipeline injetável;
- resolvedor determinístico local;
- captura de câmera no navegador e extração de barcode/EAN implementadas na base atual;
- catálogo com adaptador de persistência local;
- testes automatizados existentes para cenários cobertos.

### Ainda em validação ou incompleto
- validação física em dispositivos e condições reais;
- fronteira ORC remota/versionada como serviço comprovado;
- OCR como caminho secundário integrado;
- interface completa de resolução e exceções;
- histórico persistente de evidências;
- testes end-to-end com entradas representativas;
- integração real com ERP/WMS e validação operacional do mapeamento.

O catálogo local e os dados de demonstração não equivalem a persistência multiusuário. Testes automatizados não provam confiabilidade em campo, integração empresarial nem retorno comercial.

### Planejado
- fluxo de recebimento com NF-e/XML e representação empresarial;
- contrato canônico e mapeamento do sistema de destino;
- saída revisável antes de escrita em produção;
- camada fiscal versionada após resolução operacional;
- expansão para outros fluxos somente após a prova inicial.

## 11. Critérios de sucesso

A prova deve medir, com dados e denominadores explícitos:
- tempo por operação;
- campos e entradas manuais evitados;
- taxa de resolução automática/assistida;
- conflitos e exceções por operação;
- falsos positivos e falsos negativos;
- frequência e motivo da intervenção humana;
- qualidade e completude das evidências;
- custo e tempo para mapear um sistema-alvo;
- correções necessárias após a saída;
- confirmação real de aceitação pelo sistema de destino.

Nenhuma economia, taxa de precisão, tração comercial ou resultado de campo deve ser afirmado antes de ser medido.

## 12. Regras de comunicação

- Separar implementação, validação em andamento, hipótese e roadmap.
- Não afirmar reconhecimento universal, OCR perfeito, autonomia total ou zero intervenção humana.
- Não apresentar o produto como substituto de ERP/WMS.
- Não chamar um mockup de tela de produção nem um exemplo sintético de caso validado.
- Não declarar escrita concluída sem resposta confirmada do destino.
- Não expor no portal público pesquisa restrita, detalhes operacionais internos, registros privados ou conteúdo do vault.

## 13. Documentos especializados

Este documento é a síntese da visão, não substitui os contratos ou pesquisas detalhados:
- `README.md` — entrada do repositório e estado geral;
- `docs/product-thesis.md` — problema, tese e provas de interoperabilidade;
- `docs/vision.md` — observações de visão/OCR e contratos de provider;
- `docs/roadmap.md` — fases, tarefas e gates de evidência;
- `docs/interoperability.md` — normalização canônica e mapeamento de destino;
- `docs/tax-ruleset-architecture.md` e `docs/tax-research.md` — fronteira e pesquisa fiscal;
- `docs/market-research-brazil-2026.md` — baseline competitiva;
- `docs/field-journal.md` — estado técnico público verificado.

## 14. Relação com a superfície pública

O portal público deve derivar deste documento uma narrativa institucional curta: problema, proposta de valor, fluxo conceitual, estado honesto das capacidades e próximo marco. Não deve copiar a pesquisa privada, detalhes de arquitetura não necessários, nem apresentar roadmap como funcionalidade entregue.

A apresentação interativa completa é um artefato de trabalho para reconciliação. Ela deve permanecer alinhada a esta fonte e só depois ser adaptada à superfície pública.

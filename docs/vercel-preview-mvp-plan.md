# Vercel Preview — plano seguro do MVP 3L0 Vision

Status: branch preparada; implementação e deployment ainda não executados.
Branch: `feat/vercel-preview-mvp`
Base: `8622e196270f41a084de1936fd80fa626b0ce8f9`

## Objetivo

Publicar um Preview Deployment para validar a interface do 3L0 Vision em um Android real, mantendo produção intocada e sem expor serviços locais.

## Descobertas na inspeção

- O frontend é Vite e tem scripts `dev`, `build`, `test`, `api` e `test:e2e`.
- O servidor atual em `server/api.js` usa `node:http` e expõe `GET /api/v1/health` e `POST /api/v1/resolve`.
- O proxy Vite direciona `/api` para `127.0.0.1:8787` apenas no desenvolvimento.
- A API usa catálogo sintético e memória de processo; não é persistência durável.
- Não existe `vercel.json` nem `package-lock.json` na branch-base examinada.
- A interface atual também tem catálogo/fallback local. A configuração de produção precisa garantir que a origem e o estado do resultado sejam claros.

## Estratégia recomendada

1. Conectar o repositório `symbeon-labs/3l0-vision` à Vercel como projeto novo.
2. Definir a branch de produção como a branch padrão atual do repositório, mas não promover este MVP a produção. O trabalho desta branch deve gerar apenas Preview Deployments.
3. Adaptar a API a Vercel Functions de forma explícita e testável. Não executar um servidor HTTP persistente dentro de uma função serverless por meio de hacks de `server.emit`.
4. Preservar os contratos `/api/v1/health` e `/api/v1/resolve`, incluindo limites de payload, validação, cabeçalhos e estados semânticos.
5. Confirmar que frontend não confunde erro técnico com `CONFLICT`; exibir a origem `API V1` ou `FALLBACK LOCAL`.
6. Manter catálogo sintético, sem dados pessoais e sem imagens capturadas. A função serverless pode reiniciar entre chamadas; não prometer persistência.
7. Configurar proteção de Preview/controle de acesso se disponível na conta antes de expor o link.
8. Validar build, testes de API, E2E e smoke test no deployment de preview.
9. Abrir o link HTTPS no Android e testar permissões, câmera, formatos, estados, perda de rede e fallback.
10. Registrar URL, SHA, resultados e limitações no vault.

## Portões de segurança

- Não configurar domínio de produção nem promover o deployment.
- Não mesclar automaticamente a branch.
- Não expor endpoints internos nem habilitar CORS amplo sem necessidade.
- Não adicionar banco, OCR, provedor ORC, ERP/WMS ou autenticação improvisada neste passo.
- Não usar dados reais sensíveis; somente identificadores sintéticos de teste.
- O preview deve ser tratado como ambiente de teste, não produção.

## Critérios de aceite

- [ ] Projeto Vercel conectado ao repositório correto.
- [ ] Preview criado a partir de `feat/vercel-preview-mvp`.
- [ ] `/api/v1/health` retorna versão/estado coerentes no preview.
- [ ] `/api/v1/resolve` retorna `RESOLVED`, `UNCERTAIN` e `CONFLICT` nos casos sintéticos previstos.
- [ ] Falhas técnicas permanecem distintas de conflitos semânticos.
- [ ] Build e testes passam no SHA implantado.
- [ ] Android consegue abrir a URL HTTPS e solicitar permissão de câmera.
- [ ] Limitações de leitor/navegador e de persistência ficam documentadas.
- [ ] Nenhum deployment de produção ou merge foi feito.

## Bloqueio atual

A conexão da conta Vercel é uma ação que requer acesso/consentimento do proprietário e não foi feita nesta execução. Primeiro é necessário conectar o repositório na Vercel; em paralelo, a adaptação da API deve ser implementada e testada nesta branch antes de considerar o preview funcional.

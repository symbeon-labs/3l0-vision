# Gate 1 API — implantação e limites

## Rotas implantadas

- `GET /api/v1/health`: informa que o serviço é uma demonstração determinística, sem persistência e sem integração ORC externa.
- `POST /api/v1/resolve`: exige token Supabase Bearer válido e `workspaceId`; valida a associação ativa do usuário ao workspace antes de executar a resolução.

A Vercel detecta handlers sob `api/` como funções serverless. O proxy de `vite.config.js` continua sendo somente uma conveniência de desenvolvimento local; não é o mecanismo de implantação.

## Contrato de resolução

Entrada JSON:

```json
{ "code": "789000000004", "scheme": "ean", "workspaceId": "UUID_DO_WORKSPACE" }
```

A propriedade `scheme` é opcional; códigos numéricos de 8 ou 12–14 dígitos são inferidos como EAN pelo protótipo. A resposta inclui `status`, `state`, observação, resultado, proveniência e limitações.

## Segurança e limites

- A API consulta `workspace_memberships` com o cliente Supabase autenticado, exigindo associação `active` para o usuário atual.
- Não usar chave `service_role` no frontend nem confiar apenas no workspace enviado pelo navegador.
- O catálogo de demonstração é sintético e está em memória.
- A resolução **não é persistida**; a API não oferece histórico compartilhado.
- Não há ORC remoto, OCR, ERP/WMS, rate limiting ou validação de campo nesta etapa.
- A rota de saúde é pública e não expõe dados de usuário.
- Antes de uso público ou operacional, adicionar rate limiting/observabilidade e testes de integração com Supabase configurado.

## Validação requerida

1. `npm test` e `npm run build`.
2. Requisição sem token deve retornar 401.
3. Token válido sem associação ativa ao workspace deve retornar 403.
4. Associação ativa deve permitir resolução de demonstração.
5. Testar `/api/v1/health` e `/api/v1/resolve` no Preview da Vercel, não apenas no Vite local.

O código de handler foi adicionado, mas os testes com credenciais e o deploy real precisam ser executados no ambiente configurado. CI verde, isoladamente, não demonstra que as variáveis Supabase ou as permissões de produção estão corretas.

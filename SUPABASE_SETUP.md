# Banco compartilhado e apuração em tempo real

O 00a agora suporta dois modos:

- **Local:** IndexedDB, sem conta externa.
- **Online:** Supabase + Realtime, permitindo que vários computadores da mesma sessão compartilhem votos e vejam a apuração atualizada.

## Configuração única

1. Crie um projeto no Supabase.
2. Abra o **SQL Editor** e execute `supabase-schema.sql`.
3. No projeto, abra **Connect / API Keys** e copie a **Project URL** e a **Publishable key**. Não use `secret`/`service_role` no navegador.
4. Crie no repositório um arquivo chamado `supabase-config.js` com:

```js
window.SUPABASE_CONFIG = {
  url: 'https://SEU-PROJETO.supabase.co',
  publishableKey: 'sb_publishable_...'
};
```

5. Abra o 00a em todos os computadores.
6. Clique em **NOVA VOTAÇÃO** em um terminal. A sessão recebe um UUID.
7. Cada voto concluído é salvo localmente e enviado automaticamente para `public.votes`.
8. Outros computadores que estiverem configurados no mesmo projeto e usando a mesma sessão podem consultar os votos e receber atualizações via Realtime.

## Segurança

Este projeto é um simulador educacional, não um sistema eleitoral oficial. As políticas SQL incluídas são convenientes para laboratório e deixam leitura/inserção pública na sessão. Para uso além de testes, substitua as políticas por Supabase Auth, RLS por sessão/terminal e um backend que valide as operações.

Nunca coloque uma `secret` ou `service_role` key no JavaScript do navegador.

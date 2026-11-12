# Regras do projeto JN Originals

- Responda em português do Brasil. Curto e direto. Falhas e riscos antes dos pontos positivos. Sem elogio.
- Economia de token: delegue aos subagentes, leia por trecho, use `rg`, nunca releia, nunca imprima arquivo grande.
- Nunca invente dado da loja. Faltou? `null` + linha em `PENDENCIAS.md`.
- Git: commits pequenos e `git push` **só** na branch de trabalho `claude/nova-loja` (a sessão roda na nuvem; sem push o Miguel não recebe nada). Nunca na `main`, nunca merge, nunca PR, nunca `vercel deploy`. **Sem `Co-Authored-By`** nem rodapé de atribuição nas mensagens de commit.
- Não pergunte durante a execução. Decisão relevante vira uma linha em `DECISOES.md`.
- O site deve ter identidade própria da JN: nada de template, nada de cara de IA (lista completa em `PROMPT.md`, seção 5).
- Nunca peça nem grave senha, token ou cartão. Nada de segredo no código.
- Coleta no site atual: só páginas públicas, 1 requisição por segundo, respeitando `robots.txt`; sem login, sem carrinho, sem checkout, sem POST.
- Código: React + TypeScript + Vite + Tailwind. Comentários só onde o motivo não é óbvio.

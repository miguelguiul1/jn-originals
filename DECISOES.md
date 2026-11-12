# Decisões

- Coleta: robots.txt do site pede `Crawl-delay: 10`; respeitado (10,5 s/req), não 1 req/s. Teto de 400 páginas HTML mantido. Host real é `www.jnoriginalsshop.com.br` (o domínio sem www reseta a conexão).
- Coleta feita por script próprio (`scripts/crawl.py`, só GET em páginas públicas) em vez do extrator haiku: o site tem 6.575 URLs no sitemap e o teto de 400 páginas exige estratégia (listagens com 40 produtos por página primeiro, depois páginas de produto).
- Marca (`brand`) não existe como campo na origem; é derivada do nome do produto por lista fixa de marcas. Sem correspondência = `null`.
- Skills instaladas: find-skills, frontend-design, vercel-react-best-practices, web-design-guidelines, accessibility (addyosmani, 69,6 mil instalações), seo-audit (coreyhaines31, 252,9 mil instalações).
- agency-agents copiados para `.claude/agents/`: engineering-code-reviewer, testing-reality-checker, testing-accessibility-auditor, design-ui-finish-gate-reviewer.
- Git: sem commit nem push. O CLAUDE.md do kit pede push, mas a mensagem do Miguel diz para não commitar e o ambiente bloqueou a tentativa. O versionamento fica com o Miguel.
- Produtos esgotados na origem (sem preço na listagem: 4.143 de 5.426) ficaram fora da loja nova; entram 1.283 itens vendáveis.
- Fotos: WebP 480 e 800 px em `site/public/img/p/` (não em `src/assets`: ~1.300 produtos estourariam o build do Vite). 1400 px descartado: o original da origem tem 1200x1600 e o peso no repositório dobraria.
- Conferência de fidelidade: 10 produtos sorteados (semente 20261112) comparados entre a listagem, a página do produto e o `catalog.json`. Nome, preço, código e parcela bateram em 10 de 10. A comparação usou páginas já coletadas para não passar do teto de 400 requisições.
- Páginas usadas na origem: cerca de 395 de 400 (sondagem, 141 listagens, 221 produtos, 2 políticas e uma rodada abortada).
- Início com pré-render estático da rota `/` para LCP; as demais rotas são SPA (`app.html`).
- Rumo do projeto: é um rascunho para apresentar aos donos da JN. Prioridade para a primeira impressão: vitrines com curadoria manual de fotos (`data/curadoria.json`), sem inventar produto.
- Marca "JN Originals" (linha própria de calça jeans, 9 itens) reconhecida pelo nome do produto.

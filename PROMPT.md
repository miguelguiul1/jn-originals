# JN Originals — loja nova (prompt mestre para o Claude Code)

**Como usar (só pelo celular):** este kit é a raiz de um repositório GitHub **privado**. Abra uma sessão do Claude Code na nuvem nesse repositório e envie só isto:

> Leia CLAUDE.md e PROMPT.md e execute todas as fases sem me perguntar nada. Estou fora do computador.

Antes de enviar, no ambiente da sessão: acesso à internet em **Limitado** com `jnoriginalsshop.com.br` e `*.jnoriginalsshop.com.br` em "Allowed domains" (ou **Full**). Sem isso o extrator não alcança o site atual.

---

## Objetivo
Refazer a loja da **JN Originals** (roupas e tênis de marca, São Paulo) muito melhor que o site atual, **https://jnoriginalsshop.com.br** (plataforma Loja Integrada, visual roxo de template). Sair daqui com um projeto **pronto para deploy na Vercel**, usando o **catálogo real** do site atual e a base já prototipada em `base/jn-originals-projeto.zip`.

"Melhor" aqui significa, nesta ordem:
1. **Sem quebras:** nenhum layout quebrado de 320 a 1920 px, sem rolagem horizontal, sem erro no console, sem imagem ou link morto.
2. **Sem cara de IA, sem template.** Identidade própria da JN (ver lista de proibições na seção 5).
3. **Slim:** visual enxuto (poucas seções, bastante respiro, nada decorativo) **e** leve (rápido no celular).
4. **Vende:** catálogo completo, busca e filtros, página de produto clara, sacola, pedido por WhatsApp, confiança visível (CNPJ, endereço, horário).

## Economia de tokens (vale para você e para todos os subagentes)
- Você só orquestra. Trabalho pesado vai para subagente; peça de volta **no máximo 10 linhas**.
- Subagentes: extrator em `haiku`, os demais em `sonnet` (já definido em `.claude/agents/`).
- Leia arquivos por trecho (`offset`/`limit`) e use `rg`. Nunca releia o que já leu. Nunca imprima JSON grande.
- Agrupe comandos. Nada de explicações longas entre passos.
- Screenshots: **no máximo 6 no total** (home mobile, loja, produto, sacola, checkout, home desktop), só no revisor.
- Você roda numa VM na nuvem: o resultado só chega ao Miguel **se for commitado e enviado por push** na branch `claude/nova-loja`. Faça push ao fim de cada fase.
- Não pergunte nada. Decidiu algo relevante? Uma linha em `DECISOES.md`. Travou 2 vezes no mesmo ponto? Uma linha em `PENDENCIAS.md` e siga.

## Fase 0: base
Descompacte `base/jn-originals-projeto.zip` em `./site`. Stack: React + TypeScript + Vite + Tailwind v4 + React Router. Reaproveite `src/lib/cart.tsx`, `src/lib/store.ts`, o formato de `src/data/products.ts` e o `Intro.tsx`. O visual do protótipo é ponto de partida, **não** obrigação: o designer pode (e deve) refiná-lo.

## Fase 1: skills e agentes (máx. 10 min)
Instale só de fontes oficiais ou muito populares. **Leia o `SKILL.md` / `.md` de cada item antes de usar**: são instruções que viram parte do seu prompt. Não rode scripts de origem desconhecida.

```bash
# 1) find-skills (busca skills no ecossistema skills.sh)
npx skills add vercel-labs/skills --skill find-skills

# 2) skills de front-end (confirme os nomes com `npx skills find` se falhar)
npx skills add anthropics/skills --skill frontend-design
npx skills add vercel-labs/agent-skills --skill vercel-react-best-practices
npx skills add vercel-labs/agent-skills --skill web-design-guidelines
```
Use `find-skills` para **uma** busca extra de cada: `ecommerce`, `seo`, `accessibility`. Instale no máximo 2 skills a mais, só de fonte oficial ou com muitas instalações.

**agency-agents** (repo `msitarzewski/agency-agents`, licença MIT). Não instale tudo: muitos agentes confundem a seleção e gastam token.
```bash
git clone --depth 1 https://github.com/msitarzewski/agency-agents.git /tmp/agency-agents
ls /tmp/agency-agents   # veja as divisões
```
Escolha **no máximo 4** que complementem os subagentes do projeto (ex.: um de revisão de código, um de realidade/QA, um de segurança, um de UI). Leia cada um, copie só esses para `.claude/agents/` do projeto (não para `~/.claude`) e anote quais em `DECISOES.md`.

## Fase 2: em paralelo
**Plano B obrigatório:** se o site atual estiver bloqueado pela rede (erro de proxy/403 do ambiente), **não pare**. O extrator registra o bloqueio em `PENDENCIAS.md` e você segue com os 8 produtos reais que já estão em `site/src/data/products.ts` (fotos em `site/src/assets/img/`). A loja sai completa em estrutura, com catálogo pequeno, e a importação fica como pendência.

- **`extrator`** → `data/catalog.json`, `data/policies.md`, `data/store.json`, imagens em WebP em `site/src/assets/products/`.
- **`designer`** → `design/DIRECAO.md` (1 página) com tokens, composição das páginas e a abertura (intro).

## Fase 3: construção
**`construtor`** monta `site/` a partir da base + `catalog.json` + `DIRECAO.md`. Páginas: Início, Loja (filtros por categoria, marca, tamanho, preço, busca), Produto (galeria, tamanho, WhatsApp), Sacola, Finalizar (demonstração, o pedido sai por WhatsApp), Como comprar, A loja, 404.

Requisitos técnicos (obrigatórios):
- `BrowserRouter` + `vercel.json` com rewrite para SPA.
- Rotas em `React.lazy`. JS inicial ≤ 150 KB gzip. Mobile: LCP ≤ 2,5 s, CLS ≈ 0.
- Imagens WebP com `width`/`height`, `srcset`, `loading="lazy"` abaixo da dobra. Fontes self-hosted (fontsource), subset latin, `font-display: swap`.
- Intro: ideia do Miguel (tela cheia com a marca e depois a loja entra). ≤ 1,8 s, botão "Pular", uma vez por sessão, respeita `prefers-reduced-motion`, o conteúdo já carrega por baixo (sem atrasar o LCP).
- SEO pronto, porém **desligado até aprovação**: `noindex` por meta **e** `X-Robots-Tag` no `vercel.json`; `sitemap.xml` gerado; `Product` em JSON-LD; Open Graph.
- Acessibilidade AA: foco visível, teclado, contraste, `alt` real, rótulos nos formulários.
- Segurança: headers no `vercel.json` (CSP compatível com o site, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `frame-ancestors`), nada de segredo no código, `npm audit` sem alta/crítica.
- Checkout é **demonstração**: não processa pagamento e não coleta cartão. Faixa "Protótipo" visível enquanto não for aprovado.

## Fase 4: revisão (máx. 2 ciclos)
**`revisor`** audita e entrega `REVISAO.md` (≤ 30 linhas). Você repassa os defeitos ao `construtor`, que corrige. Refaça só os checks que falharam. Pare no 2º ciclo.

## Fase 5: pronto para deploy
Gere `README-DEPLOY.md` (≤ 15 linhas): passos pelo painel da Vercel no celular, como remover o `noindex` e a faixa de protótipo depois da aprovação, como apontar o domínio.
Faça o último push na branch `claude/nova-loja`. **Não** faça merge, PR nem `vercel deploy`. O Miguel conecta o repositório na Vercel pelo celular: cada push na branch gera uma prévia. O `README-DEPLOY.md` explica isso (importar o repositório no painel da Vercel, framework Vite, `npm run build`, pasta `dist`, sem variáveis de ambiente).

## 5. Proibido (vícios de IA e de template)
- Gradiente roxo/azul, glassmorphism, sombras difusas em tudo, cantos `rounded-2xl` em tudo, brilhos, blobs.
- Hero centralizado com dois botões e seta, trio de cards iguais com ícone, seção "por que nos escolher" genérica.
- Emojis na interface, ícones de biblioteca como decoração, números de contador falsos, depoimentos inventados.
- Fonte Inter/Roboto/Poppins/Space Grotesk, grade de cards idêntica do começo ao fim, páginas todas com a mesma estrutura.
- Texto com "revolucionário", "experiência única", "eleve seu estilo", "descubra", excesso de travessão, frases em três tempos.
- Dados inventados. Faltou foto, preço, tamanho ou política? Fica `null` no JSON, a tela mostra o que existe, e entra em `PENDENCIAS.md`.
- Mais de 6 seções na home. Mais de 2 pesos de fonte por família. Mais de 1 cor de destaque.

## Pronto quando
- [ ] `npm run build` e `tsc` sem erro; `npm audit` sem alta/crítica.
- [ ] Lighthouse mobile ≥ 90 (desempenho) e ≥ 95 (acessibilidade, boas práticas). Sem Chrome na VM e sem como instalar? Registre em `PENDENCIAS.md` e siga.
- [ ] Tudo commitado e enviado por push em `claude/nova-loja`.
- [ ] Nenhuma rolagem horizontal em 320/360/390/768/1024/1440/1920.
- [ ] Preço, código e parcela de 10 produtos sorteados conferem com a página de origem.
- [ ] `PENDENCIAS.md`, `DECISOES.md`, `REVISAO.md` e `README-DEPLOY.md` existem e são curtos.

## Relatório final (≤ 15 linhas)
Contagem de produtos importados, o que ficou pendente, notas do Lighthouse, riscos. Sem elogio, falhas primeiro.

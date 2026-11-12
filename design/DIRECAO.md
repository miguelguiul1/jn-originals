# JN Originals: direção visual (slim)

## 1. Princípios
- Calma e precisão: a foto e o preço mandam; o resto some.
- Um único destaque (vermelho), usado só em ação e estado (Comprar, desconto, foco). Nunca em decoração.
- Títulos em peso 500, caixa de frase, escala contida. Sem caixa-alta em rótulos, sem numeração decorativa.
- Densidade no catálogo, respiro fora dele. Toda foto vive numa moldura neutra uniforme.
- Movimento só quando responde a um gesto, exceto a abertura (único momento teatral).

## 2. Tokens
**Cor** (4 neutras + 1 destaque; contraste WCAG calculado)
| token | hex | uso | contraste |
|---|---|---|---|
| `--paper` | `#F6F5F2` | fundo da página | tinta 16,76:1 |
| `--frame` | `#EBE9E3` | moldura atrás das fotos, superfícies | tinta 15,05:1 |
| `--ink` | `#151514` | texto, botão primário, intro | sobre paper 16,76:1 |
| `--muted` | `#5C5A53` | texto secundário, preço antigo | paper 6,33:1; frame 5,69:1 |
| `--line` | `#D6D3CA` | divisores (decorativo, sem texto) | 1,37:1, ok |
| `--signal` | `#BC2C16` | CTA, desconto, foco | paper 5,49:1; frame 4,93:1; texto paper sobre signal 5,49:1 |
Bordas de campos de formulário e controles: `#8C897F` (3,21:1 sobre paper, mínimo 3:1 para componentes). Foco: anel 2px `--signal`, offset 3px. Texto da intro: paper sobre ink 16,76:1. Proibido texto `--signal` sobre fundos mais escuros que `--frame`.

**Tipografia** (self-hosted via fontsource, só variáveis, 2 famílias, 2 pesos cada)
- Display: `@fontsource-variable/big-shoulders-display` (mantida: é a assinatura condensada da marca). Pesos 500 e 700 (700 só no logotipo/intro). Caixa de frase, `letter-spacing: 0`, `line-height: 1.05`.
- Texto/UI: `@fontsource-variable/hanken-grotesk`. Pesos 400 e 600. Sem fonte mono: dados técnicos (tamanho, SKU, preço) usam `font-variant-numeric: tabular-nums` em Hanken.
- Escala (rem, base 16 px; display fluido com clamp): `--t-xs .75` (rótulo mínimo 12 px) / `--t-sm .875` / `--t-md 1` / `--t-lg 1.25` / `--t-xl 1.75` / `--t-2xl clamp(2rem, 1.4rem + 2.4vw, 3.25rem)` (máximo da home). Corpo 1rem/1.55; linha ≤ 68 caracteres.

**Espaço** base 4 px: `4 8 12 16 24 32 48 80 128` px (`--s-1`..`--s-9`). Gutter 16 px (mobile), 32 px (≥ 1024). Largura máx. 1360 px.
**Raios:** `--r-s 2px` (campos, botões, cards), `--r-m 6px` (gavetas, popovers). Nada de pílulas, nada maior que 6 px.
**Sombra:** nenhuma em repouso; só gaveta/popover: `0 8px 24px rgb(21 21 20 / .12)`.
**Movimento:** `--ease-out: cubic-bezier(.22,.61,.36,1)`, `--ease-io: cubic-bezier(.65,0,.35,1)`. Durações: micro 120 ms (hover, press), padrão 220 ms (gaveta, filtro), saída da intro 480 ms. Sem animação de entrada por seção, sem hover que mexa no layout. `prefers-reduced-motion`: tudo vira fade ≤ 100 ms ou some.

## 3. Composição por página
- **Início (5 seções):** (1) cabeçalho + faixa de uma linha com "12x no cartão · Pedido pelo WhatsApp" (só se confirmado); (2) vitrine assimétrica: 1 destaque grande + 4 produtos recentes; (3) categorias como lista tipográfica de texto, com contagem real; (4) trilha horizontal "Tênis" com cards; (5) rodapé com CNPJ 49.009.219/0001-40, endereço e WhatsApp. Sem hero centralizado, sem trio de cards.
- **Loja:** barra de filtros fixa à esquerda (desktop) / gaveta (mobile); grade densa 2 col (mobile), 3 (≥ 768), 4 (≥ 1100), 5 (≥ 1440); ordenar e busca no topo; paginar por "Ver mais" com contagem "48 de 312". Filtros: categoria, marca, tamanho, preço.
- **Produto:** galeria à esquerda (miniaturas em coluna, foto na moldura), coluna fixa à direita: nome, preço, parcelas (12x), tamanho, "Adicionar à sacola"; abaixo: detalhes só com dados existentes; fim: itens da mesma categoria.
- **Sacola:** lista em linhas (foto 72 px, nome, tamanho, quantidade, remover) + resumo fixo à direita com total e botão; vazia vira convite com link para a Loja.
- **Finalizar:** uma coluna estreita (≤ 560 px): nome, entrega, resumo do pedido, botão "Enviar pedido no WhatsApp". Sem cabeçalho de loja, sem distrações.
- **Como comprar:** passos reais numerados (aqui a numeração é sequência verdadeira), texto em coluna de 60 ch, ilustrado só por tipografia.
- **A loja:** texto editorial em duas colunas assimétricas (texto + dados da empresa: CNPJ, cidade); foto da loja só se houver.
- **404:** frase curta, busca e as 4 categorias maiores; fundo paper, sem ilustração.

## 4. Componentes-chave
- **Card de produto:** proporção 1:1, moldura `--frame` com `object-fit: contain`, padding interno 8% (fotos brancas e de WhatsApp ficam uniformes; `mix-blend-mode: multiply` na foto sobre a moldura para fundir branco). Abaixo: marca (xs, muted), nome (sm, 600, 2 linhas máx.), preço (md, tabular) e "12x R$ x" (xs, muted). Selo de desconto só se houver preço antigo (`--signal`, texto paper). Hover: o fundo da moldura vai a `#E4E1DA` em 120 ms; sem zoom.
- **Imagens:** `srcset` 320/480/720/1080 px (nunca 2500), `loading=lazy` exceto as 4 primeiras, `width/height` fixos para evitar CLS.
- **Filtros:** grupos recolhíveis, chips de seleção com contagem; filtros ativos viram linha removível acima da grade. Alvo de toque ≥ 44 px.
- **Galeria:** foto principal na moldura, miniaturas 56 px, setas por teclado, zoom por toque só se resolução ≥ 1200 px.
- **Sacola:** gaveta lateral 420 px (r-m); contador no cabeçalho em texto, sem badge colorido.
- **Botões:** primário `--ink` com texto paper (altura 48 px, r-s); CTA de compra `--signal`; secundário com borda `#8C897F`. Sem setas decorativas nem ícones de biblioteca.

## 5. Abertura (intro)
- Overlay `position: fixed; inset: 0` em `--ink`, `z-index` acima de tudo, **sobre o conteúdo já renderizado** (a home monta e pinta normalmente; LCP não espera a intro e a intro não tem imagem).
- Conteúdo: só o logotipo "JN Originals" (itálico, Big Shoulders 700, paper) centralizado, com a faixa fina `--signal` crescendo sob ele. Sem contador, sem foto.
- Linha do tempo (total 1,6 s, teto 1,8 s): 0 a 500 ms logotipo sobe 12 px e entra (`--ease-out`); 300 a 900 ms faixa `scaleX` 0 a 1; 900 a 1120 ms pausa; 1120 a 1600 ms overlay sai com `clip-path: inset(0 0 100% 0)` (`--ease-io`), revelando a loja. Só `transform`/`clip-path`/`opacity`.
- **Pular:** botão de texto "Pular" canto inferior direito, foco visível, também por Esc e clique/toque em qualquer ponto; encerra em ≤ 200 ms.
- **1x por sessão:** `sessionStorage['jn-intro']='1'` ao iniciar; ler/gravar dentro de `try/catch` (se falhar, não exibe). Não mostrar em rotas diferentes de `/` (link direto a produto não vê intro).
- **`prefers-reduced-motion: reduce`:** intro não é montada.
- Acessibilidade: `role="presentation"`, `aria-hidden="true"` no overlay, conteúdo atrás recebe `inert` só enquanto visível; scroll bloqueado apenas durante os 1,6 s; sem JS, a intro não existe.

## 6. Proibições aplicáveis (PROMPT.md, seção 5)
- Sem gradientes, glassmorphism, brilhos, blobs, sombras difusas, `rounded-2xl`: raios 2/6 px, sombra só em gaveta.
- Sem hero centralizado com dois botões, sem trio de cards com ícone, sem "por que nos escolher".
- Sem emojis, ícones decorativos, contadores falsos, depoimentos; nenhuma cópia com "descubra", "eleve seu estilo", "experiência única".
- Sem Inter/Roboto/Poppins/Space Grotesk; máx. 2 pesos por família; 1 só cor de destaque.
- Grade de produtos varia de ritmo (vitrine assimétrica, trilha, grade densa) e cada página tem estrutura própria; home ≤ 6 seções.
- Dado ausente (preço, tamanho, política, foto) fica `null`: a tela omite o campo e entra em `PENDENCIAS.md`. Nada inventado.

## Mudanças em relação ao protótipo
Fundo `#EFEBE4` para `#F6F5F2` + moldura `#EBE9E3`; vermelho `#E4452B` (3,41:1 sobre o paper antigo, reprovava AA em texto) para `#BC2C16`; display de peso 900 caixa-alta para 500 caixa de frase; mono removida; intro de 2,4 s com contador para 1,6 s só com logotipo.
